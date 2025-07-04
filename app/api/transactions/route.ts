import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const txns = await Transaction.find({});
  return NextResponse.json(txns);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const txn = await Transaction.create(body);
  return NextResponse.json(txn);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
