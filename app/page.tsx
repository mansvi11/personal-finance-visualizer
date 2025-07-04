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

interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface TransactionForm {
  amount: string;
  description: string;
  date: string;
  category: string;
}

const CATEGORIES = ["Food", "Shopping", "Bills", "Travel", "Other"];
const COLORS = ["#60a5fa", "#fb923c", "#f87171", "#34d399", "#a78bfa"];

function getMonthlyData(transactions: Transaction[]) {
  const monthlyTotals: Record<string, number> = {};
  transactions.forEach((txn) => {
    const month = new Date(txn.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + txn.amount;
  });
  return Object.entries(monthlyTotals).map(([month, total]) => ({ month, total }));
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

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<TransactionForm>({ amount: "", description: "", date: "", category: "Food" });

  useEffect(() => {
    let mounted = true;
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setTransactions(data);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const newTxn = await res.json();
      setTransactions([newTxn, ...transactions]);
      setForm({ amount: "", description: "", date: "", category: "Food" });
    }
  };

  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const recentTxns = transactions.slice(0, 3);
  const topCategory = getCategoryData(transactions).sort((a, b) => b.total - a.total)[0]?.category || "N/A";

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-6 transition-all">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center drop-shadow text-indigo-700 dark:text-indigo-300">💸 Personal Finance Visualizer</h1>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800/80 backdrop-blur-md shadow-xl ring-1 ring-black/10 dark:ring-white/10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" required />
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" required />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent">
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="col-span-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg">Add Transaction</button>
        </motion.form>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <motion.div className="bg-white dark:bg-slate-800/90 shadow ring-1 ring-black/10 dark:ring-white/10 rounded-xl p-4 text-center hover:shadow-md transition" whileHover={{ scale: 1.02 }}>
            <p className="text-sm">Total Spent</p>
            <p className="text-2xl font-bold">₹ {totalSpent}</p>
          </motion.div>
          <motion.div className="bg-white dark:bg-slate-800/90 shadow ring-1 ring-black/10 dark:ring-white/10 rounded-xl p-4 text-center hover:shadow-md transition" whileHover={{ scale: 1.02 }}>
            <p className="text-sm">Recent</p>
            {recentTxns.map((txn) => (
              <p key={txn._id} className="text-sm">{txn.description} - ₹{txn.amount}</p>
            ))}
          </motion.div>
          <motion.div className="bg-white dark:bg-slate-800/90 shadow ring-1 ring-black/10 dark:ring-white/10 rounded-xl p-4 text-center hover:shadow-md transition" whileHover={{ scale: 1.02 }}>
            <p className="text-sm">Top Category</p>
            <p className="text-lg font-semibold">{topCategory}</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h2 className="text-lg font-semibold mb-2">📅 Monthly Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyData(transactions)}>
                <XAxis dataKey="month" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip />
                <Bar dataKey="total" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h2 className="text-lg font-semibold mb-2">📊 Category Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={getCategoryData(transactions)} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                  {getCategoryData(transactions).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}