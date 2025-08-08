from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from typing import List, Optional
from pathlib import Path
import shutil, uuid
from datetime import datetime

from app.models import Stock, StockLocation
from app.schemas import StockCreate, StockResponse, StockLocationCreate, TransferRequest
from app.routers.logs import stock_logs, StockLog
from app.routers.bom import boms

router = APIRouter()

# In-memory DB
fake_stock: List[Stock] = []
fake_stock_locations: List[StockLocation] = []

UPLOAD_DIR = Path("app/uploads")
(UPLOAD_DIR / "images").mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "files").mkdir(parents=True, exist_ok=True)

# ---------- GET STOCK ----------
@router.get("/stock", response_model=List[StockResponse])
def get_stock(status: Optional[str] = None, location: Optional[str] = None, category: Optional[str] = Query(None), search: Optional[str] = Query(None)):
    from app.routers.locations import fake_locations
    stock_with_locations = []
    for s in fake_stock:
        enriched_locations = []
        for loc in fake_stock_locations:
            if loc.stock_id == s.id:
                loc_name = next((l.name for l in fake_locations if l.id == loc.location_id), None)
                enriched_locations.append({
                    "location_id": loc.location_id,
                    "location_name": loc_name,
                    "quantity": loc.quantity
                })

        total_qty = sum(loc["quantity"] for loc in enriched_locations)

        if location:
            matched = [loc for loc in enriched_locations if str(loc["location_id"]) == str(location) or (loc["location_name"] and loc["location_name"].lower() == location.lower())]
            if not matched:
                continue

        if status:
            def get_status(qty):
                if qty == 0: return "Out of Stock"
                elif qty < 10: return "Low Stock"
                return "In Stock"
            if get_status(total_qty) != status:
                continue

        if category and s.category not in category.split(","):
            continue

        if search and not (search.lower() in s.name.lower() or search.lower() in s.partId.lower() or search.lower() in s.barcode.lower()):
            continue

        stock_with_locations.append({**s.dict(), "locations": enriched_locations})

    return stock_with_locations

# ---------- CREATE STOCK ----------
@router.post("/stock", response_model=StockResponse)
async def create_stock(
    name: str = Form(...), partId: str = Form(...), category: str = Form(...), barcode: str = Form(...),
    status: str = Form(...), cost: Optional[float] = Form(None),
    locations: List[int] = Form(...), quantities: List[int] = Form(...),
    lot_number: Optional[str] = Form(None), bin_numbers: Optional[str] = Form(None),
    supplier: Optional[str] = Form(None), production_stage: Optional[str] = Form(None),
    notes: Optional[str] = Form(None), image: Optional[UploadFile] = File(None), file: Optional[UploadFile] = File(None)
):
    from app.routers.locations import fake_locations

    if not locations or not quantities or len(locations) != len(quantities):
        raise HTTPException(status_code=400, detail="Locations and quantities are required and must match.")

    for loc_id in locations:
        if not any(l.id == loc_id for l in fake_locations):
            raise HTTPException(status_code=400, detail=f"Location {loc_id} not found.")

    new_id = (max([i.id or 0 for i in fake_stock]) + 1) if fake_stock else 1
    stock_item = Stock(
        id=new_id, name=name, partId=partId, category=category, barcode=barcode, status=status,
        cost=cost, lot_number=lot_number, bin_numbers=bin_numbers,
        supplier=supplier, production_stage=production_stage, notes=notes
    )

    if image:
        path = UPLOAD_DIR / "images" / f"{uuid.uuid4()}_{image.filename}"
        with path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        stock_item.image_url = f"/static/images/{path.name}"

    if file:
        pathf = UPLOAD_DIR / "files" / f"{uuid.uuid4()}_{file.filename}"
        with pathf.open("wb") as buf:
            shutil.copyfileobj(file.file, buf)
        stock_item.file_url = f"/static/files/{pathf.name}"

    fake_stock.append(stock_item)

    for loc_id, qty in zip(locations, quantities):
        fake_stock_locations.append(StockLocation(stock_id=new_id, location_id=loc_id, quantity=qty))

    bom = next((b for b in boms if b.product_barcode == barcode), None)
    if bom:
        for comp_barcode, qty_each in bom.components.items():
            required = qty_each * sum(quantities)
            comp = next((i for i in fake_stock if i.barcode == comp_barcode), None)
            if not comp or sum(l.quantity for l in fake_stock_locations if l.stock_id == comp.id) < required:
                raise HTTPException(status_code=400, detail=f"Not enough {comp.name if comp else comp_barcode} in stock")
            for l in fake_stock_locations:
                if l.stock_id == comp.id and required > 0:
                    take = min(l.quantity, required)
                    l.quantity -= take
                    required -= take
            stock_logs.append(StockLog(timestamp=datetime.utcnow(), action="consume", barcode=comp.barcode, amount=qty_each * sum(quantities), resulting_qty=sum(l.quantity for l in fake_stock_locations if l.stock_id == comp.id), details={"used_for": barcode}))

    stock_logs.append(StockLog(timestamp=datetime.utcnow(), action="create", barcode=stock_item.barcode, amount=sum(quantities), resulting_qty=sum(quantities)))

    return {**stock_item.dict(), "locations": [StockLocationCreate(location_id=loc_id, quantity=qty) for loc_id, qty in zip(locations, quantities)]}


