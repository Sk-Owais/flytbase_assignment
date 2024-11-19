import mongoose, { Schema, Document, model } from "mongoose";

export interface IMission extends Document {
  mission_name: string;
  altitude: number;
  speed: number;
  waypoints: { lat: number; lng: number }[];
  drones?: mongoose.Types.ObjectId[];
  created_by: mongoose.Types.ObjectId;
  is_active: boolean;
  is_deleted: boolean;
}

const missionSchema: Schema<IMission> = new Schema(
  {
    mission_name: {
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
    drones: { type: [{ type: Schema.Types.ObjectId, ref: "Drone" }] },
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
