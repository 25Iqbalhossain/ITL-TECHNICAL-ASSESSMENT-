import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeResponse
from app.crud import crud_employee

logger = logging.getLogger(__name__)

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
    Retrieve all employee records.
    """
    try:
        employees = crud_employee.get_all_employees(db)

        if not employees:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No employee records found.",
            )

        return employees

    except HTTPException:
        raise

    except SQLAlchemyError as error:
        logger.exception(
            "Failed to retrieve employee records from database: %s",
            error,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve employee records.",
        )