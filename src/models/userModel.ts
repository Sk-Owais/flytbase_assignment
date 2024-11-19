import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  full_name: string;
  email: string;
  contact: string;
  password: string;
  drones?: mongoose.Types.ObjectId[];
  missions?: mongoose.Types.ObjectId[];
  is_active: boolean;
  is_deleted: boolean;
}

const userSchema: Schema<IUser> = new Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    drones: { type: [{ type: Schema.Types.ObjectId, ref: "Drone" }] },
    missions: { type: [{ type: Schema.Types.ObjectId, ref: "Mission" }] },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export default model<IUser>("users", userSchema);
