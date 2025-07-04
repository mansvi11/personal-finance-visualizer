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

const CATEGORIES = ["Food", "Shopping", "Bills", "Travel", "Other"];
const COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981", "#a855f7"];

type Transaction = {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

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
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: "Food",
  });

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions);
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

  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const recentTxns = transactions.slice(0, 3);
  const topCategory = getCategoryData(transactions).sort((a, b) => b.total - a.total)[0]?.category || "N/A";

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800 drop-shadow-sm">
          Personal Finance Visualizer 💸
        </h1>

        {/* Form Section */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="p-3 rounded-xl border border-gray-200"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-3 rounded-xl border border-gray-200"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-3 rounded-xl border border-gray-200"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-3 rounded-xl border border-gray-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="col-span-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-all"
          >
            Add Transaction
          </button>
        </motion.form>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <motion.div
            className="bg-white/40 backdrop-blur-lg rounded-xl p-4 shadow-md text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-gray-600 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-indigo-800">₹ {totalSpent}</p>
          </motion.div>
          <motion.div
            className="bg-white/40 backdrop-blur-lg rounded-xl p-4 shadow-md text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-gray-600 text-sm">Recent</p>
            {recentTxns.map((txn) => (
              <p key={txn._id} className="text-sm">
                {txn.description} - ₹{txn.amount}
              </p>
            ))}
          </motion.div>
          <motion.div
            className="bg-white/40 backdrop-blur-lg rounded-xl p-4 shadow-md text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-gray-600 text-sm">Top Category</p>
            <p className="text-lg font-semibold text-indigo-800">{topCategory}</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-indigo-800 mb-2">Monthly Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyData(transactions)}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-indigo-800 mb-2">Category Breakdown</h2>
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
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}