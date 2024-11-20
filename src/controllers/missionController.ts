import { Request, Response, NextFunction } from "express";
import zod from "zod";
import {
  createMissionService,
  getAllMissionsService,
  getMissionService,
  deleteMissionService,
  updateMissionService,
  assignDroneMissionService,
  removeDroneMissionService,
  startMissionService,
  stopMissionService,
} from "../services/missionService";
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

const createMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_name: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" }),
        mission_type: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" }),
        speed: zod
          .number({
            required_error: "is required",
            invalid_type_error: "should be number",
          })
          .positive({ message: "should be a positive number" }),
        waypoints: zod
          .array(
            zod.object({
              lat: zod
                .number({
                  required_error: "is required",
                  invalid_type_error: "should be number",
                })
                .min(-90, { message: "should be between -90 and 90" })
                .max(90, { message: "should be between -90 and 90" }),
              lng: zod
                .number({
                  required_error: "is required",
                  invalid_type_error: "should be number",
                })
                .min(-180, { message: "should be between -180 and 180" })
                .max(180, { message: "should be between -180 and 180" }),
              alt: zod
                .number({
                  required_error: "is required",
                  invalid_type_error: "should be number",
                })
                .min(-180, { message: "should be between -180 and 180" })
                .max(180, { message: "should be between -180 and 180" })
                .optional(),
            })
          )
          .min(1, { message: "should have at least one waypoint" }),
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

    const { code, response } = await createMissionService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const getAllMissionController = async (
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

    const { code, response } = await getAllMissionsService({ user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const getMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_id: zod
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

    const { code, response } = await getMissionService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const deleteMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_id: zod
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

    const { code, response } = await deleteMissionService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const updateMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_name: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" })
          .optional(),
        mission_type: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" })
          .optional(),
        speed: zod
          .number({
            required_error: "is required",
            invalid_type_error: "should be number",
          })
          .positive({ message: "should be a positive number" })
          .optional(),
        waypoints: zod
          .array(
            zod.object({
              lat: zod
                .number({
                  required_error: "is required",
                  invalid_type_error: "should be number",
                })
                .min(-90, { message: "should be between -90 and 90" })
                .max(90, { message: "should be between -90 and 90" })
                .optional(),
              lng: zod
                .number({
                  required_error: "is required",
                  invalid_type_error: "should be number",
                })
                .min(-180, { message: "should be between -180 and 180" })
                .max(180, { message: "should be between -180 and 180" })
                .optional(),
              alt: zod
                .number({
                  required_error: "is required",
                  invalid_type_error: "should be number",
                })
                .min(-180, { message: "should be between -180 and 180" })
                .max(180, { message: "should be between -180 and 180" })
                .optional(),
            })
          )
          .min(1, { message: "should have at least one waypoint" })
          .optional(),
        mission_id: zod
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

    const { code, response } = await updateMissionService({ ...data, user_id });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const assignDroneMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_id: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim(),
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

    const { code, response } = await assignDroneMissionService({
      ...data,
      user_id,
    });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const removeDroneMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_id: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim(),
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

    const { code, response } = await removeDroneMissionService({
      ...data,
      user_id,
    });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const startMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_id: zod
          .string({
            required_error: "Mission ID is required",
            invalid_type_error: "Mission ID should be a string",
          })
          .trim()
          .regex(
            /^[a-fA-F0-9]{24}$/,
            "Mission ID must be a valid MongoDB ObjectId"
          ),
        drone_id: zod
          .string({
            required_error: "Drone ID is required",
            invalid_type_error: "Drone ID should be a string",
          })
          .trim()
          .regex(
            /^[a-fA-F0-9]{24}$/,
            "Drone ID must be a valid MongoDB ObjectId"
          ),
        flight_log: zod
          .object({
            initial_position: zod
              .object({
                lat: zod
                  .number({
                    required_error: "Latitude is required",
                    invalid_type_error: "Latitude should be a number",
                  })
                  .min(-90, "Latitude must be between -90 and 90")
                  .max(90, "Latitude must be between -90 and 90"),
                lng: zod
                  .number({
                    required_error: "Longitude is required",
                    invalid_type_error: "Longitude should be a number",
                  })
                  .min(-180, "Longitude must be between -180 and 180")
                  .max(180, "Longitude must be between -180 and 180"),
                alt: zod
                  .number({
                    required_error: "Altitude is required",
                    invalid_type_error: "Altitude should be a number",
                  })
                  .min(0, "Altitude cannot be negative"),
              })
              .required(),
            speed: zod
              .number({
                required_error: "Speed is required",
                invalid_type_error: "Speed should be a number",
              })
              .min(0, "Speed cannot be negative"),
            start_time: zod
              .string({
                required_error: "Start time is required",
                invalid_type_error: "Start time should be a valid date",
              })
          })
          .required(),
      })
      .safeParse({ ...req.body, ...req.params });

    if (error) {
      res
        .status(PRECONDITION_FAILED.code)
        .json(
          handleDataValidation(
            error.issues?.map((i) => `${i.path.join(".")} ${i.message}`)
          )
        );
      return;
    }

    const user_id = req.headers["user_id"];
    if (typeof user_id !== "string") {
      res.status(PRECONDITION_FAILED.code).json({ error: PRECONDITION_FAILED });
      return;
    }

    const { code, response } = await startMissionService({
      ...data,
      user_id,
    });

    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR.code).json(handleControllerError(error));
  }
};

const stopMissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        mission_id: zod
          .string({
            required_error: "Mission ID is required",
            invalid_type_error: "Mission ID must be a string",
          })
          .regex(
            /^[a-fA-F0-9]{24}$/,
            "Mission ID must be a valid MongoDB ObjectId"
          ),
          drone_id: zod
          .string({
            required_error: "Mission ID is required",
            invalid_type_error: "Mission ID must be a string",
          })
          .regex(
            /^[a-fA-F0-9]{24}$/,
            "Mission ID must be a valid MongoDB ObjectId"
          ),
        flight_log_id: zod
          .string({
            required_error: "Flight Log ID is required",
            invalid_type_error: "Flight Log ID must be a string",
          })
          .regex(
            /^[a-fA-F0-9]{24}$/,
            "Flight Log ID must be a valid MongoDB ObjectId"
          ),
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

    const { code, response } = await stopMissionService({
      ...data,
      user_id,
    });

    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR.code).json(handleControllerError(error));
  }
};

export {
  createMissionController,
  getAllMissionController,
  getMissionController,
  deleteMissionController,
  stopMissionController,
  updateMissionController,
  assignDroneMissionController,
  removeDroneMissionController,
  startMissionController,
};
