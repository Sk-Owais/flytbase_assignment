import { DEBUG } from "../config/config";
import httpStatusCodes from "../constants/httpsStatusConstant";
const { INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } = httpStatusCodes;
import { GLOBAL_ERROR } from "../constants/messageConstant";
const { CONTROLLER_ERROR, SERVICE_ERROR, DATA_VALIDATION } = GLOBAL_ERROR;

interface ResponseHandler {
  statusCode: string;
  success: boolean;
  message: string;
  data: Record<string, unknown>;
  error: Record<string, unknown>;
}

const handleResponseHandler = (
  statusCode: string = INTERNAL_SERVER_ERROR.message,
  message: string = "Internal server error",
  success: boolean = false,
  data: Record<string, unknown> = {},
  error: Record<string, unknown> = {}
): ResponseHandler => {
  return { statusCode, success, message, data, error };
};

const handleControllerError = (e: unknown): ResponseHandler => {
  if (e instanceof Error) {
    DEBUG && console.debug(e);
    return handleResponseHandler(
      INTERNAL_SERVER_ERROR.errorCode,
      CONTROLLER_ERROR
    );
  }
  DEBUG && console.debug("Unknown error:", e);
  return handleResponseHandler(
    INTERNAL_SERVER_ERROR.errorCode,
    CONTROLLER_ERROR
  );
};

const handleServiceError = (e: unknown): ResponseHandler => {
  if (e instanceof Error) {
    DEBUG && console.debug(e);
    return handleResponseHandler(
      INTERNAL_SERVER_ERROR.errorCode,
      SERVICE_ERROR
    );
  } else {
    DEBUG && console.debug("Unknown error:", e);
    return handleResponseHandler(
      INTERNAL_SERVER_ERROR.errorCode,
      SERVICE_ERROR
    );
  }
};

const handleDataValidation = (
  validationErrorArr: string[]
): ResponseHandler => {
  return handleResponseHandler(
    PRECONDITION_FAILED.errorCode,
    DATA_VALIDATION,
    false,
    {},
    {
      validationErrorArr,
    }
  );
};

export {
  handleResponseHandler,
  handleControllerError,
  handleServiceError,
  handleDataValidation,
};
