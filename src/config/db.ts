import { connect, connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MongoDB URI is not defined in .env file!");
  process.exit(1);
}

connection.on("connected", () => {
  console.log("Mongoose connection established to DB Clusters.");
});
connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});
connection.on("disconnected", () => {
  console.log("Mongoose disconnected.");
});

const connectDB = async (): Promise<void> => {
  try {
    await connect(MONGODB_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
