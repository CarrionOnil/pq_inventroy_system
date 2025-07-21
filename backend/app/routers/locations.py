# backend/app/routers/locations.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class Location(BaseModel):
    id: Optional[int] = None
    name: str
    locationType: str = "Internal Location"
    storageCategory: Optional[str] = ""
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

@router.put("/locations/{location_id}", response_model=Location)
def update_location(location_id: int, updated_location: Location):
    for idx, loc in enumerate(fake_locations):
        if loc.id == location_id:
            updated_location.id = location_id
            fake_locations[idx] = updated_location
            return updated_location
    raise HTTPException(status_code=404, detail="Location not found")

@router.delete("/locations/{location_id}", response_model=dict)
def delete_location(location_id: int):
    global fake_locations
    fake_locations = [loc for loc in fake_locations if loc.id != location_id]
    return {"message": "Location deleted"}


