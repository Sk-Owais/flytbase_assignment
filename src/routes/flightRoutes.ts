import express from "express";
import {
  generateFlightPDFController,
  fetchFlightPDFController
} from "../controllers/flightController";
import { checkUserAccessToken } from "../middleware/basicMiddleware";
const route = express.Router();

route.use(checkUserAccessToken);
route.get('/get/:flight_id',fetchFlightPDFController)
route.post("/generate-pdf/:flight_id", generateFlightPDFController);

export default route;
