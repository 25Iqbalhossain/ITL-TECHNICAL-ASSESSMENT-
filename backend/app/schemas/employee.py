from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class EmployeeResponse(BaseModel):
    """
    Pydantic schema representing the JSON response structure for employee details.
    Used by the GET /employees endpoint.
    """

    # Configures Pydantic to read data from database ORM models/attributes.
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    department: str

    # Employee salary. Example provided for OpenAPI/Swagger documentation generation.
    salary: Decimal = Field(
        examples=["45000.00"]
    )

    joining_date: date