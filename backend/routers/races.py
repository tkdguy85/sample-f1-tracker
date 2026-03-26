from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Race, Session as DBSession, SessionEntry
from ..schemas import (
  RaceCreate, RaceRead, RaceUpdate,
  SessionRead, SessionEntryRead,
  WeekendWrite,
)

router = APIRouter(prefix="/races", tags=["races"])


# * RACES Builder *

@router.get("/", response_model=list[RaceRead])
def list_races(db: Session = Depends(get_session)):
  return db.exec(select(Race).order_by(Race.round)).all()


@router.get("/{race_id}", response_model=RaceRead)
def get_race(race_id: str, db: Session = Depends(get_session)):
  race = db.get(Race, race_id)
  if not race:
    raise HTTPException(404, f"Race '{race_id}' not found")
  return race


@router.post("/", response_model=RaceRead, status_code=201)
def create_race(payload: RaceCreate, db: Session = Depends(get_session)):
  if db.get(Race, payload.id):
    raise HTTPException(409, f"Race '{payload.id}' already exists")
  race = Race(**payload.model_dump())
  db.add(race)
  db.commit()
  db.refresh(race)
  return race


@router.patch("/{race_id}", response_model=RaceRead)
def update_race(race_id: str, payload: RaceUpdate, db: Session = Depends(get_session)):
  race = db.get(Race, race_id)
  if not race:
    raise HTTPException(404, f"Race '{race_id}' not found")
  for field, value in payload.model_dump(exclude_none=True).items():
    setattr(race, field, value)
  db.commit()
  db.refresh(race)
  return race


@router.delete("/{race_id}", status_code=204)
def delete_race(race_id: str, db: Session = Depends(get_session)):
  race = db.get(Race, race_id)
  if not race:
    raise HTTPException(404, f"Race '{race_id}' not found")
  db.delete(race)
  db.commit()


# * SESSION data

@router.get("/{race_id}/sessions", response_model=list[SessionRead])
def list_sessions(race_id: str, db: Session = Depends(get_session)):
  # Return all sessions + entries for a race.
  if not db.get(Race, race_id):
    raise HTTPException(404, f"Race '{race_id}' not found")
  sessions = db.exec(
    select(DBSession).where(DBSession.race_id == race_id)
  ).all()
  result = []
  for session in sessions:
    entries = db.exec(
      select(SessionEntry).where(SessionEntry.session_id == session.id)
    ).all()
    result.append(SessionRead(
      id=session.id,
      race_id=session.race_id,
      session_type=session.session_type,
      entries=[SessionEntryRead.model_validate(entry) for entry in entries],
    ))
  return result


# * WEEKEND ROUND UP

@router.put("/{race_id}/weekend")
def upsert_weekend(
  race_id: str,
  payload: WeekendWrite,
  db: Session = Depends(get_session),
):
  # Replace all data for race weekend. Multiple calls are ok.
  race = db.get(Race, race_id)
  if not race:
    raise HTTPException(404, f"Race '{race_id}' not found")

  # Wipe existing sessions for this race
  existing_sessions = db.exec(
    select(DBSession).where(DBSession.race_id == race_id)
  ).all()
  for session in existing_sessions:
    entries = db.exec(
      select(SessionEntry).where(SessionEntry.session_id == session.id)
    ).all()
    for entry in entries:
      db.delete(entry)
    db.delete(session)
  db.flush()

  # Insert new sessions
  for session_payload in payload.sessions:
    new_session = DBSession(race_id=race_id, session_type=session_payload.session_type)
    db.add(new_session)
    db.flush()  # get the auto-incremented id

    for entry in session_payload.entries:
      db.add(SessionEntry(
        session_id=new_session.id,
        **entry.model_dump(),
      ))

  db.commit()
  return {"ok": True, "race_id": race_id, "sessions": len(payload.sessions)}
