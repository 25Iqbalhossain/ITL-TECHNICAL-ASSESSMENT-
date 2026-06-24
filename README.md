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

## Architecture

This platform follows a **service-oriented, decoupled architecture** — separating the client presentation layer from the backend API service and the persistence layer. Each service has a single, well-defined responsibility, communicates over standard HTTP/REST contracts, and can be developed, deployed, and scaled independently.

---

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                             │
│                  http://localhost:3000  (Next.js)                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │  HTTP / REST (JSON)
                             │  CORS-controlled
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API SERVICE  (FastAPI)                         │
│                  http://localhost:8000                               │
│                                                                      │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────────────┐  │
│   │  Routers │ → │ Schemas  │ → │   CRUD   │ → │ SQLAlchemy ORM│  │
│   │ /api/v1  │   │ Pydantic │   │ Repository│   │    Models     │  │
│   └──────────┘   └──────────┘   └──────────┘   └───────┬───────┘  │
│                                                          │           │
│   ┌──────────┐   ┌───────────────┐                      │           │
│   │  /health │   │  Lifespan     │ ← startup/shutdown   │           │
│   │ endpoint │   │  (Bootstrap)  │                      │           │
│   └──────────┘   └───────────────┘                      │           │
└─────────────────────────────────────────────────────────┼───────────┘
                                                           │ SQLAlchemy
                                                           │ Connection Pool
                                                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PERSISTENCE LAYER                               │
│                  PostgreSQL 14+  (employee_db)                      │
│                                                                      │
│              ┌──────────────────────────────┐                       │
│              │        employees table        │                       │
│              │  id | name | role | dept ...  │                       │
│              └──────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Services Breakdown

#### 1. 🖥️ Frontend Service — Next.js (Port 3000)

The presentation layer is a **Next.js 14 App Router** application written in TypeScript. It is entirely decoupled from the backend — it communicates exclusively through the REST API contract and holds zero business logic.

| Layer | Technology | Responsibility |
|---|---|---|
| **Pages / Layouts** | Next.js App Router | File-system routing, server/client component boundaries |
| **UI Components** | React + CSS Modules | Stateless rendering, accessibility, responsive layouts |
| **State & Data Layer** | Custom React Hooks | API fetching, filtering, pagination, loading/error state |
| **Type Safety** | TypeScript | Shared type declarations for all API response shapes |
| **Utilities** | Pure functions (`utils/`) | Date formatting, name normalization, display helpers |

**Key Design Decisions:**
- **`useEmployees` hook** — Centralizes all API integration and local state into one composable hook. Components become pure view layers with no awareness of network or data concerns.
- **Graceful Degradation** — The UI detects server/database outages via the `/health` endpoint and transitions to a dedicated error page with retry capability. Skeleton loaders are displayed during all async operations.
- **CSS Modules** — Scoped, collision-free styles per component; zero runtime CSS-in-JS overhead.

---

#### 2. ⚙️ Backend API Service — FastAPI (Port 8000)

The API service is a **Python FastAPI** application structured in clean, separated layers following the **Repository Pattern** and **Dependency Injection** principles.

```
app/
├── main.py          ← FastAPI app instance, CORS middleware, lifespan bootstrap
├── core/
│   └── config.py    ← Pydantic Settings — environment variables & app config
├── routers/
│   └── api.py       ← Route registration, versioned API prefix (/api/v1)
├── schemas/
│   └── *.py         ← Pydantic v2 request/response models (validation & serialization)
├── crud/
│   └── *.py         ← Repository layer — all DB query logic (no SQL in routes)
├── models/
│   └── *.py         ← SQLAlchemy ORM table definitions
└── database/
    ├── base.py      ← SQLAlchemy declarative Base
    ├── session.py   ← Engine & SessionLocal factory (connection pool)
    └── seed.py      ← Idempotent data seeder (runs once on startup if DB is empty)
```

**Layered Request Lifecycle:**

```
HTTP Request
    │
    ▼
[Router]  →  validates path/query params
    │
    ▼
[Schema]  →  Pydantic parses & validates request body; coerces types
    │
    ▼
[CRUD / Repository]  →  executes parameterized SQL via SQLAlchemy ORM
    │
    ▼
[Database Session]  →  connection pool manages transaction lifecycle
    │
    ▼
[Schema]  →  Pydantic serializes ORM model → JSON response
    │
    ▼
HTTP Response (JSON)
```

