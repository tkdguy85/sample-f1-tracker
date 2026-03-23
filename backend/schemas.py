# imports
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field

# * TEAMS * 
class TeamCreate(BaseModel):
  id: str
  name: str
  color: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")

class TeamUpdate(BaseModel):
  name: Optional[str] = None
  color: Optional[str] = Field(default=None, pattern=r"^#[0-9A-Fa-f]{6}$")

class TeamRead(BaseModel):
  id: str
  name: str
  color: str
  
  model_config = {"from_attributes": True}
    
# * DRIVES * 
class DriverCreate(BaseModel):
  id: str
  name: str
  number: str
  team_id: str
  flag: str
  
class DriverUpdate(BaseModel):
  name: Optional[str] = None
  number: Optional[int] = None
  team_id: Optional[str] = None
  flag: Optional[str] = None
  
class DriverRead(BaseModel):
  id: str
  name: str
  number: int
  team_id: str
  flag: str
  
  model_config = {"from_attributes": True}

# * RACES * 
class RaceCreate(BaseModel):
  id: str
  round: int
  name: str
  circuit: str
  country: str
  flag: str
  date: str
  city: str
  sprint: bool = False
  laps: int
  length: float
  lap_record_time: str = "TBD"
  lap_record_holder: str = "-"
  lap_record_year: Optional[int] = None

class RaceUpdate(BaseModel):
  name: Optional[str] = None
  circuit: Optional[str] = None
  country: Optional[str] = None
  flag: Optional[str] = None
  date: Optional[str] = None
  city: Optional[str] = None
  sprint: Optional[bool] = None
  laps: Optional[int] = None
  length: Optional[float] = None
  lap_record_time: Optional[str] = None
  lap_record_holder: Optional[str] = None
  lap_record_year: Optional[int] = None

class RaceRead(BaseModel):
  id: str
  round: int
  name: str
  circuit: str
  country: str
  flag: str
  date: str
  city: str
  sprint: bool
  laps: int
  length: float
  lap_record_time: str
  lap_record_holder: str
  lap_record_year: Optional[int]

  model_config = {"from_attributes": True}

# * SESSIONS * 
class SessionEntryWrite(BaseModel):
  driver_id: str
  position: Optional[int] = None
  status: Optional[str] = None # DNS/DSQ/DNF etc...
  time: Optional[str] = None
  laps: Optional[int] = None
  points: Optional[int] = None
  
class SessionEntryRead(SessionEntryWrite):
  id: int
  session_id: int
  
  model_config = {"from_attributes": True}
  
class SessionWrite(BaseModel):
  session_type: str #FP1, 2, 3, Sprint, Race ...etc
  entries: list[SessionEntryWrite]
  
class SessionRead(BaseModel):
  id: int
  race_id: str
  session_type: str
  entries: list[SessionEntryRead]
  
  model_config = {"from_attributes": True}

# * WEEKEND WRAP UP * 


# * SEASON STANDINGS * 


# * FULL GRID #
