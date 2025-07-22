from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime
from app.routers.logs import stock_logs, StockLog

router = APIRouter()

class BOM(BaseModel):
    product_barcode: str
    description: Optional[str] = ""
    components: Dict[str, int]  # {component_barcode: quantity}

boms: List[BOM] = []

@router.get("/boms", response_model=List[BOM])
def list_boms():
    return boms

@router.post("/boms", response_model=BOM)
def add_bom(bom: BOM):
    if any(b.product_barcode == bom.product_barcode for b in boms):
        raise HTTPException(status_code=400, detail="BOM for this product already exists")
    boms.append(bom)
    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="bom_create",
        barcode=bom.product_barcode,
        amount=0,
        resulting_qty=0,
        details={"description": bom.description, "components": bom.components}
    ))
    return bom

@router.put("/boms/{barcode}", response_model=BOM)
def update_bom(barcode: str, updated: BOM):
    for i, b in enumerate(boms):
        if b.product_barcode == barcode:
            boms[i] = updated
            stock_logs.append(StockLog(
                timestamp=datetime.utcnow(),
                action="bom_update",
                barcode=barcode,
                amount=0,
                resulting_qty=0,
                details={"description": updated.description, "components": updated.components}
            ))
            return updated
    raise HTTPException(status_code=404, detail="BOM not found")
