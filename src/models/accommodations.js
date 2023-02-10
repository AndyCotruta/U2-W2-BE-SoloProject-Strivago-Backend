import mongoose from "mongoose";
import { UserSchema } from "./users.js";

const { Schema, model } = mongoose;

const AccommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("Accommodations", AccommodationSchema);
