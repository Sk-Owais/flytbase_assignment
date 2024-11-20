import mongoose, { Schema, Document, model } from "mongoose";

export interface IFlightLog extends Document {
  flight_log_id: string;
  drone_id: mongoose.Types.ObjectId;
  mission_name: string;
  waypoints: {
    time: number;
    alt: number;
    lat: number;
    lng: number;
  }[];
  speed: number;
  distance: number;
  execution_start: Date;
  execution_end: Date | null;
}

const flightLogSchema: Schema<IFlightLog> = new Schema(
  {
    flight_log_id: {
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
        lat: {
          type: Number,
          required: true,
          min: -90,
          max: 90,
        },
        lng: {
          type: Number,
          required: true,
          min: -180,
          max: 180,
        },
      },
    ],
    speed: {
      type: Number,
      required: true,
      min: 0,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    execution_start: {
      type: Date,
      required: true,
    },
    execution_end: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export default model<IFlightLog>("flightLog", flightLogSchema);
