import { connectDB } from "@/lib/mongodb";
import { Budget } from "@/models/budget";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const budgets = await Budget.find();
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const newBudget = await Budget.create(body);
  return NextResponse.json(newBudget);
}
