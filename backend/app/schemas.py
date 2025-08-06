# schemas.py

from pydantic import BaseModel
from typing import Optional, List

# ---------- LOCATION ----------
class StockLocationBase(BaseModel):
    location_id: int
    quantity: int

class StockLocationCreate(StockLocationBase):
    pass

class StockLocationResponse(StockLocationBase):
    location_name: Optional[str] = None

# ---------- CREATE ----------
class StockCreate(BaseModel):
    name: str
    partId: str
    category: str
    barcode: str
    status: str
    lot_number: Optional[str] = None
    bin_numbers: Optional[str] = None
    supplier: Optional[str] = None
    production_stage: Optional[str] = None
    notes: Optional[str] = None
    cost: Optional[float] = 0.0  # ✅ Added cost field
    locations: List[StockLocationCreate]

# ---------- RESPONSE ----------
class StockResponse(BaseModel):
    id: int
    name: str
    partId: str
    category: str
    barcode: str
    status: str
    scrap_count: int
    lot_number: Optional[str]
    bin_numbers: Optional[str]
    supplier: Optional[str]
    production_stage: Optional[str]
    notes: Optional[str]
    image_url: Optional[str]
    file_url: Optional[str]
    cost: Optional[float] = 0.0 
    locations: List[StockLocationResponse]
