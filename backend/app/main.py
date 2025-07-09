from fastapi import FastAPI
from app.routers.stock import router as stock_router  # ✅ Correct now

app = FastAPI()

# Register your route module
app.include_router(stock_router)
