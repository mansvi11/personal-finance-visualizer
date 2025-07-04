import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: String,
  category: String,
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction;
