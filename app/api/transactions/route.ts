import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const txns = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(txns);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const newTxn = await Transaction.create(body);
  return NextResponse.json(newTxn);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const id = req.nextUrl.searchParams.get("id");
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

