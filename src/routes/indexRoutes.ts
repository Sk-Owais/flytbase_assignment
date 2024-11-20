import express from "express";
import userRoutes from "./authRoutes";
import droneRoutes from "./droneRoutes";
import missionRoutes from "./missionRoutes";
import flightRoutes from "./flightRoutes";
const routes = express.Router();

routes.use("/user", userRoutes);
routes.use("/drones", droneRoutes);
routes.use("/mission", missionRoutes);
routes.use("/flight", flightRoutes);

export default routes;
