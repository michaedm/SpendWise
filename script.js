const STORAGE_KEY = "spendwise-data-v1";

const INCOME_CATEGORIES = ["Salary", "Scholarship", "Freelance", "Gift", "Other"];

const EXPENSE_CATEGORIES = [
  "Food",
  "Rent",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other",
];

const WARNING_TEXT = "Warning: expenses for this month exceed the budget you set.";

const els = {
  periodSelect: document.getElementById("period-select"),
  resetDemoBtn: document.getElementById("reset-demo-btn"),
  totalIncome: document.getElementById("total-income"),
  totalExpenses: document.getElementById("total-expenses"),
  remainingBalance: document.getElementById("remaining-balance"),
  monthlyBudget: document.getElementById("monthly-budget"),
  budgetForm: document.getElementById("budget-form"),
  budgetAmount: document.getElementById("budget-amount"),
  budgetMessage: document.getElementById("budget-message"),
  budgetUsedLabel: document.getElementById("budget-used-label"),
  budgetPercent: document.getElementById("budget-percent"),
  budgetFill: document.getElementById("budget-progress-fill"),
  budgetBar: document.getElementById("budget-progressbar"),
  budgetWarning: document.getElementById("budget-warning"),
  transactionForm: document.getElementById("transaction-form"),
  transactionHeading: document.getElementById("transaction-form-heading"),
  transactionId: document.getElementById("transaction-id"),
  amount: document.getElementById("amount"),
  category: document.getElementById("category"),
  date: document.getElementById("date"),
  description: document.getElementById("description"),
  formError: document.getElementById("form-error"),
  formStatus: document.getElementById("form-status"),
  formModeHint: document.getElementById("form-mode-hint"),
  saveBtn: document.getElementById("save-transaction-btn"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  categoryChart: document.getElementById("category-chart"),
  transactionsBody: document.getElementById("transactions-body"),
  emptyState: document.getElementById("empty-state"),
  periodLabel: document.getElementById("transactions-period-label"),
  confirmDialog: document.getElementById("confirm-dialog"),
  confirmText: document.getElementById("confirm-text"),
  confirmAccept: document.getElementById("confirm-accept"),
  confirmCancel: document.getElementById("confirm-cancel"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function isoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function todayISO() {
  return isoDate(new Date());
}

function currentPeriodValue() {
  return todayISO().slice(0, 7);
}

function periodFromDate(dateStr) {
  return dateStr.slice(0, 7);
}

function dateInMonth(year, monthIndex, day) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return isoDate(new Date(year, monthIndex, Math.min(day, lastDay)));
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function defaultDateForPeriod(period) {
  const today = todayISO();
  if (today.startsWith(period)) return today;
  return `${period}-01`;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPeriod(period) {
  const [year, month] = period.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getDemoData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const previous = new Date(year, month - 1, 1);
  const currentKey = `${year}-${pad(month + 1)}`;
  const previousKey = `${previous.getFullYear()}-${pad(previous.getMonth() + 1)}`;

  return {
    transactions: [
      {
        id: "demo-inc-1",
        type: "income",
        amount: 2200,
        category: "Salary",
        date: dateInMonth(year, month, 1),
        description: "Part-time campus job paycheck (demo)",
        demo: true,
      },
      {
        id: "demo-inc-2",
        type: "income",
        amount: 350,
        category: "Scholarship",
        date: dateInMonth(year, month, 3),
        description: "Monthly stipend (demo)",
        demo: true,
      },
      {
        id: "demo-exp-1",
        type: "expense",
        amount: 780,
        category: "Rent",
        date: dateInMonth(year, month, 2),
        description: "Shared apartment rent (demo)",
        demo: true,
      },
      {
        id: "demo-exp-2",
        type: "expense",
        amount: 86.45,
        category: "Food",
        date: dateInMonth(year, month, 5),
        description: "Grocery run (demo)",
        demo: true,
      },
      {
        id: "demo-exp-3",
        type: "expense",
        amount: 32.5,
        category: "Transportation",
        date: dateInMonth(year, month, 7),
        description: "Bus pass reload (demo)",
        demo: true,
      },
      {
        id: "demo-exp-4",
        type: "expense",
        amount: 54.99,
        category: "Entertainment",
        date: dateInMonth(year, month, 9),
        description: "Streaming and movie night (demo)",
        demo: true,
      },
      {
        id: "demo-exp-5",
        type: "expense",
        amount: 41.2,
        category: "Bills",
        date: dateInMonth(year, month, 10),
        description: "Phone bill (demo)",
        demo: true,
      },
      {
        id: "demo-exp-6",
        type: "expense",
        amount: 27.8,
        category: "Shopping",
        date: dateInMonth(year, month, 12),
        description: "Notebooks and pens (demo)",
        demo: true,
      },
      {
        id: "demo-prev-1",
        type: "income",
        amount: 2100,
        category: "Salary",
        date: dateInMonth(previous.getFullYear(), previous.getMonth(), 1),
        description: "Previous month paycheck (demo)",
        demo: true,
      },
      {
        id: "demo-prev-2",
        type: "expense",
        amount: 780,
        category: "Rent",
        date: dateInMonth(previous.getFullYear(), previous.getMonth(), 2),
        description: "Previous month rent (demo)",
        demo: true,
      },
      {
        id: "demo-prev-3",
        type: "expense",
        amount: 112.3,
        category: "Food",
        date: dateInMonth(previous.getFullYear(), previous.getMonth(), 18),
        description: "Dining hall extras (demo)",
        demo: true,
      },
    ],
    budgets: {
      [currentKey]: 1400,
      [previousKey]: 1300,
    },
  };
}

function sanitizeState(parsed) {
  const transactions = (Array.isArray(parsed.transactions) ? parsed.transactions : [])
    .map((item) => {
      const amount = Math.round(Number(item.amount) * 100) / 100;
      const date = String(item.date || "");
      const type = item.type === "income" || item.type === "expense" ? item.type : "";
      const description = String(item.description || "").trim().slice(0, 80);
      const category = String(item.category || "").trim();
      if (!type || !Number.isFinite(amount) || amount <= 0 || !isValidDate(date)) {
        return null;
      }
      if (!description || !category) return null;
      return {
        id: String(item.id || createId()),
        type,
        amount,
        category,
        date,
        description,
        demo: Boolean(item.demo),
      };
    })
    .filter(Boolean);

  const budgets = {};
  const source = parsed.budgets && typeof parsed.budgets === "object" ? parsed.budgets : {};
  Object.entries(source).forEach(([key, value]) => {
    const amount = Math.round(Number(value) * 100) / 100;
    if (/^\d{4}-\d{2}$/.test(key) && amount > 0) {
      budgets[key] = amount;
    }
  });

  return { transactions, budgets };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDemoData();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !parsed.budgets) {
      return getDemoData();
    }
    return sanitizeState(parsed);
  } catch {
    return getDemoData();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
saveState();

function selectedType() {
  const checked = els.transactionForm.querySelector('input[name="type"]:checked');
  return checked ? checked.value : "income";
}

function categoriesFor(type) {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

function fillCategories(preferred) {
  const options = categoriesFor(selectedType());
  const extra =
    preferred && !options.includes(preferred) ? [preferred] : [];
  const names = options.concat(extra);
  els.category.innerHTML = names
    .map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
    .join("");
  els.category.value = names.includes(preferred) ? preferred : names[0];
}

function selectedPeriod() {
  const value = els.periodSelect.value;
  return /^\d{4}-\d{2}$/.test(value) ? value : currentPeriodValue();
}

function monthTransactions() {
  const period = selectedPeriod();
  return state.transactions
    .filter((item) => periodFromDate(item.date) === period)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function setBudgetMessage(message, isError) {
  els.budgetMessage.textContent = message;
  els.budgetMessage.style.color = isError ? "var(--danger)" : "var(--success)";
}

function renderSummary(items) {
  const income = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const remaining = Math.round((income - expenses) * 100) / 100;
  const budget = Number(state.budgets[selectedPeriod()] || 0);
  const overBudget = budget > 0 && expenses > budget;
  const percent = budget > 0 ? Math.round((expenses / budget) * 100) : 0;
  const capped = Math.min(percent, 100);

  els.totalIncome.textContent = formatMoney(income);
  els.totalExpenses.textContent = formatMoney(expenses);
  els.remainingBalance.textContent = formatMoney(remaining);
  els.remainingBalance.classList.toggle("negative", remaining < 0);
  els.remainingBalance.classList.toggle("positive", remaining > 0);
  els.monthlyBudget.textContent = budget ? formatMoney(budget) : "Not set";

  if (document.activeElement !== els.budgetAmount) {
    els.budgetAmount.value = budget ? budget.toFixed(2) : "";
  }

  els.budgetUsedLabel.textContent = budget
    ? `${formatMoney(expenses)} of ${formatMoney(budget)} spent`
    : `${formatMoney(expenses)} spent — set a budget to track progress`;
  els.budgetPercent.textContent = budget ? `${percent}%` : "—";
  els.budgetFill.style.width = budget ? `${capped}%` : "0%";
  els.budgetFill.classList.toggle("over", overBudget);
  els.budgetBar.setAttribute("aria-valuenow", String(budget ? capped : 0));
  els.budgetBar.setAttribute(
    "aria-valuetext",
    budget
      ? `${formatMoney(expenses)} of ${formatMoney(budget)} spent, ${percent} percent`
      : `${formatMoney(expenses)} spent, no budget set`
  );

  if (els.budgetWarning.textContent !== (overBudget ? WARNING_TEXT : "")) {
    els.budgetWarning.textContent = overBudget ? WARNING_TEXT : "";
  }
  els.budgetWarning.hidden = !overBudget;

  return expenses;
}

function renderCategoryChart(items, totalExpenses) {
  const expenseItems = items.filter((item) => item.type === "expense");
  if (expenseItems.length === 0) {
    els.categoryChart.removeAttribute("role");
    els.categoryChart.innerHTML =
      '<p class="empty-state">No expenses recorded for this month.</p>';
    return;
  }

  const totals = Object.fromEntries(EXPENSE_CATEGORIES.map((name) => [name, 0]));
  expenseItems.forEach((item) => {
    const key = EXPENSE_CATEGORIES.includes(item.category) ? item.category : "Other";
    totals[key] += item.amount;
  });

  els.categoryChart.setAttribute("role", "list");
  els.categoryChart.innerHTML = EXPENSE_CATEGORIES.map((name) => {
    const amount = totals[name];
    const width = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
    const share = totalExpenses > 0 ? Math.round(width) : 0;
    return `
      <div class="bar-row" role="listitem">
        <div class="bar-label">
          <span>${escapeHtml(name)}</span>
          <span>${formatMoney(amount)} · ${share}%</span>
        </div>
        <div class="bar-track" aria-hidden="true">
          <div class="bar-fill" style="width: ${width}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderTransactions(items) {
  els.periodLabel.textContent = `Showing ${formatPeriod(selectedPeriod())}`;
  els.emptyState.hidden = items.length > 0;
  els.transactionsBody.innerHTML = items
    .map((item) => {
      const demoBadge = item.demo ? '<span class="badge badge-demo">Demo</span>' : "";
      const typeClass = item.type === "income" ? "badge-income" : "badge-expense";
      const id = escapeHtml(item.id);
      return `
        <tr>
          <td data-label="Date">${formatDate(item.date)}</td>
          <td data-label="Type"><span class="badge ${typeClass}">${item.type}</span></td>
          <td data-label="Category">${escapeHtml(item.category)}</td>
          <td class="desc" data-label="Description">${escapeHtml(item.description)}${demoBadge}</td>
          <td class="num" data-label="Amount">${formatMoney(item.amount)}</td>
          <td data-label="Actions">
            <div class="row-actions">
              <button type="button" class="btn btn-ghost btn-small" data-edit="${id}">Edit</button>
              <button type="button" class="btn btn-danger btn-small" data-delete="${id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function render() {
  const items = monthTransactions();
  const expenses = renderSummary(items);
  renderCategoryChart(items, expenses);
  renderTransactions(items);
}

function parseAmount(raw) {
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100) / 100;
}

function setFieldInvalid(field, invalid) {
  if (!field) return;
  if (invalid) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function clearFieldErrors() {
  [els.amount, els.category, els.date, els.description].forEach((field) => {
    setFieldInvalid(field, false);
  });
}

function showFormError(message, field) {
  els.formStatus.textContent = "";
  els.formError.textContent = "";
  els.formError.textContent = message;
  setFieldInvalid(field, true);
  if (field) field.focus();
}

function resetTransactionForm() {
  const period = selectedPeriod();
  els.transactionId.value = "";
  els.transactionForm.reset();
  els.transactionForm.querySelector('input[name="type"][value="income"]').checked = true;
  els.date.value = defaultDateForPeriod(period);
  els.formError.textContent = "";
  els.transactionHeading.textContent = "Add transaction";
  els.formModeHint.textContent = "Enter a new income or expense.";
  els.saveBtn.textContent = "Add transaction";
  els.cancelEditBtn.hidden = true;
  clearFieldErrors();
  fillCategories();
}

function startEdit(id) {
  const item = state.transactions.find((entry) => entry.id === id);
  if (!item) return;

  els.transactionId.value = item.id;
  els.transactionForm.querySelector(
    `input[name="type"][value="${item.type}"]`
  ).checked = true;
  fillCategories(item.category);
  els.amount.value = item.amount.toFixed(2);
  els.date.value = item.date;
  els.description.value = item.description;
  els.formError.textContent = "";
  els.formStatus.textContent = "";
  els.transactionHeading.textContent = "Edit transaction";
  els.formModeHint.textContent = "Update the fields, then save changes.";
  els.saveBtn.textContent = "Save changes";
  els.cancelEditBtn.hidden = false;
  clearFieldErrors();
  els.transactionHeading.scrollIntoView({ behavior: "smooth", block: "start" });
  els.amount.focus();
}

function askConfirm(message, acceptLabel) {
  els.confirmText.textContent = message;
  els.confirmAccept.textContent = acceptLabel;
  if (typeof els.confirmDialog.showModal !== "function") {
    return Promise.resolve(window.confirm(message));
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = (confirmed) => {
      if (settled) return;
      settled = true;
      els.confirmAccept.removeEventListener("click", onAccept);
      els.confirmCancel.removeEventListener("click", onCancel);
      els.confirmDialog.removeEventListener("cancel", onEscape);
      if (els.confirmDialog.open) els.confirmDialog.close();
      resolve(confirmed);
    };
    const onAccept = () => finish(true);
    const onCancel = () => finish(false);
    const onEscape = (event) => {
      event.preventDefault();
      finish(false);
    };
    els.confirmAccept.addEventListener("click", onAccept);
    els.confirmCancel.addEventListener("click", onCancel);
    els.confirmDialog.addEventListener("cancel", onEscape);
    els.confirmDialog.showModal();
  });
}

els.periodSelect.value = currentPeriodValue();
els.date.value = todayISO();
fillCategories();
render();

els.transactionForm.querySelectorAll('input[name="type"]').forEach((input) => {
  input.addEventListener("change", () => {
    const current = els.category.value;
    fillCategories(categoriesFor(selectedType()).includes(current) ? current : "");
  });
});

els.periodSelect.addEventListener("change", () => {
  if (!/^\d{4}-\d{2}$/.test(els.periodSelect.value)) {
    els.periodSelect.value = currentPeriodValue();
  }
  if (!els.transactionId.value) {
    els.date.value = defaultDateForPeriod(selectedPeriod());
  }
  setBudgetMessage("", false);
  render();
});

els.budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = parseAmount(els.budgetAmount.value);
  if (amount === null) {
    setBudgetMessage("Enter a budget greater than 0.", true);
    els.budgetAmount.focus();
    return;
  }
  state.budgets[selectedPeriod()] = amount;
  saveState();
  setBudgetMessage(`Budget saved for ${formatPeriod(selectedPeriod())}.`, false);
  render();
});

els.transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFieldErrors();
  els.formError.textContent = "";

  const type = selectedType();
  const amount = parseAmount(els.amount.value);
  const category = els.category.value.trim();
  const date = els.date.value;
  const description = els.description.value.trim();
  const allowed = categoriesFor(type);

  if (amount === null) {
    showFormError("Amount must be a number greater than 0.", els.amount);
    return;
  }
  if (!category || !allowed.includes(category)) {
    showFormError("Choose a category.", els.category);
    return;
  }
  if (!isValidDate(date)) {
    showFormError("Choose a valid date.", els.date);
    return;
  }
  if (!description) {
    showFormError("Description is required.", els.description);
    return;
  }

  const existingId = els.transactionId.value;
  const payload = {
    id: existingId || createId(),
    type,
    amount,
    category,
    date,
    description,
    demo: false,
  };

  if (existingId) {
    const index = state.transactions.findIndex((item) => item.id === existingId);
    if (index === -1) {
      showFormError("That transaction is no longer available.", null);
      resetTransactionForm();
      return;
    }
    payload.demo = Boolean(state.transactions[index].demo);
    state.transactions[index] = payload;
  } else {
    state.transactions.push(payload);
  }

  saveState();
  els.periodSelect.value = periodFromDate(date);
  const status = existingId ? "Transaction updated." : "Transaction added.";
  resetTransactionForm();
  els.formStatus.textContent = status;
  render();
});

els.cancelEditBtn.addEventListener("click", () => {
  resetTransactionForm();
  els.formStatus.textContent = "Edit cancelled.";
});

els.transactionsBody.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    startEdit(editButton.getAttribute("data-edit"));
    return;
  }

  if (!deleteButton) return;
  const deleteId = deleteButton.getAttribute("data-delete");
  const item = state.transactions.find((entry) => entry.id === deleteId);
  if (!item) return;

  const confirmed = await askConfirm(
    `Delete this ${item.type} (${formatMoney(item.amount)} — ${item.description})?`,
    "Delete"
  );
  if (!confirmed) return;

  state.transactions = state.transactions.filter((entry) => entry.id !== deleteId);
  saveState();
  if (els.transactionId.value === deleteId) resetTransactionForm();
  els.formStatus.textContent = "Transaction deleted.";
  render();
});

els.resetDemoBtn.addEventListener("click", async () => {
  const confirmed = await askConfirm(
    "Replace everything saved in this browser with the fictional demo transactions and budgets?",
    "Reset demo data"
  );
  if (!confirmed) return;

  state = getDemoData();
  saveState();
  els.periodSelect.value = currentPeriodValue();
  resetTransactionForm();
  setBudgetMessage("Demo data restored.", false);
  els.formStatus.textContent = "";
  render();
});
