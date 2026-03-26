"""
    Computed read-only endpoints consumed by the React frontend:
        GET /standings      → driver + team championship tables
        GET /grid              → full season-grid payload (one fetch for everything)
"""

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..db import get_session
from ..models import Team, Driver, Race, Session as DBSession, SessionEntry
from ..schemas import (
  DriverStandingEntry, TeamStandingEntry, Standings,
  DriverRead, TeamRead, RaceRead,
  GridCell, SeasonGrid,
)

router = APIRouter(tags=["standings"])

RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1]


def _points_map(db: Session) -> tuple[dict[str, int], dict[str, int]]:
  drivers = db.exec(select(Driver)).all()
  driver_pts: dict[str, int] = {driver.id: 0 for driver in drivers}
  team_pts: dict[str, int] = {driver.team_id: 0 for driver in drivers}

  entries = db.exec(select(SessionEntry)).all()
  session_types: dict[int, str] = {}

  sessions = db.exec(select(DBSession)).all()
  for session in sessions:
    session_types[session.id] = session.session_type

  for entry in entries:
    st = session_types.get(entry.session_id, "")
    if st in ("race", "sprint") and entry.points:
      driver_pts[entry.driver_id] = driver_pts.get(entry.driver_id, 0) + entry.points
      driver = db.get(Driver, entry.driver_id)
      if driver:
        team_pts[driver.team_id] = team_pts.get(driver.team_id, 0) + entry.points

  return driver_pts, team_pts


@router.get("/standings", response_model=Standings)
def get_standings(db: Session = Depends(get_session)):
  driver_pts, team_pts = _points_map(db)

  drivers = db.exec(select(Driver)).all()
  teams = db.exec(select(Team)).all()

  sorted_drivers = sorted(drivers, key=lambda driver: driver_pts.get(driver.id, 0), reverse=True)
  sorted_teams = sorted(teams,   key=lambda team: team_pts.get(team.id, 0),   reverse=True)

  return Standings(
    drivers = [
      DriverStandingEntry(
        position = pos + 1,
        driver_id = driver.id,
        name = driver.name,
        team_id = driver.team_id,
        points = driver_pts.get(driver.id, 0),
      )
      for pos, driver in enumerate(sorted_drivers)
    ],
    teams = [
      TeamStandingEntry(
        position = pos + 1,
        team_id = team.id,
        name = team.name,
        points = team_pts.get(team.id, 0),
      )
      for pos, team in enumerate(sorted_teams)
    ],
  )


@router.get("/grid", response_model=SeasonGrid)
def get_season_grid(db: Session = Depends(get_session)):
  """
      Single endpoint that returns everything the React grid needs:
      races, drivers, teams, and every session entry as a flat list of GridCells.
      The FE groups and renders from there.
    """
  races = db.exec(select(Race).order_by(Race.round)).all()
  drivers = db.exec(select(Driver)).all()
  teams = db.exec(select(Team)).all()

  sessions = db.exec(select(DBSession)).all()
  session_map: dict[int, DBSession] = {session.id: session for session in sessions}

  entries = db.exec(select(SessionEntry)).all()
  driver_map = {driver.id: driver for driver in drivers}

  cells: list[GridCell] = []
  for entry in entries:
    session = session_map.get(entry.session_id)
    if not session:
      continue
    driver = driver_map.get(entry.driver_id)
    cells.append(GridCell(
      race_id = session.race_id,
      session_type = session.session_type,
      driver_id = entry.driver_id,
      team_id = driver.team_id if driver else None,
      position = entry.position,
      status = entry.status,
      time = entry.time,
      laps = entry.laps,
      points = entry.points,
    ))

  return SeasonGrid(
    races = [RaceRead.model_validate(race) for race in races],
    drivers = [DriverRead.model_validate(driver) for driver in drivers],
    teams = [TeamRead.model_validate(team) for team in teams],
    cells = cells,
  )