# ---------- UPDATE STOCK ----------
@router.put("/stock/{item_id}", response_model=StockResponse)
async def update_stock(item_id: int, stock_data: StockCreate):
    from app.routers.locations import fake_locations #added (migh not work)
    stock_item = next((s for s in fake_stock if s.id == item_id), None)
    if not stock_item:
        raise HTTPException(status_code=404, detail="Item not found")

    if not stock_data.locations:
        raise HTTPException(status_code=400, detail="At least one location is required.")

    for loc in stock_data.locations:
        if not any(l.id == loc.location_id for l in fake_locations):
            raise HTTPException(status_code=400, detail=f"Location {loc.location_id} not found")

    for field, value in stock_data.dict(exclude={"locations"}).items():
        setattr(stock_item, field, value)

    global fake_stock_locations
    fake_stock_locations = [loc for loc in fake_stock_locations if loc.stock_id != item_id]
    for loc in stock_data.locations:
        fake_stock_locations.append(StockLocation(
            stock_id=item_id,
            location_id=loc.location_id,
            quantity=loc.quantity
        ))

    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="update",
        barcode=stock_item.barcode,
        amount=sum(loc.quantity for loc in stock_data.locations),
        resulting_qty=sum(loc.quantity for loc in stock_data.locations),
        details={"updated_item": stock_item.id}
    ))

    return {**stock_item.dict(), "locations": stock_data.locations}

# ---------- DELETE STOCK ----------
@router.delete("/stock/{item_id}")
async def delete_stock(item_id: int):
    global fake_stock, fake_stock_locations
    item = next((i for i in fake_stock if i.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    fake_stock = [i for i in fake_stock if i.id != item_id]
    fake_stock_locations = [loc for loc in fake_stock_locations if loc.stock_id != item_id]

    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="delete",
        barcode=item.barcode,
        amount=0,
        resulting_qty=0,
        details={"deleted_item": item.id}
    ))

    return {"message": "Item deleted"}

# ---------- SCRAP STOCK ----------
class ScrapRequest(StockLocationCreate):
    stock_id: int
    reason: Optional[str] = "No reason provided"

@router.post("/stock/scrap")
def scrap_item(data: ScrapRequest):
    loc_entry = next((l for l in fake_stock_locations if l.location_id == data.location_id and l.stock_id == data.stock_id), None)
    if not loc_entry:
        raise HTTPException(status_code=404, detail="Stock item in this location not found")

    if data.quantity <= 0 or loc_entry.quantity < data.quantity:
        raise HTTPException(status_code=400, detail="Invalid scrap amount")

    loc_entry.quantity -= data.quantity

    stock_item = next(s for s in fake_stock if s.id == loc_entry.stock_id)
    stock_item.scrap_count += data.quantity

    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="scrap",
        barcode=stock_item.barcode,
        amount=data.quantity,
        resulting_qty=loc_entry.quantity,
        details={"reason": data.reason}
    ))

    return {"message": "Item scrapped successfully", "item": stock_item}

# ---------- SCAN UPDATE ----------
class ScanUpdateRequest(StockLocationCreate):
    action: Optional[str] = "add"

@router.post("/scan")
def scan_update(request: ScanUpdateRequest):
    loc_entry = next((l for l in fake_stock_locations if l.location_id == request.location_id and l.stock_id == request.stock_id), None)
    if not loc_entry:
        raise HTTPException(status_code=404, detail="Stock item in this location not found")

    stock_item = next(s for s in fake_stock if s.id == loc_entry.stock_id)

    if request.action == "add":
        loc_entry.quantity += request.quantity
        log_action = "scan_add"

    elif request.action == "remove":
        if loc_entry.quantity < request.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock to remove")
        loc_entry.quantity -= request.quantity
        log_action = "scan_remove"

    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action=log_action,
        barcode=stock_item.barcode,
        amount=request.quantity,
        resulting_qty=loc_entry.quantity
    ))

    return {"message": "Stock updated", "item": stock_item}


@router.post("/stock/transfer")
def transfer_item(data: TransferRequest):
    if data.location_id == data.to_location_id:
        raise HTTPException(status_code=400, detail="Source and destination locations must be different")

    # Find source entry
    from_entry = next((l for l in fake_stock_locations if l.location_id == data.location_id and l.stock_id == data.stock_id), None)
    if not from_entry:
        raise HTTPException(status_code=404, detail="Stock item not found in source location")

    if data.quantity <= 0 or from_entry.quantity < data.quantity:
        raise HTTPException(status_code=400, detail="Invalid transfer quantity")

    # Deduct from source
    from_entry.quantity -= data.quantity

    # Add to destination (or create if missing)
    to_entry = next((l for l in fake_stock_locations if l.location_id == data.to_location_id and l.stock_id == data.stock_id), None)
    if to_entry:
        to_entry.quantity += data.quantity
    else:
        to_entry = StockLocation(stock_id=data.stock_id, location_id=data.to_location_id, quantity=data.quantity)
        fake_stock_locations.append(to_entry)

    stock_item = next(s for s in fake_stock if s.id == data.stock_id)

    # Log transfer - FROM
    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="transfer_from",
        barcode=stock_item.barcode,
        amount=-data.quantity,
        resulting_qty=from_entry.quantity,
        details={
            "from_location": data.location_id,
            "to_location": data.to_location_id,
            "reason": data.reason
        }
    ))

    # Log transfer - TO
    stock_logs.append(StockLog(
        timestamp=datetime.utcnow(),
        action="transfer_to",
        barcode=stock_item.barcode,
        amount=data.quantity,
        resulting_qty=to_entry.quantity,
        details={
            "from_location": data.location_id,
            "to_location": data.to_location_id,
            "reason": data.reason
        }
    ))

    return {"message": "Transfer completed", "item": stock_item}

