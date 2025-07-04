import { connectDB } from "@/lib/mongodb";
import { Budget } from "@/models/budget";
import { NextResponse } from "next/server";

// GET /api/budgets
export async function GET() {
  await connectDB();
  const budgets = await Budget.find();
  return NextResponse.json(budgets);
}

// POST /api/budgets
export async function POST(req: Request) {
  const body = await req.json();
  const { category, month, amount } = body;

  if (!category || !month || !amount) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();
  const newBudget = new Budget({ category, month, amount });
  const saved = await newBudget.save();

  return NextResponse.json(saved);
}
