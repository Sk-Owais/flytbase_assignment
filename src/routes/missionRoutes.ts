import express from "express";
import {
  createMissionController,
  getAllMissionController,
  getMissionController,
  updateMissionController,
  deleteMissionController,
} from "../controllers/missionController";
import { checkUserAccessToken } from "../middleware/basicMiddleware";
const route = express.Router();

route.use(checkUserAccessToken);
route.post("/create", createMissionController);
route.get("/getAll", getAllMissionController);
route.get("/get/:mission_id", getMissionController);
route.put("/update/:mission_id", updateMissionController);
route.delete("/delete/:mission_id", deleteMissionController);

export default route;
