# Employee Directory Platform

A full-stack Employee Directory and Dashboard application. Built using **FastAPI** (Python) for the backend REST API, **PostgreSQL** for persistence, and **Next.js** (TypeScript & React App Router) for the client-side user interface.

On application startup, the database tables are automatically initialized and seeded with 10 sample employee records if the database is empty, making local development setup fast and straightforward.

---

## Technical Stack

* **Backend:** FastAPI, SQLAlchemy ORM, Pydantic (v2) settings and validation, PostgreSQL.
* **Frontend:** Next.js (App Router), CSS Modules, custom React hooks, TypeScript.

---

## Directory Layout

```text
.
├── backend/                  # Python API service
│   ├── app/
│   │   ├── core/             # App configurations & environment setup
│   │   ├── crud/             # Database query operations (Repository layer)
│   │   ├── database/         # Session setup & automatic database seeder
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── routers/          # API route definitions
│   │   ├── schemas/          # Pydantic request/response models
│   │   └── main.py           # App lifespan and FastAPI entrypoint
│   ├── tests/                # Unit & integration tests
│   └── requirements.txt
│
└── frontend/                 # Next.js web client
    ├── src/
    │   ├── app/              # UI pages, layouts, and components (CSS Modules)
    │   ├── hooks/            # Custom React hooks (handles fetch, filtering, state)
    │   ├── types/            # TypeScript type declarations
    │   └── utils/            # Shared formatting helpers
    └── package.json
```

---

## Getting Started

Follow these steps to run both services locally.

### Prerequisites

Make sure you have the following installed on your machine:
* **Python** 3.12+
* **Node.js** 20+ (LTS)
* **PostgreSQL** 14+ (running locally or via Docker)

---

### 1. Database Setup

Create an empty PostgreSQL database (e.g., named `employee_db`) on your Postgres server. You don't need to manually run any SQL scripts—FastAPI will automatically create the tables and seed sample data when it starts up.

---

### 2. Backend Setup

1. **Navigate to the backend directory and set up a Python virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   * **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
   * **Windows (Command Prompt):**
     ```cmd
     venv\Scripts\activate.bat
     ```
   * **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the `backend/` folder and populate it with your local PostgreSQL credentials:
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=employee_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_postgres_password
   ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *Note: On startup, the backend checks if the `employees` table is empty and seeds 10 realistic mock profiles if needed.*

6. **Verify API health:**
   * Open your browser to `http://localhost:8000/health` to confirm the API is running.
   * View the interactive API documentation at `http://localhost:8000/docs` (Swagger UI).

---

### 3. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional):**
   By default, the client is configured to connect to `http://localhost:8000`. If your backend is running on a different port or host, create a `.env.local` file in the `frontend/` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the web dashboard:**
   * Navigate to `http://localhost:3000` in your web browser.

---

## Architecture and Design Decisions

* **Automated Setup Lifespan:** We use FastAPI’s `asynccontextmanager` (`lifespan` event) to bootstrap the Postgres database schemas and run the seeder logic immediately on startup, removing manual database migration steps for local development.
* **Separated Data Access:** The backend uses the Repository pattern inside `crud/` to keep endpoints clean of direct database query concerns, simplifying testing and future schema updates.
* **Custom React Hook State:** The frontend isolates state management and side effects into a custom React hook `useEmployees`. UI components are stateless regarding the API integration, keeping components clean and focused purely on rendering the user experience.
* **Graceful Degradation:** The UI handles backend outages gracefully. It detects database connections/server health, transitions to a dedicated error page with immediate "Retry" actions, and displays elegant loading skeleton layouts while data is fetched.