**Key Design Decisions:**
- **Repository Pattern (`crud/`)** — All database query logic lives in one place, completely isolated from route handlers. Routes are thin orchestrators; they delegate to CRUD and return the result.
- **Pydantic v2 Settings (`core/config.py`)** — Environment variables are typed, validated, and documented at startup. No raw `os.getenv()` scattered across the codebase.
- **Lifespan Bootstrap (`asynccontextmanager`)** — Database schema creation (`Base.metadata.create_all`) and idempotent seeding run in a single controlled startup hook. Eliminates the need for manual migration steps in development.
- **CORS Middleware** — Origins are configurable via `settings.CORS_ORIGINS`, making it safe to lock down in production without code changes.

---

#### 3. 🗄️ Persistence Layer — PostgreSQL (Port 5432)

PostgreSQL serves as the single source of truth for all employee data.

| Concern | Decision |
|---|---|
| **ORM** | SQLAlchemy — type-safe queries, relationship management, connection pooling |
| **Schema Management** | `Base.metadata.create_all()` at startup (dev); migrate to Alembic for production |
| **Seeding** | Idempotent seed function — checks row count before inserting; safe to restart |
| **Connection Pool** | SQLAlchemy's built-in pool; `engine.dispose()` called on graceful shutdown |

---

### Data Flow Diagram

```
User Action (browser)
        │
        │  1. Component triggers hook
        ▼
  useEmployees Hook
        │
        │  2. fetch() → GET /api/v1/employees
        ▼
  FastAPI Router (/api/v1/employees)
        │
        │  3. Pydantic validates query params
        ▼
  CRUD Repository (crud/employee.py)
        │
        │  4. SQLAlchemy ORM query
        ▼
  PostgreSQL (employees table)
        │
        │  5. Row data returned
        ▼
  SQLAlchemy ORM Model → Pydantic Schema
        │
        │  6. JSON serialized response
        ▼
  useEmployees Hook (state update)
        │
        │  7. React re-render
        ▼
  UI Component (table / cards)
```

---

### Cross-Cutting Concerns

| Concern | Implementation |
|---|---|
| **Logging** | Structured stdout logging (`%(asctime)s \| %(levelname)s \| %(name)s`) via Python `logging` |
| **Error Handling** | HTTP exceptions raised in routers; Pydantic validation errors return `422`; DB errors caught in lifespan |
| **Health Check** | `GET /health` — lightweight liveness probe, returns `{ status: "ok" }` |
| **API Documentation** | Auto-generated Swagger UI at `/docs`; ReDoc at `/redoc` (FastAPI built-in) |
| **Environment Config** | `.env` files per service; never committed to version control |
| **Type Safety** | Pydantic v2 (backend) + TypeScript strict mode (frontend) — end-to-end type safety |
| **CORS** | Configured in middleware; origins controlled via environment variable |

---

### Scalability & Production Considerations

While this project is structured for local development, the architecture is deliberately designed to scale:

- **Horizontal Scaling** — The API service is stateless (no in-memory session state). Multiple FastAPI instances can sit behind a load balancer with a shared PostgreSQL instance.
- **Database Migrations** — Replace `create_all()` with **Alembic** for versioned, rollback-capable schema migrations in staging/production.
- **Containerization** — Each service (`frontend`, `backend`, `postgres`) maps naturally to its own **Docker container**, composable via `docker-compose.yml`.
- **Async Upgrade Path** — FastAPI natively supports async route handlers. The CRUD layer can be migrated to `asyncpg` / `SQLAlchemy async` for higher I/O throughput under load.
- **Caching** — A **Redis** cache layer can be introduced in front of the CRUD layer for frequently read, rarely mutated employee records.
- **CI/CD** — The `tests/` directory provides the foundation for a GitHub Actions pipeline running unit and integration tests on every pull request.

```
Production Target Architecture (future state):

  [CDN / Vercel]          [Load Balancer]
       │                       │
       ▼                       ▼
  Next.js (SSR)    →    FastAPI Cluster (N instances)
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
              PostgreSQL            Redis Cache
              (Primary +            (Read-through)
               Replica)
```

---

### Design Patterns Applied

| Pattern | Where Used | Purpose |
|---|---|---|
| **Repository Pattern** | `backend/app/crud/` | Decouples data access logic from business/route logic |
| **Dependency Injection** | FastAPI `Depends()` | DB session lifecycle managed per-request |
| **DTO / Schema Pattern** | `backend/app/schemas/` | Clean separation of API contract from ORM model shape |
| **Custom Hook Pattern** | `frontend/src/hooks/` | Encapsulates stateful API logic; components stay pure |
| **Lifespan / Bootstrap Pattern** | `backend/app/main.py` | Controlled startup/shutdown with resource cleanup |
| **Configuration as Code** | `backend/app/core/config.py` | Typed, validated env config via Pydantic Settings |
