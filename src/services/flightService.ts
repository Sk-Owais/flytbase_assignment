import mongoose from "mongoose";
import userModel from "../models/userModel";
import flightLogModel from "../models/flightLogModel";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { generatePDFParams } from "../interfaces/flightInterfaces";
import {
  handleServiceError,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import { USER_MESSAGES, FLIGHT_MESSAGES } from "../constants/messageConstant";
const { USER_NOT_EXIST } = USER_MESSAGES;
const {
  FLIGHT_FETCHED_ERROR,
  FLIGHT_FETCHED_SUCCESS,
  FLIGHT_NOT_EXIST,
  FLIGHT_PDF_GENERATED_SUCCESS,
} = FLIGHT_MESSAGES;
const { OK, INTERNAL_SERVER_ERROR } = httpStatusCodes;

const generateFlightPDFService = async ({
  flight_id,
  user_id,
}: generatePDFParams): Promise<{
  code: number;
  response: any;
  filePath?: string;
}> => {
  try {
    const checkUser = await userModel
      .findOne({
        _id: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();

    if (!checkUser) {
      return {
        code: 404,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }

    const flightLog = await flightLogModel
      .findOne({ flight_log_id: flight_id })
      .lean();

    if (!flightLog) {
      return {
        code: 404,
        response: handleResponseHandler(OK.errorCode, FLIGHT_NOT_EXIST),
      };
    }

    const directoryPath = path.join(__dirname, "flight_logs");
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.join(directoryPath, `flight_log_${flight_id}.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    doc
      .fontSize(18)
      .text(`Flight Log for Flight ID: ${flight_id}`, { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Mission Name: ${flightLog.mission_name}`);
    doc.text(`Speed: ${flightLog.speed} km/h`);
    doc.text(`Distance: ${flightLog.distance} meters`);
    doc.text(`Execution Start: ${flightLog.execution_start}`);
    doc.text(`Execution End: ${flightLog.execution_end || "Not ended yet"}`);
    doc.moveDown();

    doc.fontSize(12).text("Waypoints:");
    flightLog.waypoints.forEach((waypoint: any, index: number) => {
      doc.text(
        `Waypoint ${index + 1}: Latitude: ${waypoint.lat}, Longitude: ${
          waypoint.lng
        }, Altitude: ${waypoint.alt}m, Time: ${waypoint.time}s`
      );
    });
    doc.moveDown();

    doc.end();

    return {
      code: 200,
      response: handleResponseHandler(
        OK.errorCode,
        FLIGHT_PDF_GENERATED_SUCCESS
      ),
      filePath,
    };
  } catch (error: unknown) {
    return {
      code: 500,
      response: handleServiceError(error),
    };
  }
};


const fetchFlightPDFService = async ({
  flight_id,
  user_id,
}: generatePDFParams): Promise<{
  code: number;
  response: any;
  filePath?: string;
}> => {
  try {
    const checkUser = await userModel
      .findOne({
        _id: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();

    if (!checkUser) {
      return {
        code: 404,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }

    const flightLog = await flightLogModel
      .findOne({ flight_log_id: flight_id })
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        flightLog ? FLIGHT_FETCHED_SUCCESS : FLIGHT_FETCHED_ERROR,
        !!flightLog,
        { flightLog }
      ),
    };
  } catch (error: unknown) {
    return {
      code: 500,
      response: handleServiceError(error),
    };
  }
};

export { generateFlightPDFService, fetchFlightPDFService };
