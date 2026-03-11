"""
app/models.py
SQLModel table definitions — single source of truth for the DB schema.
"""

from __future__ import annotations

from typing import Optional
from sqlmodel import Field, Relationship, SQLModel


# ── Teams ────────────────────────────────────────────────────────────────────

class Team(SQLModel, table=True):
    __tablename__ = "teams"

    id:     str = Field(primary_key=True)   # e.g. "mclaren"
    name:   str
    color:  str                              # hex, e.g. "#FF8000"

    drivers: list["Driver"] = Relationship(back_populates="team_rel")


# ── Drivers ──────────────────────────────────────────────────────────────────

class Driver(SQLModel, table=True):
    __tablename__ = "drivers"

    id:      str           = Field(primary_key=True)   # e.g. "norris"
    name:    str
    number:  int
    team_id: str           = Field(foreign_key="teams.id")
    flag:    str                                        # emoji

    team_rel: Optional[Team] = Relationship(back_populates="drivers")


# ── Races ────────────────────────────────────────────────────────────────────

class Race(SQLModel, table=True):
    __tablename__ = "races"

    id:              str  = Field(primary_key=True)   # e.g. "r01"
    round:           int
    name:            str
    circuit:         str
    country:         str
    flag:            str
    date:            str
    city:            str
    sprint:          bool = False
    laps:            int
    length:          float                            # km
    lap_record_time: str  = "TBD"
    lap_record_holder: str = "—"
    lap_record_year: Optional[int] = None

    sessions: list["Session"] = Relationship(back_populates="race_rel")


# ── Sessions ─────────────────────────────────────────────────────────────────
# One row per session per race.
# session_type: "fp1" | "fp2" | "fp3" | "sq" | "sprint" | "q" | "race"

class Session(SQLModel, table=True):
    __tablename__ = "sessions"

    id:           Optional[int] = Field(default=None, primary_key=True)
    race_id:      str           = Field(foreign_key="races.id")
    session_type: str           # fp1 / fp2 / fp3 / sq / sprint / q / race

    race_rel: Optional[Race] = Relationship(back_populates="sessions")
    entries:  list["SessionEntry"] = Relationship(back_populates="session_rel")


# ── SessionEntries ────────────────────────────────────────────────────────────
# One row per driver per session.

class SessionEntry(SQLModel, table=True):
    __tablename__ = "session_entries"

    id:         Optional[int] = Field(default=None, primary_key=True)
    session_id: int           = Field(foreign_key="sessions.id")
    driver_id:  str           = Field(foreign_key="drivers.id")
    position:   Optional[int] = None       # classified position (or NULL for DNF/DNS/DSQ)
    status:     Optional[str] = None       # "DNF" | "DNS" | "DSQ" | NULL
    time:       Optional[str] = None       # "1:23:06.801" or "+2.974"
    laps:       Optional[int] = None
    points:     Optional[int] = None

    session_rel: Optional[Session] = Relationship(back_populates="entries")
