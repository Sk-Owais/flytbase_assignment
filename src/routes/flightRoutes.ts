import express from "express";
import {
  generateFlightPDFController
} from "../controllers/flightController";
import { checkUserAccessToken } from "../middleware/basicMiddleware";
const route = express.Router();

route.use(checkUserAccessToken);
route.post("/generate-pdf/:flight_id", generateFlightPDFController);

export default route;
