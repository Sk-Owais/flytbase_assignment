import mongoose from "mongoose";
import userModel from "../models/userModel";
import flightLogModel from "../models/flightLogModel";
import PDFDocument from "pdfkit";
import fs from "fs";
import { generatePDFParams } from "../interfaces/flightInterfaces";
import {
  handleServiceError,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import { USER_MESSAGES } from "../constants/messageConstant";
const { USER_NOT_EXIST } = USER_MESSAGES;
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

    // Fetch the flight log from the database using the flight_id
    const flightLog = await flightLogModel
      .findOne({ flight_log_id: flight_id })
      .populate("drone_id") // Optionally populate drone data if needed
      .lean();

    if (!flightLog) {
      return {
        code: 404, // Flight log not found
        response: handleResponseHandler(OK.errorCode, "Flight log not found"),
      };
    }

    // Generate the PDF
    const doc = new PDFDocument();
    const filePath = `./flight_logs/flight_log_${flight_id}.pdf`;

    // Pipe the PDF output to a file
    doc.pipe(fs.createWriteStream(filePath));

    // Add PDF content - Flight Log Details
    doc
      .fontSize(18)
      .text(`Flight Log for Flight ID: ${flight_id}`, { align: "center" });
    doc.moveDown();

    // Mission Name and Details
    doc.fontSize(14).text(`Mission Name: ${flightLog.mission_name}`);
    doc.text(`Speed: ${flightLog.speed} km/h`);
    doc.text(`Distance: ${flightLog.distance} meters`);
    doc.text(`Execution Start: ${flightLog.execution_start}`);
    doc.text(`Execution End: ${flightLog.execution_end || "Not ended yet"}`);
    doc.moveDown();

    // Add Waypoints
    doc.fontSize(12).text("Waypoints:");
    flightLog.waypoints.forEach((waypoint: any, index: number) => {
      doc.text(
        `Waypoint ${index + 1}: Latitude: ${waypoint.lat}, Longitude: ${
          waypoint.lng
        }, Altitude: ${waypoint.alt}m, Time: ${waypoint.time}s`
      );
    });
    doc.moveDown();

    // Finalize the document
    doc.end();

    // Return file path after the PDF is generated
    return {
      code: 200, // Success
      response: handleResponseHandler(
        OK.errorCode,
        "PDF Generated Successfully"
      ),
      filePath,
    };
  } catch (error: unknown) {
    return {
      code: 500, // Internal server error
      response: handleServiceError(error),
    };
  }
};

export { generateFlightPDFService };
