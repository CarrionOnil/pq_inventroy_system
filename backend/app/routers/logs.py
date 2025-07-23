from fastapi import APIRouter
from datetime import datetime
from typing import List, Optional, Dict, Union
from pydantic import BaseModel

router = APIRouter()
stock_logs = []

class StockLog(BaseModel):
    timestamp: datetime
    barcode: str
    action: str
    amount: int
    resulting_qty: int
    details: Optional[Dict[str, Union[str, int, Dict, List[Union[str, int]]]]] = None

@router.get("/stock_logs", response_model=List[StockLog])
def get_stock_logs():
    return stock_logs


