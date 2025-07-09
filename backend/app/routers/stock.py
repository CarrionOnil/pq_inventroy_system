from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class StockItem(BaseModel):
    id: int
    name: str
    partId: str
    category: str
    quantity: int
    location: str
    barcode: str
    status: str

# Sample fake data
fake_stock = [
    StockItem(
        id=1,
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
