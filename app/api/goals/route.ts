import { connectDB } from "../../../lib/mongodb";
import { Goal } from "../../../models/goal";
import { NextResponse } from "next/server";

// GET /api/goals
export async function GET() {
  await connectDB();
  const goals = await Goal.find();
  return NextResponse.json(goals);
}
