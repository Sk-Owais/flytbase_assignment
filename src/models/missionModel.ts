import mongoose, { Schema, Document, model } from "mongoose";

export interface IMission extends Document {
  name: string;
  altitude: number;
  speed: number;
  waypoints: { lat: number; lng: number }[];
  created_by: mongoose.Types.ObjectId;
  is_active: boolean;
  is_deleted: boolean;
}

const missionSchema: Schema<IMission> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    altitude: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    waypoints: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ],
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

export default model<IMission>("missions", missionSchema);
