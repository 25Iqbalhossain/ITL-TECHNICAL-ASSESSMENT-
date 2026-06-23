from datetime import date
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.employee import Employee


def seed_employees(db: Session) -> None:
    """
    Seed the database with sample employee records if the table is empty.

    This function prevents duplicate records by verifying if any employees already
    exist in the database prior to seeding. If existing data is found, seeding
    is skipped.

    Args:
        db (Session): The active database session.

    Raises:
        Exception: If database insertion or transaction commit fails, triggering a rollback.
    """
    # Select only the primary key column ID with a limit of 1 to minimize database query cost.
    existing_employee_id = db.scalar(
        select(Employee.id).limit(1)
    )

    # If the table is not empty, skip the seeding process.
    if existing_employee_id is not None:
        return

    employees = [
        Employee(
            name="Rahim Ahmed",
            department="Human Resources",
            salary=Decimal("45000.00"),
            joining_date=date(2021, 1, 15),
        ),
        Employee(
            name="Karim Hasan",
            department="Engineering",
            salary=Decimal("85000.00"),
            joining_date=date(2020, 6, 10),
        ),
        Employee(
            name="Nusrat Jahan",
            department="Marketing",
            salary=Decimal("55000.00"),
            joining_date=date(2022, 3, 5),
        ),
        Employee(
            name="Sadia Islam",
            department="Finance",
            salary=Decimal("70000.00"),
            joining_date=date(2019, 9, 20),
        ),
        Employee(
            name="Tanvir Hossain",
            department="Engineering",
            salary=Decimal("90000.00"),
            joining_date=date(2018, 11, 12),
        ),
        Employee(
            name="Mim Akter",
            department="Sales",
            salary=Decimal("48000.00"),
            joining_date=date(2023, 2, 1),
        ),
        Employee(
            name="Fahim Chowdhury",
            department="Operations",
            salary=Decimal("60000.00"),
            joining_date=date(2020, 7, 18),
        ),
        Employee(
            name="Jannat Ara",
            department="Customer Support",
            salary=Decimal("42000.00"),
            joining_date=date(2022, 10, 8),
        ),
        Employee(
            name="Arif Mahmud",
            department="IT",
            salary=Decimal("75000.00"),
            joining_date=date(2021, 5, 25),
        ),
        Employee(
            name="Tania Sultana",
            department="Administration",
            salary=Decimal("50000.00"),
            joining_date=date(2019, 12, 30),
        ),
    ]

    try:
        # Add all employee entities to the database session.
        db.add_all(employees)

        # Commit transaction to persist changes.
        db.commit()

    except Exception:
        # Roll back current transaction in case of failure to maintain data integrity.
        db.rollback()
        raise