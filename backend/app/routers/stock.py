from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import shutil, uuid
from datetime import datetime
from app.routers.logs import stock_logs, StockLog

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
    image_url: Optional[str] = None
    file_url: Optional[str] = None

# Empty list to simulate in-memory DB
fake_stock: List[StockItem] = []

UPLOAD_DIR = Path("app/uploads")
(UPLOAD_DIR / "images").mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "files").mkdir(parents=True, exist_ok=True)

@router.get("/stock", response_model=List[StockItem])
def get_stock():
    return fake_stock

@router.post("/stock", response_model=StockItem)
async def create_stock(
    name: str = Form(...), partId: str = Form(...),
    category: str = Form(...), quantity: int = Form(...),
    location: str = Form(...), barcode: str = Form(...),
    status: str = Form(...),
    image: Optional[UploadFile] = File(None),
    file: Optional[UploadFile] = File(None)
):
    new_id = (max([i.id or 0 for i in fake_stock]) + 1) if fake_stock else 1
    item = StockItem(
        id=new_id, name=name, partId=partId, category=category,
        quantity=quantity, location=location, barcode=barcode,
        status=status
    )
    if image:
        path = UPLOAD_DIR / "images" / f"{uuid.uuid4()}_{image.filename}"
        with path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        item.image_url = str(path)
    if file:
        pathf = UPLOAD_DIR / "files" / f"{uuid.uuid4()}_{file.filename}"
        with pathf.open("wb") as buf:
            shutil.copyfileobj(file.file, buf)
        item.file_url = str(pathf)
    fake_stock.append(item)
    return item

@router.put("/stock/{item_id}", response_model=StockItem)
async def update_stock(
    item_id: int,
    name: str = Form(...), partId: str = Form(...),
    category: str = Form(...), quantity: int = Form(...),
    location: str = Form(...), barcode: str = Form(...),
    status: str = Form(...),
    image: Optional[UploadFile] = File(None),
    file: Optional[UploadFile] = File(None)
):
    for i, existing in enumerate(fake_stock):
        if existing.id == item_id:
            existing.name = name
            existing.partId = partId
            existing.category = category
            existing.quantity = quantity
            existing.location = location
            existing.barcode = barcode
            existing.status = status
            if image:
                path = UPLOAD_DIR / "images" / f"{uuid.uuid4()}_{image.filename}"
                with path.open("wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)
                existing.image_url = str(path)
            if file:
                pathf = UPLOAD_DIR / "files" / f"{uuid.uuid4()}_{file.filename}"
                with pathf.open("wb") as buf:
                    shutil.copyfileobj(file.file, buf)
                existing.file_url = str(pathf)
            fake_stock[i] = existing
            return existing
    raise HTTPException(status_code=404, detail="Item not found")

@router.delete("/stock/{item_id}")
async def delete_stock(item_id: int):
    global fake_stock
    before_len = len(fake_stock)
    fake_stock = [item for item in fake_stock if item.id != item_id]
    if len(fake_stock) == before_len:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}

@router.get("/stock/barcode/{code}", response_model=StockItem)
def get_by_barcode(code: str):
    for item in fake_stock:
        if item.barcode == code:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

# /scan ENDPOINT
@router.post("/scan", response_model=StockItem)
async def scan_barcode(payload: dict):
    barcode = payload.get("barcode")
    action = payload.get("action")
    amount = payload.get("amount", 1)

    if not barcode or not action:
        raise HTTPException(status_code=400, detail="Barcode and action are required")

    for item in fake_stock:
        if item.barcode == barcode:
            if action == "add":
                item.quantity += amount
            elif action == "remove":
                if item.quantity - amount < 0:
                    raise HTTPException(status_code=400, detail="Quantity cannot go below zero")
                item.quantity -= amount
            else:
                raise HTTPException(status_code=400, detail="Invalid action")

            log_entry = StockLog(
                timestamp=datetime.utcnow(),
                barcode=barcode,
                action=action,
                amount=amount,
                resulting_qty=item.quantity
            )
            stock_logs.append(log_entry)

            return item

    raise HTTPException(status_code=404, detail="Item not found")





