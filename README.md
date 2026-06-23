# 🏢 Employee Management Platform

> An industrial-grade, decoupled Microservice Architecture for corporate directory management and analytics.

![Python](https://img.shields.io/badge/Python-3.13%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Production_Ready-009688?logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791?logo=postgresql)

---

## 📖 Table of Contents
1. [System Architecture](#-system-architecture)
2. [Repository Structure](#-repository-structure)
3. [Prerequisites](#-prerequisites)
4. [Backend (API) Setup](#-backend-api-setup)
5. [Frontend (Client) Setup](#-frontend-client-setup)
6. [Development Workflow](#-development-workflow)
7. [API Contract Overview](#-api-contract-overview)
8. [Code Quality & Standards](#-code-quality--standards)

---

## 🏛 System Architecture

This platform adopts a strict, enterprise-ready **Microservice Architecture**, isolating the presentation layer from business logic and data persistence. 

* **Backend**: Powered by FastAPI and PostgreSQL. Implements the repository pattern (`crud`), centralizes configuration using `pydantic-settings`, and relies on SQLAlchemy ORM.
* **Frontend**: Powered by Next.js (App Router). Implements strict separation of concerns utilizing custom hooks (`hooks/`), shared interfaces (`types/`), and isolated modular UI components.
* **Benefits**: 
  - **Independent Scaling**: Backend APIs and Frontend clients scale asynchronously.
  - **Separation of Concerns**: HTTP routing, database querying, data validation, and UI rendering are strictly separated into distinct modules.
  - **Resilience**: The frontend handles API outages gracefully with skeleton loaders and actionable error states.

---

## 📂 Repository Structure

The monorepo is divided into two primary sub-systems:

```text
.
├── backend/                  # Python / FastAPI Microservice
│   ├── app/
│   │   ├── core/             # Application config (CORS, Env Vars)
│   │   ├── crud/             # Repository layer (DB Queries)
│   │   ├── database/         # Session management & seeding scripts
│   │   ├── models/           # SQLAlchemy ORM definitions
│   │   ├── routers/          # HTTP Route controllers & aggregators
│   │   ├── schemas/          # Pydantic data validation contracts
│   │   └── main.py           # Application entrypoint & lifespan events
│   ├── tests/                # Automated testing suite
│   └── requirements.txt
│
├── frontend/                 # Node.js / Next.js Web Client
│   ├── src/
│   │   ├── app/              # Next.js routing, layouts, and UI components
│   │   ├── hooks/            # Business logic and state management
│   │   ├── types/            # Strict TypeScript interfaces
│   │   └── utils/            # Data transformation & formatters
│   ├── next.config.ts        # Next.js compiler & dev environment config
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites

Ensure your local development environment meets the following baseline requirements:
- **Python**: `3.12` or `3.13+`
- **Node.js**: `v20.0+` (LTS recommended)
- **Database**: PostgreSQL `14+` running locally or via Docker

---

## 🔙 Backend (API) Setup

The backend handles data validation, database migrations (automatic on startup), and API provision.

1. **Navigate to the backend directory and create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend` root. Use the provided `.env.example` if available, ensuring your `POSTGRES_*` credentials are correct.

4. **Launch the API server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *Note: Upon startup, the backend automatically provisions tables and seeds mock data if the database is empty.*

---

## 🎨 Frontend (Client) Setup

The frontend consumes the REST API to render a secure, dynamic dashboard.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` if your backend is hosted externally. By default, it connects to `http://localhost:8000`.
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:3000`.*

---

## 🔄 Development Workflow

1. **Database**: Ensure PostgreSQL service is active.
2. **Terminal 1**: Run the FastAPI backend. Observe logs to confirm DB connection and successful schema creation.
3. **Terminal 2**: Run the Next.js frontend.
4. **Documentation**: View live interactive API docs at `http://localhost:8000/docs` (Swagger UI).
5. **Debugging**: Both servers are running with hot-reloading (`--reload` / Turbopack). Changes reflect instantly.

---

## 🔌 API Contract Overview

Base URL: `http://localhost:8000/api/v1` *(or root based on configuration)*

| Method | Endpoint      | Description | Responses |
|--------|--------------|-------------|-----------|
| `GET`  | `/health`    | Service health check for load balancers. | `200 OK` |
| `GET`  | `/employees` | Retrieve all employee records. | `200 OK`, `404 Not Found`, `500 Server Error` |

*(Detailed schemas available in Swagger UI `/docs`)*

---

## 🛡 Code Quality & Standards

This project adheres to Senior/Enterprise software engineering standards:

* **Strict Typing**: Python utilizes explicit type hinting (`-> list[Employee]`) paired with Pydantic. TypeScript is heavily enforced on the frontend interfaces.
* **Repository Pattern**: Backend HTTP routes do not execute database queries. Data access logic is strictly bound to `crud/` repositories.
* **Custom Hooks**: Frontend React components remain entirely stateless regarding API data. The `useEmployees` hook independently manages fetching, state transitions, and business logic.
* **Error Boundaries**: The UI implements isolated error states, preventing complete application crashes due to network or backend failures.

---
*Built with modern tooling for high performance, maintainability, and scalability.*
