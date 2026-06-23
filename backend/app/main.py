import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

# The model must be imported to register the schema with Base.metadata.
# Without this, Base.metadata.create_all() will not detect the employees table.
import app.models

from app.routers.api import api_router
from app.core.config import settings
from app.database.base import Base
from app.database.seed import seed_employees
from app.database.session import SessionLocal, engine

# Configure basic logging for stdout.
# Note: For production environments, a more robust logging configuration (e.g. JSON logging) is recommended.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage the startup and shutdown lifecycle of the FastAPI application.

    During startup:
    1. Create all registered database tables if they do not exist.
    2. Seed the database with sample employee records if the table is empty.

    During shutdown:
    1. Dispose of the SQLAlchemy engine connection pool to release active connections.

    Args:
        app (FastAPI): The FastAPI application instance.

    Raises:
        SQLAlchemyError: If database table creation or seeding fails.
    """
    try:
        # Create database tables if they do not exist in the target database.
        Base.metadata.create_all(bind=engine)

        # Obtain a database session to execute the seeding operation.
        db = SessionLocal()
        try:
            # Seed the database with 10 sample employees if the table is empty.
            seed_employees(db)
        finally:
            db.close()

        logger.info("Application startup completed successfully.")

    except SQLAlchemyError:
        logger.exception("Database startup failed during table creation or seeding.")
        raise

    # Yield control back to the FastAPI framework to begin serving HTTP requests.
    yield

    # Clean up resources on application shutdown.
    engine.dispose()
    logger.info("Application shutdown completed.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    description="FastAPI and PostgreSQL employee management backend.",
    lifespan=lifespan,
)

# Configure CORS middleware to enable requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get(
    "/health",
    tags=["Health"],
    summary="Application health check",
)
def health_check() -> dict[str, str]:
    """
    Provide a simple health check endpoint to verify server availability.

    Returns:
        dict[str, str]: A dictionary containing the status and a health status message.
    """
    return {
        "status": "ok",
        "message": "Employee API is running.",
    }