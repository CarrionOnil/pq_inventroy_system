from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.stock import router as stock_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock_router)

