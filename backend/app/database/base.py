from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    SQLAlchemy Declarative Base class.
    All database models should inherit from this class to be registered with the metadata.
    """
    pass