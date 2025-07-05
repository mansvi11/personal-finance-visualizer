// Updated Professional UI with Stage 3 Features: Savings Goals, Income Tracking, and Analytics
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
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  type: "expense" | "income";
}

interface Budget {
  category: string;
  limit: number;
}

interface Goal {
  name: string;
  target: number;
  saved: number;
}

const CATEGORIES = ["Food", "Shopping", "Bills", "Travel", "Other"];
const COLORS = ["#A3BFFA", "#C7D2FE", "#FBCFE8", "#FDE68A", "#BBF7D0"];

function getMonthlyData(transactions: Transaction[]) {
  const monthlyTotals: Record<string, number> = {};
  transactions.forEach((txn) => {
    const month = new Date(txn.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const multiplier = txn.type === "expense" ? 1 : -1;
    monthlyTotals[month] = (monthlyTotals[month] || 0) + txn.amount * multiplier;
  });
  return Object.entries(monthlyTotals).map(([month, total]) => ({ month, total }));
}

function getCategoryData(transactions: Transaction[]) {
  const totals: Record<string, number> = {};
  CATEGORIES.forEach((cat) => (totals[cat] = 0));
  transactions.forEach((txn) => {
    if (txn.type === "expense" && totals.hasOwnProperty(txn.category)) {
      totals[txn.category] += txn.amount;
    }
  });
  return Object.entries(totals)
    .filter(([, total]) => total > 0)
    .map(([category, total]) => ({ category, total }));
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({ amount: "", description: "", date: "", category: "Food", type: "expense" });
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    fetch("/api/transactions").then((res) => res.json()).then(setTransactions).catch(() => toast.error("Failed to load transactions"));
    fetch("/api/budgets").then((res) => res.json()).then(setBudgets).catch(() => toast.error("Failed to load budgets"));
    fetch("/api/goals").then((res) => res.json()).then(setGoals).catch(() => toast.error("Failed to load goals"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const newTxn = await res.json();
        setTransactions([newTxn, ...transactions]);
        setForm({ amount: "", description: "", date: "", category: "Food", type: "expense" });
        toast.success("Transaction added");
      } else toast.error("Error saving transaction");
    } catch (err) {
      toast.error("Error: " + err);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTransactions(transactions.filter((txn) => txn._id !== id));
        toast.success("Deleted");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const totalSpent = transactions.filter(t => t.type === "expense").reduce((sum, txn) => sum + txn.amount, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, txn) => sum + txn.amount, 0);
  const recentTxns = transactions.slice(0, 3);
  const topCategory = getCategoryData(transactions).sort((a, b) => b.total - a.total)[0]?.category || "N/A";

  return (
    <main className={`min-h-screen transition-all p-6 ${theme === "dark" ? "bg-[#121212] text-white" : "bg-[#f9f9f9] text-[#111827]"}`}>
      <Toaster position="top-right" richColors />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-300">Finance Visualizer</h1>
          <button className="px-3 py-1 border rounded" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow">
          <input required value={form.amount} type="number" placeholder="Amount" onChange={(e) => setForm({ ...form, amount: e.target.value })} className="p-3 rounded border bg-transparent" />
          <input required value={form.description} type="text" placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-3 rounded border bg-transparent" />
          <input required value={form.date} type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-3 rounded border bg-transparent" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="p-3 rounded border bg-transparent">
            {CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "expense" | "income" })} className="p-3 rounded border bg-transparent">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="col-span-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">Add</button>
        </form>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-indigo-100 dark:bg-indigo-800 p-4 rounded-xl text-center">
            <p>Total Spent</p>
            <h2 className="text-xl font-bold">₹ {totalSpent}</h2>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-4 rounded-xl text-center">
            <p>Total Income</p>
            <h2 className="text-xl font-bold">₹ {totalIncome}</h2>
          </div>
          <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-xl text-center">
            <p>Top Category</p>
            <h2 className="text-lg">{topCategory}</h2>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium mb-2">Savings Goals</h2>
          <div className="space-y-3">
            {goals.map((g) => (
              <div key={g.name} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <p className="mb-1">{g.name}: ₹{g.saved} / ₹{g.target}</p>
                <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 rounded">
                  <div className="h-2 bg-blue-500 rounded" style={{ width: `${Math.min((g.saved / g.target) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          <div>
            <h2 className="font-semibold mb-2">📅 Monthly Net</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyData(transactions)}>
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="total" fill="#A3BFFA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="font-semibold mb-2">📊 Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={getCategoryData(transactions)} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                  {getCategoryData(transactions).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
