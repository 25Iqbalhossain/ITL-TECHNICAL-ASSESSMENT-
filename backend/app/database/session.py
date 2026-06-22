from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    future=True,
)



SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db():
    """
    Dependency generator that yields a database session and ensures it is closed after use.

    Yields:
        Session: An active SQLAlchemy Database Session.
    """
    db: Session = SessionLocal()

    try:
        yield db
    finally:
        db.close()