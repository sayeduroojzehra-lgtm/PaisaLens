import sqlite3

DATABASE_NAME = "paisa_lens.db"

def get_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection

def create_transactions_table():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            transaction_type TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            notes TEXT DEFAULT ''
        )
    """)

    connection.commit()
    connection.close()
