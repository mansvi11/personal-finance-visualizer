import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Shopping", "Bills", "Travel", "Other"], // ✅ Category added
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
