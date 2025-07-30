# category.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class CategoryTag(BaseModel):
    id: Optional[int] = None
    name: str
    color: str  # Hex or tailwind-friendly color

fake_categories: List[CategoryTag] = []

@router.get("/categories", response_model=List[CategoryTag])
def get_categories():
    return fake_categories

@router.post("/categories", response_model=CategoryTag)
def create_category(cat: CategoryTag):
    existing = next((c for c in fake_categories if c.name.lower() == cat.name.lower()), None)
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    new_id = max([c.id or 0 for c in fake_categories], default=0) + 1
    cat.id = new_id
    fake_categories.append(cat)
    return cat

@router.delete("/categories/{cat_id}")
def delete_category(cat_id: int):
    global fake_categories
    fake_categories = [c for c in fake_categories if c.id != cat_id]
    return {"message": "Category deleted"}
