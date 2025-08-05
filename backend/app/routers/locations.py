# backend/app/routers/locations.py

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, constr
from typing import List, Optional

router = APIRouter()

class Location(BaseModel):
    id: Optional[int] = None
    name: constr(strip_whitespace=True, min_length=2)  # Name validation
    locationType: str = "Internal Location"
    storageCategory: Optional[str] = ""
    company: str = "My Company"

# In-memory location store
fake_locations: List[Location] = []


@router.get("/locations", response_model=List[Location])
def get_locations(
    search: Optional[str] = Query(None, description="Search by location name"),
    locationType: Optional[str] = Query(None, description="Filter by location type"),
):
    """Return all locations, optionally filtered by search or type"""
    results = fake_locations
    if search:
        results = [loc for loc in results if search.lower() in loc.name.lower()]
    if locationType:
        results = [loc for loc in results if loc.locationType.lower() == locationType.lower()]
    return results


@router.post("/locations", response_model=Location)
def add_location(location: Location):
    """Add a new location, ensuring no duplicate names"""
    if any(l.name.lower() == location.name.lower() for l in fake_locations):
        raise HTTPException(status_code=400, detail="Location with this name already exists")

    location.id = (max([l.id or 0 for l in fake_locations]) + 1) if fake_locations else 1
    fake_locations.append(location)
    return location


@router.put("/locations/{location_id}", response_model=Location)
def update_location(location_id: int, updated_location: Location):
    """Update an existing location"""
    for idx, loc in enumerate(fake_locations):
        if loc.id == location_id:
            if any(
                l.name.lower() == updated_location.name.lower() and l.id != location_id
                for l in fake_locations
            ):
                raise HTTPException(status_code=400, detail="Another location with this name already exists")
            
            updated_location.id = location_id
            fake_locations[idx] = updated_location
            return updated_location

    raise HTTPException(status_code=404, detail="Location not found")


@router.delete("/locations/{location_id}", response_model=dict)
def delete_location(location_id: int):
    """Delete a location only if it's not assigned to stock"""
    from app.routers.stock import fake_stock_locations  # Avoid circular import at top

    if any(loc.location_id == location_id for loc in fake_stock_locations):
        raise HTTPException(status_code=400, detail="Cannot delete a location assigned to stock items")

    global fake_locations
    for loc in fake_locations:
        if loc.id == location_id:
            fake_locations = [l for l in fake_locations if l.id != location_id]
            return {"message": "Location deleted"}

    raise HTTPException(status_code=404, detail="Location not found")
