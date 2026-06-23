from fastapi import APIRouter
from app.routers import employees

api_router = APIRouter()

api_router.include_router(employees.router)
