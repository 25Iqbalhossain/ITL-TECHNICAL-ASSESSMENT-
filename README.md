# Employee Management Platform

A full-stack employee directory and analytics dashboard built with a FastAPI backend, PostgreSQL, and a Next.js frontend.

The backend exposes a small, production-style API for employee data. The frontend consumes that API to render a searchable, filterable dashboard with summary metrics, connection status, refresh controls, and responsive table views.

## Highlights

- FastAPI service with typed request/response models
- PostgreSQL persistence through SQLAlchemy
- Automatic table creation and one-time sample data seeding on startup
- Next.js App Router frontend with TypeScript
- Search by employee name or department
- Department filtering with computed dashboard metrics
- Live backend connectivity indicator and manual refresh action
- Clean responsive UI optimized for desktop and mobile

## Tech Stack

### Backend

- Python 3.13+
- FastAPI
- SQLAlchemy
- PostgreSQL
- psycopg2-binary
- Pydantic Settings

### Frontend

- Next.js 16
- React 19
- TypeScript
- ESLint

## Project Structure

```text
.
|-- backend
|   `-- app
|       |-- api
|       |   `-- employees.py
|       |-- core
|       |   `-- config.py
|       |-- database
|       |   |-- base.py
|       |   |-- seed.py
|       |   `-- session.py
|       |-- model
|       |   `-- employee.py
|       |-- schemas
|       |   `-- employee.py
|       `-- main.py
|-- frontend
|   `-- src
|       `-- app
|           |-- globals.css
|           |-- layout.tsx
|           `-- page.tsx
`-- README.md
```

## Features

### Backend

- Creates the `employees` table automatically on startup
- Seeds the database with 10 sample employee records if the table is empty
- Exposes a health check endpoint for operational monitoring
- Returns employee data in a stable API schema
- Handles database errors without leaking raw exception details to clients

### Frontend

- Fetches employee records from the backend API
- Displays total personnel, average compensation, and unique department count
- Filters rows by free-text search and department selection
- Formats currency and dates for display
- Shows loading, empty, and error states
- Uses a responsive, glass-style dashboard layout

## API Contract

Base URL: `http://localhost:8000`

### `GET /health`

Returns a simple service status response.

Example response:

```json
{
  "status": "ok",
  "message": "Employee API is running."
}
```

### `GET /employees`

Returns all employee records ordered by ascending `id`.

Response model:

```json
[
  {
    "id": 1,
    "name": "Rahim Ahmed",
    "department": "Human Resources",
    "salary": "45000.00",
    "joining_date": "2021-01-15"
  }
]
```

Behavior:

- `404 Not Found` if the table is empty
- `500 Internal Server Error` if the database query fails

## Data Model

### Employee

- `id`: integer primary key
- `name`: employee full name
- `department`: department name
- `salary`: numeric value with 2 decimal places
- `joining_date`: date of joining

## Configuration

### Backend environment variables

Create `backend/.env` from `backend/.env.example`.

```env
APP_NAME=Employee Management API
APP_VERSION=1.0.0
DEBUG=True

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=employee_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
```

### Frontend environment variables

The frontend reads `NEXT_PUBLIC_API_URL`.

If the variable is not set, it defaults to `http://localhost:8000`.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Local Setup

### Prerequisites

- Python 3.13 or compatible 3.12+
- Node.js 20+ recommended
- PostgreSQL 14+ or compatible

### 1. Backend setup

From the repository root:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
```

Update `backend/.env` with your local PostgreSQL credentials, then start the API:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will:

- create tables on startup
- seed sample employees if the table is empty
- expose OpenAPI docs at `http://localhost:8000/docs`

### 2. Frontend setup

In a new terminal:

```powershell
cd frontend
npm install
```

Run the development server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

If your backend is not running on the default address, create `frontend/.env.local` and set `NEXT_PUBLIC_API_URL`.

## Development Workflow

- Start PostgreSQL
- Start the backend on port `8000`
- Start the frontend on port `3000`
- Verify the dashboard loads employee data
- Use the browser network tab or backend `/docs` page to debug API issues

## Useful Commands

### Backend

```powershell
cd backend
..\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm run dev
npm run build
npm run lint
```

## Operational Notes

- CORS is configured for `http://localhost:3000`
- The backend uses a cached settings loader via `pydantic-settings`
- Database sessions are opened per request and closed automatically
- The frontend treats API failures as a first-class state and surfaces an actionable error message

## Troubleshooting

### Backend does not start

- Confirm PostgreSQL is running
- Confirm the credentials in `backend/.env` are correct
- Confirm the target database exists or is reachable

### Frontend shows API disconnected

- Confirm the backend is running on `http://localhost:8000`
- Confirm `NEXT_PUBLIC_API_URL` is set correctly if you changed the backend URL
- Check that CORS still allows the frontend origin

### No employee records appear

- The backend only seeds data when the table is empty
- If the database already contains rows, startup will not insert duplicates

## Future Improvements

- Add create, update, and delete endpoints
- Add pagination and server-side search
- Add authentication and role-based access control
- Add Alembic migrations for schema management
- Add automated backend and frontend test coverage

## License

No license file is currently included. Add one before publishing or sharing externally.
