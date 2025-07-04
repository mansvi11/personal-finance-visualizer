"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Transaction = {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

type Budget = {
  _id?: string;
  category: string;
  month: string;
  amount: number;
};

const CATEGORIES = ["Food", "Shopping", "Bills", "Travel", "Other"];
const COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981", "#a855f7"];

function getMonthlyData(transactions: Transaction[]) {
  const monthlyTotals: Record<string, number> = {};

  transactions.forEach((txn) => {
    const month = new Date(txn.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + txn.amount;
  });

  return Object.entries(monthlyTotals).map(([month, total]) => ({
    month,
    total,
  }));
}

function getCategoryData(transactions: Transaction[]) {
  const totals: Record<string, number> = {};
  CATEGORIES.forEach((cat) => (totals[cat] = 0));

  transactions.forEach((txn) => {
    totals[txn.category] += txn.amount;
  });

  return Object.entries(totals)
    .filter(([, total]) => total > 0)
    .map(([category, total]) => ({ category, total }));
}

function getBudgetVsActual(
  transactions: Transaction[],
  budgets: Budget[],
  selectedMonth: string
) {
  const monthKey = new Date(selectedMonth + "-01").toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const actual: Record<string, number> = {};
  const planned: Record<string, number> = {};

  CATEGORIES.forEach((cat) => {
    actual[cat] = 0;
    planned[cat] = 0;
  });

  transactions.forEach((txn) => {
    const txnMonth = new Date(txn.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (txnMonth === monthKey) {
      actual[txn.category] += txn.amount;
    }
  });

  budgets.forEach((b) => {
    if (b.month === selectedMonth) {
      planned[b.category] = b.amount;
    }
  });

  return CATEGORIES.map((category) => ({
    category,
    actual: actual[category],
    budget: planned[category],
  }));
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "Food",
  });

  const [budgetForm, setBudgetForm] = useState({
    category: "Food",
    month: "",
    amount: "",
  });

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions);

    fetch("/api/budgets")
      .then((res) => res.json())
      .then(setBudgets);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const newTxn = await res.json();
      setTransactions([newTxn, ...transactions]);
      setForm({ amount: "", description: "", date: "", category: "Food" });
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/budgets", {
      method: "POST",
      body: JSON.stringify(budgetForm),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const newBudget = await res.json();
      setBudgets([newBudget, ...budgets]);
      setBudgetForm({ category: "Food", month: "", amount: "" });
    }
  };

  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const recentTxns = transactions.slice(0, 3);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">💰 Personal Finance Dashboard</h1>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-6">
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-2 border rounded"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add Transaction
        </button>
      </form>

      {/* Budget Form */}
      <h2 className="text-2xl font-bold mb-2 mt-8">📌 Set Monthly Budget</h2>
      <form
        onSubmit={handleBudgetSubmit}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <select
          value={budgetForm.category}
          onChange={(e) =>
            setBudgetForm({ ...budgetForm, category: e.target.value })
          }
          className="p-2 border rounded"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={budgetForm.month}
          onChange={(e) =>
            setBudgetForm({ ...budgetForm, month: e.target.value })
          }
          className="p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Amount (₹)"
          value={budgetForm.amount}
          onChange={(e) =>
            setBudgetForm({ ...budgetForm, amount: e.target.value })
          }
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="col-span-1 sm:col-span-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save Budget
        </button>
      </form>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-xl font-bold">₹ {totalSpent}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600">Recent</p>
          {recentTxns.map((txn) => (
            <p key={txn._id} className="text-sm">
              {txn.description} - ₹{txn.amount}
            </p>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded text-center">
          <p className="text-sm text-gray-600">Top Category</p>
          <p className="text-lg font-semibold">
            {
              getCategoryData(transactions).sort((a, b) => b.total - a.total)[0]
                ?.category || "N/A"
            }
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-2">📅 Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getMonthlyData(transactions)}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">📊 Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData(transactions)}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {getCategoryData(transactions).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget vs Actual Chart */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-2">📈 Budget vs Actual</h2>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded mb-4"
        />

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={getBudgetVsActual(transactions, budgets, selectedMonth)}
          >
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#a855f7" name="Budget" />
            <Bar dataKey="actual" fill="#10b981" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
