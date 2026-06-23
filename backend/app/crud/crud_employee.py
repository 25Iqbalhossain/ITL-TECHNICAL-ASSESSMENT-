from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.employee import Employee

def get_all_employees(db: Session) -> list[Employee]:
    """
    Retrieve all employee records from the database ordered by their ID ascending.
    """
    statement = select(Employee).order_by(Employee.id.asc())
    return db.scalars(statement).all()
