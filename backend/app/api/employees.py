import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.model.employee import Employee
from app.schemas.employee import EmployeeResponse

# Initialize logger for this module.
logger = logging.getLogger(__name__)

# Define router for employee-related endpoints.
router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.get(
    "",
    response_model=list[EmployeeResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all employees",
)
def get_all_employees(
    db: Session = Depends(get_db),
) -> list[Employee]:
    """
    Retrieve all employee records from the database ordered by their ID ascending.

    Args:
        db (Session): The database session dependency.

    Returns:
        list[Employee]: A list of SQLAlchemy Employee objects.

    Raises:
        HTTPException:
            - 404 Not Found if no employee records are found in the database.
            - 500 Internal Server Error if database query fails.
    """
    try:
        # Construct SQLAlchemy 2.0 style query to fetch employees ordered by ID.
        statement = select(Employee).order_by(Employee.id.asc())

        # Execute query and extract scalars representing Employee model objects.
        employees = db.scalars(statement).all()

        # If no employees exist in the database, raise a 404 exception.
        if not employees:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No employee records found.",
            )

        return employees

    except HTTPException:
        # Re-raise HTTPExceptions as-is.
        raise

    except SQLAlchemyError as error:
        # Log the exception stack trace internally for debugging.
        # Avoid leaking raw database exception details to the API clients.
        logger.exception(
            "Failed to retrieve employee records from database: %s",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve employee records.",
        )