import mongoose, { Schema, Document, model } from "mongoose";

export interface IDrone extends Document {
  drone_name: string;
  drone_type: string;
  created_by: mongoose.Types.ObjectId;
  is_active: boolean;
  is_deleted: boolean;
}

const droneSchema: Schema<IDrone> = new Schema(
  {
    drone_name: {
      type: String,
      required: true,
    },
    drone_type: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export default mongoose.model<IDrone>("drones", droneSchema);
