import mongoose, { Types } from "mongoose";
import userModel from "../models/userModel";
import droneModel from "../models/droneModel";
import {
  droneCreateParams,
  droneGetAllParams,
  droneGetParams,
  droneUpdateParams,
} from "../interfaces/droneInterfaces";
import {
  handleServiceError,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import { USER_MESSAGES, DRONE_MESSAGES } from "../constants/messageConstant";
const { USER_NOT_EXIST } = USER_MESSAGES;
const {
  DRONE_ALREADY_EXIST_ERROR,
  DRONE_CREATED_ERROR,
  DRONE_CREATED_SUCCESS,
  DRONES_FETCHED_ERROR,
  DRONES_FETCHED_SUCCESS,
  DRONE_NOT_EXIST,
  DRONE_FETCHED_ERROR,
  DRONE_FETCHED_SUCCESS,
  DRONE_UPDATED_ERROR,
  DRONE_UPDATED_SUCCESS,
  DRONE_DELETED_ERROR,
  DRONE_DELETED_SUCCESS,
} = DRONE_MESSAGES;
const { OK, INTERNAL_SERVER_ERROR } = httpStatusCodes;

async function createDroneService(params: droneCreateParams): Promise<any> {
  const { drone_name, drone_type, user_id } = params;
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
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }
    const checkDrone = await droneModel
      .findOne({
        drone_name,
        is_active: true,
        is_deleted: false,
      })
      .lean();
    if (checkDrone) {
      return {
        code: OK.code,
        response: handleResponseHandler(
          OK.errorCode,
          DRONE_ALREADY_EXIST_ERROR
        ),
      };
    }
    const createDrone = await droneModel.create({
      drone_name,
      drone_type,
      created_by: user_id,
    });
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        createDrone ? DRONE_CREATED_SUCCESS : DRONE_CREATED_ERROR,
        !!createDrone,
        { createDrone }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function getAllDronesService(params: droneGetAllParams): Promise<any> {
  const { user_id } = params;
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
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }
    const getAllDrone = await droneModel
      .find({
        created_by: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        getAllDrone ? DRONES_FETCHED_SUCCESS : DRONES_FETCHED_ERROR,
        !!getAllDrone,
        { getAllDrone }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function getDroneService(params: droneGetParams): Promise<any> {
  const { user_id, drone_id } = params;
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
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }
    const getDrone = await droneModel
      .findOne({
        _id: drone_id,
        created_by: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        getDrone ? DRONE_FETCHED_SUCCESS : DRONE_FETCHED_ERROR,
        !!getDrone,
        { getDrone }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function updateDroneService(params: droneUpdateParams): Promise<any> {
  const { user_id, drone_id, drone_name, drone_type } = params;
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
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }
    const checkDrone = await droneModel
      .findOne({
        _id: drone_id,
        created_by: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();
    if (!checkDrone) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, DRONE_NOT_EXIST),
      };
    }
    const updateDrone = await droneModel
      .findByIdAndUpdate(drone_id, { drone_name, drone_type }, { new: true })
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        updateDrone ? DRONE_UPDATED_SUCCESS : DRONE_UPDATED_ERROR,
        !!updateDrone,
        { updateDrone }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function deleteDroneService(params: droneGetParams): Promise<any> {
  const { user_id, drone_id } = params;
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
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }
    const checkDrone = await droneModel
      .findOne({
        _id: drone_id,
        created_by: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();
    if (!checkDrone) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, DRONE_NOT_EXIST),
      };
    }
    const deleteDrone = await droneModel
      .findByIdAndUpdate(
        drone_id,
        { is_active: false, is_deleted: true },
        { new: true }
      )
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        deleteDrone ? DRONE_DELETED_SUCCESS : DRONE_DELETED_ERROR,
        !!deleteDrone,
        { deleteDrone }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

export {
  createDroneService,
  getAllDronesService,
  getDroneService,
  updateDroneService,
  deleteDroneService,
};
