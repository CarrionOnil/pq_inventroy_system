from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers.stock import router as stock_router
from app.routers.locations import router as locations_router
from app.routers.logs import router as logs_router
from app.routers.bom import router as bom_router  # <- Ensure bom.py has "router"

app = FastAPI()

# Serve uploaded images and files
app.mount("/static", StaticFiles(directory="app/uploads"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stock_router)
app.include_router(locations_router)
app.include_router(logs_router)
app.include_router(bom_router)

