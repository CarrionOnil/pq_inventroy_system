from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from typing import Optional, List  # <- ✅ Add Optional here


router = APIRouter()

class StockItem(BaseModel):
    id: Optional[int] = None  # <- This is the fix
    name: str
    partId: str
    category: str
    quantity: int
    location: str
    barcode: str
    status: str

# In-memory list to simulate a DB
fake_stock = [
    StockItem(
        name="Circuit Board",
        partId="CB-302",
        category="Electronics",
        quantity=24,
        location="Warehouse A",
        barcode="123456789",
        status="In Stock"
    )
]

@router.get("/stock", response_model=List[StockItem])
def get_stock():
    return fake_stock

@router.post("/stock", response_model=StockItem)
def add_stock(item: StockItem):
    for existing_item in fake_stock:
        if existing_item.partId == item.partId:
            existing_item.quantity += item.quantity
            return existing_item
    
    # If partId not found, assign a new ID and add it
    item.id = len(fake_stock) + 1
    fake_stock.append(item)
    return item

