import { Request, Response, NextFunction } from "express";
import zod from "zod";
import tokenModel from "../models/tokenModel";
import {
  handleDataValidation,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import { GLOBAL_ERROR } from "../constants/messageConstant";
import { verifyJwtToken } from "../helpers/commonHelperFunction";

interface CustomRequest extends Request {
  tokenData?: Record<string, any>;
}

const { UNAUTHORIZED, INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } =
  httpStatusCodes;
const {
  CHECK_ACCESS_TOKEN_ERROR,
  CHECK_ACCESS_TOKEN_INVALID,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INVALID,
  REFRESH_TOKEN_NOT_FOUND,
  CHECK_ACCESS_TOKEN_NOT_IN_DATABASE,
  CHECK_ACCESS_TOKEN_EXPIRED,
} = GLOBAL_ERROR;

const checkUserAccessToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data, error } = zod
      .object({
        authorization: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .max(3000, { message: "should be less than 3000 characters" })
          .trim(),
      })
      .safeParse({ authorization: req.headers.authorization });

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

    const isUserAuthorizationValid = await verifyJwtToken(data?.authorization);

    if (!isUserAuthorizationValid) {
      res
        .status(UNAUTHORIZED.code)
        .json(
          handleResponseHandler(
            UNAUTHORIZED.errorCode,
            CHECK_ACCESS_TOKEN_INVALID
          )
        );
      return;
    }

    const checkAccessTokenExistInDatabase = await tokenModel
      .findOne({
        access_token: req.headers.authorization,
        user_id: isUserAuthorizationValid.user_id,
        is_expired: false,
      })
      .lean();

    if (!checkAccessTokenExistInDatabase) {
      res
        .status(UNAUTHORIZED.code)
        .json(
          handleResponseHandler(
            UNAUTHORIZED.errorCode,
            CHECK_ACCESS_TOKEN_NOT_IN_DATABASE
          )
        );
      return;
    }

    req.headers = {
      ...req.headers,
      ...isUserAuthorizationValid,
    };
    next();
  } catch (err) {
    if (err instanceof Error && err.name === "TokenExpiredError") {
      res
        .status(UNAUTHORIZED.code)
        .json(
          handleResponseHandler(
            UNAUTHORIZED.errorCode,
            CHECK_ACCESS_TOKEN_EXPIRED
          )
        );
    } else {
      res
        .status(INTERNAL_SERVER_ERROR.code)
        .json(
          handleResponseHandler(
            INTERNAL_SERVER_ERROR.errorCode,
            CHECK_ACCESS_TOKEN_ERROR
          )
        );
    }
  }
};

const checkUserRefreshToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data, error } = zod
      .object({
        refresh_token: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .max(3000, { message: "should be less than 3000 characters" })
          .trim(),
      })
      .strict()
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

    const isCustomerAuthorizationValid = await verifyJwtToken(
      data?.refresh_token
    );

    if (!isCustomerAuthorizationValid) {
      res
        .status(UNAUTHORIZED.code)
        .json(
          handleResponseHandler(UNAUTHORIZED.errorCode, REFRESH_TOKEN_INVALID)
        );
      return;
    }

    const checkTokenExistInDatabase = await tokenModel
      .findOne({
        user_id: isCustomerAuthorizationValid.user_id,
        refresh_token: data.refresh_token,
        is_expired: false,
      })
      .lean();

    if (!checkTokenExistInDatabase) {
      res
        .status(UNAUTHORIZED.code)
        .json(
          handleResponseHandler(UNAUTHORIZED.errorCode, REFRESH_TOKEN_NOT_FOUND)
        );
      return;
    }

    req.tokenData = {
      ...isCustomerAuthorizationValid,
      refresh_token: data.refresh_token,
    };

    next();
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(INTERNAL_SERVER_ERROR.code)
        .json(
          handleResponseHandler(
            INTERNAL_SERVER_ERROR.errorCode,
            REFRESH_TOKEN_ERROR
          )
        );
    } else {
      res
        .status(INTERNAL_SERVER_ERROR.code)
        .json(
          handleResponseHandler(
            INTERNAL_SERVER_ERROR.errorCode,
            "An unknown error occurred"
          )
        );
    }
  }
};

export { checkUserAccessToken, checkUserRefreshToken };
