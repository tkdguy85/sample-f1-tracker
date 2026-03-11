"""
app/schemas.py
Pydantic (v2) schemas used for API request validation and response shaping.
These are deliberately separate from the SQLModel table classes so the API
contract can evolve independently of the DB schema.
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


# ── Teams ────────────────────────────────────────────────────────────────────

class TeamCreate(BaseModel):
    id:    str
    name:  str
    color: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")

class TeamUpdate(BaseModel):
    name:  Optional[str] = None
    color: Optional[str] = Field(default=None, pattern=r"^#[0-9A-Fa-f]{6}$")

class TeamRead(BaseModel):
    id:    str
    name:  str
    color: str

    model_config = {"from_attributes": True}


# ── Drivers ──────────────────────────────────────────────────────────────────

class DriverCreate(BaseModel):
    id:      str
    name:    str
    number:  int
    team_id: str
    flag:    str

class DriverUpdate(BaseModel):
    name:    Optional[str] = None
    number:  Optional[int] = None
    team_id: Optional[str] = None
    flag:    Optional[str] = None

class DriverRead(BaseModel):
    id:      str
    name:    str
    number:  int
    team_id: str
    flag:    str

    model_config = {"from_attributes": True}


# ── Races ────────────────────────────────────────────────────────────────────

class RaceCreate(BaseModel):
    id:                str
    round:             int
    name:              str
    circuit:           str
    country:           str
    flag:              str
    date:              str
    city:              str
    sprint:            bool  = False
    laps:              int
    length:            float
    lap_record_time:   str   = "TBD"
    lap_record_holder: str   = "—"
    lap_record_year:   Optional[int] = None

class RaceUpdate(BaseModel):
    name:              Optional[str]   = None
    circuit:           Optional[str]   = None
    country:           Optional[str]   = None
    flag:              Optional[str]   = None
    date:              Optional[str]   = None
    city:              Optional[str]   = None
    sprint:            Optional[bool]  = None
    laps:              Optional[int]   = None
    length:            Optional[float] = None
    lap_record_time:   Optional[str]   = None
    lap_record_holder: Optional[str]   = None
    lap_record_year:   Optional[int]   = None

class RaceRead(BaseModel):
    id:                str
    round:             int
    name:              str
    circuit:           str
    country:           str
    flag:              str
    date:              str
    city:              str
    sprint:            bool
    laps:              int
    length:            float
    lap_record_time:   str
    lap_record_holder: str
    lap_record_year:   Optional[int]

    model_config = {"from_attributes": True}


# ── Sessions & Entries ────────────────────────────────────────────────────────

class SessionEntryWrite(BaseModel):
    driver_id: str
    position:  Optional[int] = None
    status:    Optional[str] = None   # DNF | DNS | DSQ
    time:      Optional[str] = None
    laps:      Optional[int] = None
    points:    Optional[int] = None

class SessionEntryRead(SessionEntryWrite):
    id:         int
    session_id: int

    model_config = {"from_attributes": True}

class SessionWrite(BaseModel):
    """Used to create or fully replace a session's entries."""
    session_type: str   # fp1 | fp2 | fp3 | sq | sprint | q | race
    entries:      list[SessionEntryWrite]

class SessionRead(BaseModel):
    id:           int
    race_id:      str
    session_type: str
    entries:      list[SessionEntryRead]

    model_config = {"from_attributes": True}


# ── Bulk weekend upsert ───────────────────────────────────────────────────────

class WeekendWrite(BaseModel):
    """
    POST /races/{race_id}/weekend
    Replaces all session data for an entire race weekend in one shot.
    Keys are session_type strings; values are lists of entry dicts.
    """
    sessions: list[SessionWrite]


# ── Standings (computed, read-only) ──────────────────────────────────────────

class DriverStandingEntry(BaseModel):
    position:  int
    driver_id: str
    name:      str
    team_id:   str
    points:    int

class TeamStandingEntry(BaseModel):
    position:  int
    team_id:   str
    name:      str
    points:    int

class Standings(BaseModel):
    drivers: list[DriverStandingEntry]
    teams:   list[TeamStandingEntry]


# ── Full grid payload (FE-ready) ─────────────────────────────────────────────

class GridCell(BaseModel):
    """A single cell in the season grid."""
    race_id:      str
    session_type: str
    driver_id:    Optional[str]
    team_id:      Optional[str]
    position:     Optional[int]
    status:       Optional[str]
    time:         Optional[str]
    laps:         Optional[int]
    points:       Optional[int]

class SeasonGrid(BaseModel):
    races:   list[RaceRead]
    drivers: list[DriverRead]
    teams:   list[TeamRead]
    cells:   list[GridCell]
