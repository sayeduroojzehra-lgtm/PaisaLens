
const API_BASE_URL = "http://127.0.0.1:8000";

const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");
const categoryChart = document.getElementById("categoryChart");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

let transactions = [];

function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const today = new Date();
dateInput.value = localDateString(today);

document.getElementById("today").textContent =
    today.toLocaleDateString("en-IN");

function formatMoney(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const errorData = await response.json();
            message = errorData.detail || message;
        } catch (_) {}

        throw new Error(message);
    }

    if (response.status === 204) return null;

    return response.json();
}

function normalizeTransaction(item) {
    return {
        ...item,
        id: Number(item.id),
        amount: Number(item.amount),
        type: item.transaction_type || item.type
    };
}

function updateSummary(summary) {
    document.getElementById("income").textContent =
        formatMoney(summary.total_income);

    document.getElementById("expense").textContent =
        formatMoney(summary.total_expenses);

    document.getElementById("balance").textContent =
        formatMoney(summary.balance);
}

function displayTransactions() {
    transactionList.innerHTML = "";

    const searchText = searchInput.value.trim().toLowerCase();
    const selectedType = filterType.value;

    const filtered = transactions.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchText) ||
            String(item.category).toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "all" || item.type === selectedType;

        return matchesSearch && matchesType;
    });

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No transactions found.";

        row.appendChild(cell);
        transactionList.appendChild(row);
        return;
    }

    filtered.forEach(item => {
        const row = document.createElement("tr");

        const values = [
            item.title,
            item.category,
            item.date,
            item.type,
            `${item.type === "income" ? "+" : "-"}${formatMoney(item.amount)}`
        ];

        values.forEach((value, index) => {
            const cell = document.createElement("td");
            cell.textContent = value;

            if (index === 3 || index === 4) {
                cell.className =
                    item.type === "income" ? "income-text" : "expense-text";
            }

            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", async () => {
            if (!confirm(`Delete "${item.title}"?`)) return;

            try {
                await apiRequest(`/transactions/${item.id}`, {
                    method: "DELETE"
                });

                await loadDashboard();
            } catch (error) {
                alert(`Could not delete transaction: ${error.message}`);
            }
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        transactionList.appendChild(row);
    });
}

function displayCategories(categoryData) {
    categoryChart.innerHTML = "";

    if (!categoryData || categoryData.length === 0) {
        categoryChart.textContent = "No expenses recorded yet.";
        return;
    }

    const total = categoryData.reduce(
        (sum, item) => sum + Number(item.total), 0
    );

    categoryData.forEach(item => {
        const amount = Number(item.total);
        const percentage = total > 0 ? (amount / total) * 100 : 0;

        const categoryItem = document.createElement("div");
        categoryItem.className = "category-item";

        const info = document.createElement("div");
        info.className = "category-info";

        const name = document.createElement("span");
        name.textContent = item.category;

        const value = document.createElement("span");
        value.textContent =
            `${formatMoney(amount)} (${percentage.toFixed(1)}%)`;

        info.append(name, value);

        const background = document.createElement("div");
        background.className = "bar-bg";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = `${percentage}%`;

        background.appendChild(bar);
        categoryItem.append(info, background);
        categoryChart.appendChild(categoryItem);
    });
}

function renderMonthlyAnalytics() {
    const chart = document.getElementById("monthlyChart");
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth();

        let income = 0;
        let expense = 0;

        transactions.forEach(item => {
            const transactionDate = new Date(`${item.date}T00:00:00`);

            if (
                transactionDate.getFullYear() === year &&
                transactionDate.getMonth() === month
            ) {
                if (item.type === "income") income += item.amount;
                if (item.type === "expense") expense += item.amount;
            }
        });

        months.push({
            name: date.toLocaleDateString("en-IN", { month: "short" }),
            income,
            expense
        });
    }

    const maxAmount = Math.max(
        1,
        ...months.map(month => Math.max(month.income, month.expense))
    );

    chart.innerHTML = months.map(month => {
        const incomeHeight = (month.income / maxAmount) * 150;
        const expenseHeight = (month.expense / maxAmount) * 150;

        return `
            <div class="month-group">
                <div class="bar-pair">
                    <div class="chart-bar income-bar"
                         style="height:${incomeHeight}px"
                         title="Income: ${formatMoney(month.income)}"></div>
                    <div class="chart-bar expense-bar"
                         style="height:${expenseHeight}px"
                         title="Expenses: ${formatMoney(month.expense)}"></div>
                </div>
                <div class="month-label">${month.name}</div>
            </div>
        `;
    }).join("");
}

async function loadDashboard() {
    try {
        const [transactionData, summaryData, categoryData] =
            await Promise.all([
                apiRequest("/transactions"),
                apiRequest("/summary"),
                apiRequest("/categories/summary")
            ]);

        transactions = transactionData.map(normalizeTransaction);

        updateSummary(summaryData);
        displayTransactions();
        displayCategories(categoryData);
        renderMonthlyAnalytics();

    } catch (error) {
        console.error("Dashboard loading error:", error);

        alert(
            "Cannot connect to the PaisaLens backend. " +
            "Check that FastAPI is running at " + API_BASE_URL +
            ". Details: " + error.message
        );
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const payload = {
        title: titleInput.value.trim(),
        amount: Number(amountInput.value),
        transaction_type: typeInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        notes: ""
    };

    if (
        !payload.title ||
        !Number.isFinite(payload.amount) ||
        payload.amount <= 0 ||
        !payload.date
    ) {
        alert("Please enter valid transaction details.");
        return;
    }

    try {
        await apiRequest("/transactions", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        form.reset();
        dateInput.value = localDateString();

        await loadDashboard();

        alert("Transaction added successfully!");

    } catch (error) {
        alert(`Could not add transaction: ${error.message}`);
    }
});

searchInput.addEventListener("input", displayTransactions);
filterType.addEventListener("change", displayTransactions);

loadDashboard();
