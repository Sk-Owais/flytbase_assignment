import { Request, Response, NextFunction } from "express";
import zod from "zod";
import {
  createDroneService,
  getAllDronesService,
  updateDroneService,
  deleteDroneService,
  getDroneService,
} from "../services/droneService";
import {
  handleControllerError,
  handleDataValidation,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import {
  alphaNumericOnlyRegex,
  alphaOnlyRegex,
  numberOnlyRegex,
} from "../constants/regexConstant";
const { INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } = httpStatusCodes;

const createDroneController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        drone_name: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" }),
        drone_type: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" }),
      })
      .safeParse(req.body);

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

    const { code, response } = await createDroneService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const getAllDronesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user_id = req.headers["user_id"];
    if (typeof user_id !== "string") {
      res.status(PRECONDITION_FAILED.code).json({ error: PRECONDITION_FAILED });
      return;
    }

    const { code, response } = await getAllDronesService({ user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const getDroneController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        drone_id: zod
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

    const { code, response } = await getDroneService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const updateDroneController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        drone_name: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" }),
        drone_type: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" }),
        drone_id: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim(),
      })
      .safeParse({ ...req.body, ...req.params });

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

    const { code, response } = await updateDroneService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const deleteDroneController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        drone_id: zod
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

    const { code, response } = await deleteDroneService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

export {
  createDroneController,
  getAllDronesController,
  getDroneController,
  updateDroneController,
  deleteDroneController,
};
