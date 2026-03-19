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


# * RACES * 


# * SESSIONS * 


# * WEEKEND WRAP UP * 


# * SEASON STANDINGS * 


# * FULL GRID #
