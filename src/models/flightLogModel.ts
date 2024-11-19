import mongoose, { Schema, Document, model } from "mongoose";

export interface IFlightLog extends Document {
  flight_id: string;
  drone_id: mongoose.Types.ObjectId;
  mission_name: string;
  waypoints: { time: number; alt: number; lat: number; lng: number }[];
  drones?: mongoose.Types.ObjectId[];
  missions?: mongoose.Types.ObjectId[];
  speed: number;
  distance: number;
  execution_start: Date;
  execution_end: Date;
}

const flightLogSchema: Schema<IFlightLog> = new Schema(
  {
    flight_id: {
      type: String,
      required: true,
      unique: true,
    },
    drone_id: {
      type: Schema.Types.ObjectId,
      ref: "Drone",
      required: true,
    },
    mission_name: {
      type: String,
      required: true,
    },
    waypoints: [
      {
        time: { type: Number, required: true },
        alt: { type: Number, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ],
    speed: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    execution_start: {
      type: Date,
      required: true,
    },
    execution_end: {
      type: Date,
      required: true,
    },
    drones: { type: [{ type: Schema.Types.ObjectId, ref: "Drone" }] },
    missions: { type: [{ type: Schema.Types.ObjectId, ref: "Mission" }] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export default model<IFlightLog>("flightLogs", flightLogSchema);
