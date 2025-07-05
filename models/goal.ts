import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  saved: { type: Number, required: true },
});

export const Goal = mongoose.models.Goal || mongoose.model("Goal", goalSchema);
