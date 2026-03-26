from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Team
from ..schemas import TeamCreate, TeamRead, TeamUpdate

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/", response_model=list[TeamRead])
def list_teams(db: Session = Depends(get_session)):
  return db.exec(select(Team)).all()


@router.get("/{team_id}", response_model=TeamRead)
def get_team(team_id: str, db: Session = Depends(get_session)):
  team = db.get(Team, team_id)
  if not team:
    raise HTTPException(404, f"Team '{team_id}' not found")
  return team


@router.post("/", response_model=TeamRead, status_code=201)
def create_team(payload: TeamCreate, db: Session = Depends(get_session)):
  if db.get(Team, payload.id):
    raise HTTPException(409, f"Team '{payload.id}' already exists")
  team = Team(**payload.model_dump())
  db.add(team)
  db.commit()
  db.refresh(team)
  return team


@router.patch("/{team_id}", response_model=TeamRead)
def update_team(team_id: str, payload: TeamUpdate, db: Session = Depends(get_session)):
  team = db.get(Team, team_id)
  if not team:
    raise HTTPException(404, f"Team '{team_id}' not found")
  for field, value in payload.model_dump(exclude_none=True).items():
    setattr(team, field, value)
  db.commit()
  db.refresh(team)
  return team


@router.delete("/{team_id}", status_code=204)
def delete_team(team_id: str, db: Session = Depends(get_session)):
  team = db.get(Team, team_id)
  if not team:
    raise HTTPException(404, f"Team '{team_id}' not found")
  db.delete(team)
  db.commit()
