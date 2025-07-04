import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/transaction";
import { NextResponse } from "next/server";

// GET /api/transactions
export async function GET() {
  console.log("API HIT: GET /api/transactions");
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST /api/transactions
export async function POST(req: Request) {
  console.log("API HIT: POST /api/transactions");
  try {
    const body = await req.json();
    const { amount, description, date, category } = body;

    if (!amount || !description || !date || !category) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    const newTransaction = new Transaction({ amount, description, date, category });
    const saved = await newTransaction.save();

    return NextResponse.json(saved);
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
