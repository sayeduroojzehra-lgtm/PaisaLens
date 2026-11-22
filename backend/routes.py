from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.database import get_connection

router = APIRouter()


# Request model
class Transaction(BaseModel):
    title: str
    amount: float
    transaction_type: str
    category: str
    date: str
    notes: str = ""


# ADD TRANSACTION
@router.post("/transactions")
def add_transaction(transaction: Transaction):

    if transaction.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )

    if transaction.transaction_type not in ["income", "expense"]:
        raise HTTPException(
            status_code=400,
            detail="Type must be income or expense"
        )

    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO transactions
        (title, amount, transaction_type, category, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            transaction.title,
            transaction.amount,
            transaction.transaction_type,
            transaction.category,
            transaction.date,
            transaction.notes
        )
    )

    connection.commit()
    transaction_id = cursor.lastrowid
    connection.close()

    return {
        "message": "Transaction added successfully",
        "transaction_id": transaction_id
    }


# GET ALL TRANSACTIONS
@router.get("/transactions")
def get_transactions():

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT * FROM transactions
        ORDER BY date DESC, id DESC
        """
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]


# DELETE TRANSACTION
@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int):

    connection = get_connection()

    cursor = connection.execute(
        "DELETE FROM transactions WHERE id = ?",
        (transaction_id,)
    )

    connection.commit()
    deleted = cursor.rowcount
    connection.close()

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return {
        "message": "Transaction deleted successfully"
    }


# DASHBOARD SUMMARY
@router.get("/summary")
def get_summary():

    connection = get_connection()

    row = connection.execute(
        """
        SELECT
            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'income'
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS total_income,

            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'expense'
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS total_expenses

        FROM transactions
        """
    ).fetchone()

    connection.close()

    total_income = row["total_income"]
    total_expenses = row["total_expenses"]

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": total_income - total_expenses
    }


# CATEGORY-WISE EXPENSE SUMMARY
@router.get("/categories/summary")
def get_category_summary():

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            category,
            SUM(amount) AS total
        FROM transactions
        WHERE transaction_type = 'expense'
        GROUP BY category
        ORDER BY total DESC
        """
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]
