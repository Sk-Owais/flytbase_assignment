import express from "express";
import userRoutes from "./authRoutes";
import droneRoutes from "./droneRoutes";
import missionRoutes from "./missionRoutes";

const routes = express.Router();

routes.use("/user", userRoutes);
routes.use("/drones", droneRoutes);
routes.use("/mission", missionRoutes);

export default routes;
