import express from "express";
import {
  createDroneController,
  getAllDronesController,
  getDroneController,
  updateDroneController,
  deleteDroneController,
} from "../controllers/droneController";
import { checkUserAccessToken } from "../middleware/basicMiddleware";
const route = express.Router();

route.use(checkUserAccessToken);
route.post("/create", createDroneController);
route.get("/getAll", getAllDronesController);
route.get("/get/:drone_id", getDroneController);
route.put("/update/:drone_id", updateDroneController);
route.delete("/delete/:drone_id", deleteDroneController);

export default route;
