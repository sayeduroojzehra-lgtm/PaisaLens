# PaisaLens

### Personal Finance Dashboard

PaisaLens is a personal finance management application designed to help users track their income and expenses, understand their spending patterns, and monitor their financial balance through a simple and interactive dashboard.

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
├── requirements.txt
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

For Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 5. Start the backend server

```bash
python -m uvicorn backend.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

API Documentation:

http://127.0.0.1:8000/docs

### 6. Run the frontend

Open the following file using VS Code Live Server:

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

## AI Models and APIs Used

PaisaLens currently uses a rule-based approach to calculate income, expenses, account balance, and category-wise spending summaries.

No AI models or external AI APIs are currently integrated into this version.

## Demo Video

Watch the working demonstration of PaisaLens:

[**PaisaLens – Arthaton 2026 Demo**](https://youtu.be/KLE8Z0m8NYw)

## Future Improvements

- Budget planning and monthly spending limits.
- Visual spending trends and reports.
- AI-assisted expense insights.
- Spending pattern analysis.
- Personalized financial recommendations.
- Secure user authentication.
- Exportable financial reports.

## Project Information

**Project:** PaisaLens  
**Category:** Personal Finance Management  
**Repository:** https://github.com/sayeduroojzehra-lgtm/PaisaLens  
**Demo Video:** https://youtu.be/KLE8Z0m8NYw

---

*PaisaLens – Bringing clarity to personal finance.*
