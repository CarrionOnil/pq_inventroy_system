# backend/app/routers/locations.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()  


class Location(BaseModel):
    id: Optional[int] = None
    name: str
    type: str = "Internal Location"
    company: str = "My Company"

fake_locations: List[Location] = []

@router.get("/locations", response_model=List[Location])
def get_locations():
    return fake_locations

@router.post("/locations", response_model=Location)
def add_location(location: Location):
    location.id = (max([l.id or 0 for l in fake_locations]) + 1) if fake_locations else 1
    fake_locations.append(location)
    return location
