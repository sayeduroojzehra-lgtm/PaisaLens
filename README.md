# PaisaLens

### Personal Finance Dashboard

PaisaLens is a personal finance management application designed to help users track their income and expenses, understand their spending patterns, and monitor their financial balance through a simple dashboard.

## Problem Statement

Managing personal finances can be difficult when income and expenses are recorded across different places. Without a clear overview, users may struggle to understand their spending habits and manage their budgets effectively.

## Proposed Solution

PaisaLens provides a centralized dashboard where users can record financial transactions, monitor their income and expenses, and view a summary of their financial activity.

## Key Features

- **Transaction Management:** Add and view income and expense transactions.
- **Financial Summary:** View total income, total expenses, and remaining balance.
- **Category Analysis:** Understand expenses through category-wise summaries.
- **Transaction Deletion:** Remove transactions when required.
- **Persistent Storage:** Store transaction records using SQLite.
- **Interactive Dashboard:** Access financial information through a web-based interface.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| Database | SQLite |
| API Testing | FastAPI Swagger UI |
| Version Control | Git and GitHub |

## Project Structure

```text
PaisaLens/
├── backend/
│   ├── database.py
│   ├── main.py
│   └── routes.py
├── frontend/
│   └── frontend/
│       ├── index.html
│       ├── script.js
│       └── style.css
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/sayeduroojzehra-lgtm/PaisaLens.git
cd PaisaLens
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the virtual environment

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
python -m pip install fastapi uvicorn sqlalchemy
```

### 5. Start the backend server

```bash
python -m uvicorn backend.main:app --reload
```

Backend:

http://127.0.0.1:8000

API Documentation:

http://127.0.0.1:8000/docs

### 6. Run the frontend

Open the frontend using VS Code Live Server:

```text
frontend/frontend/index.html
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend welcome endpoint |
| GET | `/health` | Health check |
| POST | `/transactions` | Add a transaction |
| GET | `/transactions` | Retrieve transactions |
| DELETE | `/transactions/{transaction_id}` | Delete a transaction |
| GET | `/summary` | Retrieve financial summary |
| GET | `/categories/summary` | Retrieve category-wise summary |

## Future Improvements

- Budget planning and monthly spending limits.
- Visual spending trends and reports.
- Improved financial insights.
- Secure user authentication.
- Exportable financial reports.

## Project Information

**Project:** PaisaLens  
**Category:** Personal Finance Management  
**Repository:** https://github.com/sayeduroojzehra-lgtm/PaisaLens

---

*PaisaLens – Bringing clarity to personal finances.*
