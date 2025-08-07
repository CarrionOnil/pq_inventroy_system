# models.py

from pydantic import BaseModel
from typing import Optional, List

# Core stock model
class Stock(BaseModel):
    id: Optional[int] = None
    name: str
    partId: str
    category: str
    barcode: str
    status: str
    scrap_count: int = 0
    lot_number: Optional[str] = None
    bin_numbers: Optional[str] = None
    supplier: Optional[str] = None
    production_stage: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None
    file_url: Optional[str] = None
    cost: Optional[float] = 0.0  

# Location model
class Location(BaseModel):
    id: Optional[int] = None
    name: str
    locationType: str = "Internal Location"
    storageCategory: Optional[str] = ""
    company: str = "My Company"

# Stock quantity in a specific location
class StockLocation(BaseModel):
    stock_id: int
    location_id: int
    quantity: int
