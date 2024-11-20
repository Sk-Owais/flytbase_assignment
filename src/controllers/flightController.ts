import { Request, Response, NextFunction } from "express";
import zod from "zod";
import { generateFlightPDFService,fetchFlightPDFService } from "../services/flightService";
import {
  handleControllerError,
  handleDataValidation,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
const { INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } = httpStatusCodes;

const generateFlightPDFController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        flight_id: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim(),
      })
      .safeParse(req.params);

    if (error) {
      res
        .status(PRECONDITION_FAILED.code)
        .json(
          handleDataValidation(
            error.issues?.map((i) => `${i.path[0]} ${i.message}`)
          )
        );
      return;
    }

    const user_id = req.headers["user_id"];
    if (typeof user_id !== "string") {
      res.status(PRECONDITION_FAILED.code).json({ error: PRECONDITION_FAILED });
      return;
    }

    const { code, response } = await generateFlightPDFService({
        ...data,
        user_id,
      });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const fetchFlightPDFController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        flight_id: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim(),
      })
      .safeParse(req.params);

    if (error) {
      res
        .status(PRECONDITION_FAILED.code)
        .json(
          handleDataValidation(
            error.issues?.map((i) => `${i.path[0]} ${i.message}`)
          )
        );
      return;
    }

    const user_id = req.headers["user_id"];
    if (typeof user_id !== "string") {
      res.status(PRECONDITION_FAILED.code).json({ error: PRECONDITION_FAILED });
      return;
    }

    const { code, response } = await fetchFlightPDFService({
        ...data,
        user_id,
      });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

export { generateFlightPDFController,fetchFlightPDFController };
