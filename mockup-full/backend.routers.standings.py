"""
app/routers/standings.py
Computed read-only endpoints consumed by the React frontend:
  GET /standings          → driver + team championship tables
  GET /grid               → full season-grid payload (one fetch for everything)
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

RACE_POINTS   = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1]


def _points_map(db: Session) -> tuple[dict[str, int], dict[str, int]]:
    """Returns (driver_pts, team_pts) dicts, summing race + sprint points."""
    drivers  = db.exec(select(Driver)).all()
    driver_pts: dict[str, int] = {d.id: 0 for d in drivers}
    team_pts:   dict[str, int] = {d.team_id: 0 for d in drivers}

    entries = db.exec(select(SessionEntry)).all()
    session_types: dict[int, str] = {}

    sessions = db.exec(select(DBSession)).all()
    for s in sessions:
        session_types[s.id] = s.session_type

    for e in entries:
        st = session_types.get(e.session_id, "")
        if st in ("race", "sprint") and e.points:
            driver_pts[e.driver_id] = driver_pts.get(e.driver_id, 0) + e.points
            driver = db.get(Driver, e.driver_id)
            if driver:
                team_pts[driver.team_id] = team_pts.get(driver.team_id, 0) + e.points

    return driver_pts, team_pts


@router.get("/standings", response_model=Standings)
def get_standings(db: Session = Depends(get_session)):
    driver_pts, team_pts = _points_map(db)

    drivers = db.exec(select(Driver)).all()
    teams   = db.exec(select(Team)).all()

    sorted_drivers = sorted(drivers, key=lambda d: driver_pts.get(d.id, 0), reverse=True)
    sorted_teams   = sorted(teams,   key=lambda t: team_pts.get(t.id, 0),   reverse=True)

    return Standings(
        drivers=[
            DriverStandingEntry(
                position=i + 1,
                driver_id=d.id,
                name=d.name,
                team_id=d.team_id,
                points=driver_pts.get(d.id, 0),
            )
            for i, d in enumerate(sorted_drivers)
        ],
        teams=[
            TeamStandingEntry(
                position=i + 1,
                team_id=t.id,
                name=t.name,
                points=team_pts.get(t.id, 0),
            )
            for i, t in enumerate(sorted_teams)
        ],
    )


@router.get("/grid", response_model=SeasonGrid)
def get_season_grid(db: Session = Depends(get_session)):
    """
    Single endpoint that returns everything the React grid needs:
    races, drivers, teams, and every session entry as a flat list of GridCells.
    The FE groups and renders from there.
    """
    races   = db.exec(select(Race).order_by(Race.round)).all()
    drivers = db.exec(select(Driver)).all()
    teams   = db.exec(select(Team)).all()

    sessions = db.exec(select(DBSession)).all()
    session_map: dict[int, DBSession] = {s.id: s for s in sessions}

    entries = db.exec(select(SessionEntry)).all()
    driver_map = {d.id: d for d in drivers}

    cells: list[GridCell] = []
    for e in entries:
        s = session_map.get(e.session_id)
        if not s:
            continue
        driver = driver_map.get(e.driver_id)
        cells.append(GridCell(
            race_id=s.race_id,
            session_type=s.session_type,
            driver_id=e.driver_id,
            team_id=driver.team_id if driver else None,
            position=e.position,
            status=e.status,
            time=e.time,
            laps=e.laps,
            points=e.points,
        ))

    return SeasonGrid(
        races=[RaceRead.model_validate(r)   for r in races],
        drivers=[DriverRead.model_validate(d) for d in drivers],
        teams=[TeamRead.model_validate(t)   for t in teams],
        cells=cells,
    )
