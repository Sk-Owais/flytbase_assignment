import { Request, Response, NextFunction } from "express";
import zod from "zod";
import { userLoginService, userRegisterService } from "../services/authService";
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
const { OK, INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } = httpStatusCodes;

const userRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        full_name: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .regex(alphaOnlyRegex, {
            message: "should be alphabet, spaces only",
          })
          .min(3, { message: "should be minimum 3 characters" })
          .max(200, { message: "should be less than 200 characters" }),
        email: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .email({ message: "invalid email address" })
          .max(200, { message: "should be less than 200 characters" }),
        contact: zod
          .string()
          .regex(numberOnlyRegex, {
            message: "Phone number should be numbers only",
          })
          .min(10, { message: "Phone number should be minimum 10 digits" })
          .max(10, { message: "Phone number should be maximum 10 digits" }),
        password: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .max(18, { message: "should be less than 18 characters" }),
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

    const { code, response } = await userRegisterService({ ...data });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error, data } = zod
      .object({
        email: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .email({ message: "invalid email address" })
          .max(200, { message: "should be less than 200 characters" }),
        password: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .trim()
          .max(18, { message: "should be less than 18 characters" }),
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

    const { code, response } = await userLoginService({ ...data });
    res.status(code).json(response);
  } catch (error: unknown) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

export { userRegisterController, userLoginController };
