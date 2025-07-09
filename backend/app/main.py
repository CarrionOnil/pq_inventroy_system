from fastapi import FastAPI
from app.routes.stock import router as stock_router

app = FastAPI()

# Register your route module
app.include_router(stock_router)
