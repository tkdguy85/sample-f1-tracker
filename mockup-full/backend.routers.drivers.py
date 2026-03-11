"""
app/routers/drivers.py
CRUD for /drivers
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Driver, Team
from ..schemas import DriverCreate, DriverRead, DriverUpdate

router = APIRouter(prefix="/drivers", tags=["drivers"])


@router.get("/", response_model=list[DriverRead])
def list_drivers(db: Session = Depends(get_session)):
    return db.exec(select(Driver)).all()


@router.get("/{driver_id}", response_model=DriverRead)
def get_driver(driver_id: str, db: Session = Depends(get_session)):
    driver = db.get(Driver, driver_id)
    if not driver:
        raise HTTPException(404, f"Driver '{driver_id}' not found")
    return driver


@router.post("/", response_model=DriverRead, status_code=201)
def create_driver(payload: DriverCreate, db: Session = Depends(get_session)):
    if db.get(Driver, payload.id):
        raise HTTPException(409, f"Driver '{payload.id}' already exists")
    if not db.get(Team, payload.team_id):
        raise HTTPException(422, f"Team '{payload.team_id}' does not exist")
    driver = Driver(**payload.model_dump())
    db.add(driver)
    db.commit()
    db.refresh(driver)
    return driver


@router.patch("/{driver_id}", response_model=DriverRead)
def update_driver(driver_id: str, payload: DriverUpdate, db: Session = Depends(get_session)):
    driver = db.get(Driver, driver_id)
    if not driver:
        raise HTTPException(404, f"Driver '{driver_id}' not found")
    data = payload.model_dump(exclude_none=True)
    if "team_id" in data and not db.get(Team, data["team_id"]):
        raise HTTPException(422, f"Team '{data['team_id']}' does not exist")
    for field, value in data.items():
        setattr(driver, field, value)
    db.commit()
    db.refresh(driver)
    return driver


@router.delete("/{driver_id}", status_code=204)
def delete_driver(driver_id: str, db: Session = Depends(get_session)):
    driver = db.get(Driver, driver_id)
    if not driver:
        raise HTTPException(404, f"Driver '{driver_id}' not found")
    db.delete(driver)
    db.commit()
