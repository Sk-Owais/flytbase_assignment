import express from "express";
import userRoutes from "./authRoutes";
import droneRoutes from "./droneRoutes";

const routes = express.Router();

routes.use("/user", userRoutes);
routes.use("/drones", droneRoutes);

export default routes;
