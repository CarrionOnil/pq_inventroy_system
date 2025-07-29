from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import shutil, uuid
from datetime import datetime
from app.routers.logs import stock_logs, StockLog
from app.routers.bom import boms

router = APIRouter()

class StockItem(BaseModel):
    id: Optional[int] = None
    name: str
    partId: str
    category: str
    quantity: int
    location: str
    barcode: str
    status: str
    lot_number: Optional[str] = None
    bin_numbers: Optional[str] = None
    supplier: Optional[str] = None
    production_stage: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None
    file_url: Optional[str] = None

fake_stock: List[StockItem] = []

UPLOAD_DIR = Path("app/uploads")
(UPLOAD_DIR / "images").mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "files").mkdir(parents=True, exist_ok=True)

@router.get("/stock", response_model=List[StockItem])
def get_stock():
    return fake_stock

@router.post("/stock", response_model=StockItem)
async def create_stock(
    name: str = Form(...), 
    partId: str = Form(...),
    category: str = Form(...), 
    quantity: int = Form(...),
    location: str = Form(...), 
    barcode: str = Form(...),
    status: str = Form(...),
    lot_number: Optional[str] = Form(None),
    bin_numbers: Optional[str] = Form(None),
    supplier: Optional[str] = Form(None),
    production_stage: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    file: Optional[UploadFile] = File(None)
):
    new_id = (max([i.id or 0 for i in fake_stock]) + 1) if fake_stock else 1
    item = StockItem(
        id=new_id, 
        name=name, 
        partId=partId, 
        category=category,
        quantity=quantity, 
        location=location, 
        barcode=barcode,
        status=status,
        lot_number=lot_number,
        bin_numbers=bin_numbers,
        supplier=supplier,
        production_stage=production_stage,
        notes=notes
    )

    if image:
        path = UPLOAD_DIR / "images" / f"{uuid.uuid4()}_{image.filename}"
        with path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        item.image_url = f"/static/images/{path.name}"

    if file:
        pathf = UPLOAD_DIR / "files" / f"{uuid.uuid4()}_{file.filename}"
        with pathf.open("wb") as buf:
            shutil.copyfileobj(file.file, buf)
        item.file_url = f"/static/files/{pathf.name}"

    bom = next((b for b in boms if b.product_barcode == barcode), None)
    if bom:
        for comp_barcode, qty_each in bom.components.items():
            required = qty_each * quantity
            comp = next((i for i in fake_stock if i.barcode == comp_barcode), None)
            if not comp or comp.quantity < required:
                raise HTTPException(status_code=400,
                    detail=f"Not enough {comp.name if comp else comp_barcode} in stock")
            comp.quantity -= required
            stock_logs.append(StockLog(
                timestamp=datetime.utcnow(),
                action="consume",
                barcode=comp.barcode,
                amount=required,
                resulting_qty=comp.quantity,
                details={"used_for": barcode}
            ))

    fake_stock.append(item)

    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="create",
        barcode=item.barcode,
        amount=quantity,
        resulting_qty=item.quantity
    ))

    return item

@router.put("/stock/{item_id}", response_model=StockItem)
async def update_stock(
    item_id: int,
    name: str = Form(...), 
    partId: str = Form(...),
    category: str = Form(...), 
    quantity: int = Form(...),
    location: str = Form(...), 
    barcode: str = Form(...),
    status: str = Form(...),
    lot_number: Optional[str] = Form(None),
    bin_numbers: Optional[str] = Form(None),
    supplier: Optional[str] = Form(None),
    production_stage: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    file: Optional[UploadFile] = File(None)
):
    item = next((i for i in fake_stock if i.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.name = name
    item.partId = partId
    item.category = category
    item.quantity = quantity
    item.location = location
    item.barcode = barcode
    item.status = status
    item.lot_number = lot_number
    item.bin_numbers = bin_numbers
    item.supplier = supplier
    item.production_stage = production_stage
    item.notes = notes

    if image:
        path = UPLOAD_DIR / "images" / f"{uuid.uuid4()}_{image.filename}"
        with path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        item.image_url = f"/static/images/{path.name}"

    if file:
        pathf = UPLOAD_DIR / "files" / f"{uuid.uuid4()}_{file.filename}"
        with pathf.open("wb") as buf:
            shutil.copyfileobj(file.file, buf)
        item.file_url = f"/static/files/{pathf.name}"

    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="update",
        barcode=item.barcode,
        amount=item.quantity,
        resulting_qty=item.quantity,
        details={"updated_item": item.id}
    ))

    return item

@router.delete("/stock/{item_id}")
async def delete_stock(item_id: int):
    global fake_stock
    print("Attempting to delete item ID:", item_id)
    print("Available item IDs:", [i.id for i in fake_stock])

    for item in fake_stock:
        if item.id == item_id:
            fake_stock = [i for i in fake_stock if i.id != item_id]
            stock_logs.append(StockLog(
                timestamp=datetime.utcnow(),
                action="delete",
                barcode=item.barcode,
                amount=0,
                resulting_qty=0,
                details={"deleted_item": item.id}
            ))
            return {"message": "Item deleted"}
    raise HTTPException(status_code=404, detail="Item not found")
