import express from "express";
import {
  createMissionController,
  getAllMissionController,
  getMissionController,
  updateMissionController,
  deleteMissionController,
  assignDroneMissionController,
  stopMissionController,
  removeDroneMissionController,
  startMissionController,
} from "../controllers/missionController";
import { checkUserAccessToken } from "../middleware/basicMiddleware";
const route = express.Router();

route.use(checkUserAccessToken);
route.post("/create", createMissionController);
route.get("/getAll", getAllMissionController);
route.get("/get/:mission_id", getMissionController);
route.put("/update/:mission_id", updateMissionController);
route.delete("/delete/:mission_id", deleteMissionController);
route.post("/assignDrone/:mission_id", assignDroneMissionController);
route.post("/removeDrone/:mission_id", removeDroneMissionController);
route.post("/mission/:mission_id/start", startMissionController);
route.post("/mission/:mission_id/stop", stopMissionController);

export default route;
