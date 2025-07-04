import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    amount: Number,
    description: String,
    date: String,
    category: String,
  },
  { timestamps: true }
);

export const Transaction = models.Transaction || model("Transaction", transactionSchema);
