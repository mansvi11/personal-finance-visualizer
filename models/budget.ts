import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  category: String,
  limit: Number,
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);

export default Budget;
