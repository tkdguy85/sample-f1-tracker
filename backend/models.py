from typing import Optional, List
from sqlmodel import Field, Relationship, SQLModel


#* TEAMS *#
class Team(SQLModel, table=True):
  __tablename__ = "teams"
  
  id: str = Field(primary_key=True)
  name: str
  color: str
  drivers: List["Driver"] = Relationship(back_populates="team_rel")


#* DRIVERS *#
class Driver(SQLModel, table=True):
  __tablename__ = "drivers"
  
  id: str = Field(primary_key=True)
  name: str
  number: int
  team_id: str = Field(foreign_key="teams.id")
  flag: str
  team_rel: Optional[Team] = Relationship(back_populates="drivers")


#* RACES *#
class Race(SQLModel, table=True):
  __tablename__ = "races"
  
  id: str = Field(primary_key=True)
  round: int
  name: str
  circuit: str
  country: str
  flag: str
  date: str
  city: str
  sprint: bool=False
  laps: int
  length: float
  lap_record_time: str = "TBD"
  lap_record_holder: str = "-"
  lap_record_year: Optional[int] = None
  sessions: List["Session"] = Relationship(back_populates="race_rel")


#* SESSIONS *#
class Session(SQLModel, table=True):
  # Session types refer to FP1, Q, Race, etc
  __tablename__ = "sessions"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  race_id: str = Field(foreign_key="races.id")
  session_type: str
  race_rel: Optional[Race] = Relationship(back_populates="sessions")
  entries: List["SessionEntry"] = Relationship(back_populates="session_rel") 


#* SESSION ENTRIES *#
class SessionEntry(SQLModel, table=True):
  __tablename__ = "session_entries"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  session_id: int = Field(foreign_key="sessions.id")
  driver_id: str = Field(foreign_key="drivers.id")
  position: Optional[int] = None
  status: Optional[str] = None
  time: Optional[str] = None
  laps: Optional[int] = None
  points: Optional[int] = None
  session_rel: Optional[Session] = Relationship(back_populates="entries")
