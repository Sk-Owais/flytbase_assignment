import mongoose from "mongoose";
import userModel from "../models/userModel";
import tokenModel from "../models/tokenModel";
import {
  UserLoginParams,
  UserRegistrationParams,
} from "../interfaces/authInterfaces";
import {
  handleServiceError,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import { GLOBAL_ERROR, USER_MESSAGES } from "../constants/messageConstant";
import { generateJwtToken } from "../helpers/commonHelperFunction";
const {
  USER_ALREADY_EXIST_ERROR,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_ERROR,
  USER_NOT_EXIST,
  USER_LOGIN_ERROR,
  USER_LOGIN_SUCCESS,
  USER_PASSWORD_INCORRECT,
} = USER_MESSAGES;
const { OK, INTERNAL_SERVER_ERROR } = httpStatusCodes;
const { ACCESS_TOKEN, REFRESH_TOKEN } = GLOBAL_ERROR;

async function userRegisterService(
  params: UserRegistrationParams
): Promise<any> {
  const { email, contact, full_name, password } = params;
  try {
    const checkUser = await userModel
      .findOne({
        is_active: true,
        is_deleted: false,
        email,
        contact,
      })
      .lean();
    if (checkUser) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_ALREADY_EXIST_ERROR),
      };
    }
    const createUser = await userModel.create(params);
    const accessToken = await generateJwtToken(
      {
        user_id: createUser._id,
        token_type: ACCESS_TOKEN,
      },
      60 * 60 * 24
    );
    const refreshToken = await generateJwtToken(
      {
        user_id: createUser._id,
        token_type: REFRESH_TOKEN,
      },
      60 * 60 * 28 * 24
    );
    await tokenModel.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      is_expired: 0,
      user_id: createUser._id,
    });
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        createUser && accessToken && refreshToken
          ? USER_REGISTER_SUCCESS
          : USER_REGISTER_ERROR,
        !!createUser,
        createUser ? { createUser, accessToken, refreshToken } : {}
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function userLoginService(params: UserLoginParams): Promise<any> {
  const { email, password } = params;
  try {
    const checkUser = await userModel
      .findOne({
        is_active: true,
        is_deleted: false,
        email,
      })
      .lean();
    if (!checkUser) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }
    if (checkUser?.password !== password) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_PASSWORD_INCORRECT),
      };
    }
    const accessToken = await generateJwtToken(
      {
        user_id: checkUser._id,
        token_type: ACCESS_TOKEN,
      },
      60 * 60 * 24
    );
    const refreshToken = await generateJwtToken(
      {
        user_id: checkUser._id,
        token_type: REFRESH_TOKEN,
      },
      60 * 60 * 28 * 24
    );
    await tokenModel.updateMany(
      {
        user_id: checkUser._id,
        is_expired: false,
      },
      {
        $set: {
          is_expired: true,
        },
      }
    );
    await tokenModel.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      is_expired: 0,
      user_id: checkUser._id,
    });
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        checkUser && accessToken && refreshToken
          ? USER_LOGIN_SUCCESS
          : USER_LOGIN_ERROR,
        !!checkUser,
        checkUser ? { checkUser, accessToken, refreshToken } : {}
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}
export { userRegisterService, userLoginService };
