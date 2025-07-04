import mongoose, { Schema } from "mongoose";

const BudgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Food", "Shopping", "Bills", "Travel", "Other"],
    },
    month: {
      type: String, // format: "July 2025"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Budget =
  mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
