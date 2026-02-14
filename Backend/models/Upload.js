import { Schema, model } from "mongoose";

const uploadSchema = new Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default model("Upload", uploadSchema);
