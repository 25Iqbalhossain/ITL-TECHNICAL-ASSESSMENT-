from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Employee(Base):
    """
    SQLAlchemy ORM Model representing the 'employees' database table.

    Provides interface for database operations (query, insert, update, delete)
    on employee records.
    """

    __tablename__ = "employees"

    # Primary Key identifier for each employee record (Auto-incremented by DB).
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Full name of the employee.
    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    # Department where the employee works.
    department: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    # Employee salary. Numeric(12, 2) is used as it is more precise than Float
    # and prevents floating-point rounding errors on monetary values.
    salary: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    # The date when the employee joined the company.
    joining_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )