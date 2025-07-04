import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/transaction";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find().sort({ createdAt: -1 });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const transaction = await Transaction.create(body);
  return NextResponse.json(transaction);
}

export async function DELETE(req: Request) {
  await connectDB();
  const id = new URL(req.url).searchParams.get("id");
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

