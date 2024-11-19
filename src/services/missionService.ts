import mongoose, { Types } from "mongoose";
import userModel from "../models/userModel";
import missionModel from "../models/missionModel";
import {
  missionCreateParams,
  missionGetAllParams,
  missionUpdateParams,
  missionGetParams,
} from "../interfaces/missionInterfaces";
import {
  handleServiceError,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import { USER_MESSAGES, MISSION_MESSAGES } from "../constants/messageConstant";
const { USER_NOT_EXIST } = USER_MESSAGES;
const {
  MISSION_ALREADY_EXIST_ERROR,
  MISSION_CREATED_ERROR,
  MISSION_CREATED_SUCCESS,
  MISSIONS_FETCHED_ERROR,
  MISSIONS_FETCHED_SUCCESS,
  MISSION_FETCHED_SUCCESS,
  MISSION_DELETED_SUCCESS,
  MISSION_FETCHED_ERROR,
  MISSION_DELETED_ERROR,
  MISSION_NOT_EXIST,
  MISSION_UPDATED_ERROR,
  MISSION_UPDATED_SUCCESS,
} = MISSION_MESSAGES;
const { OK, INTERNAL_SERVER_ERROR } = httpStatusCodes;

async function createMissionService(params: missionCreateParams): Promise<any> {
  const { mission_name, altitude, speed, waypoints, user_id, mission_type } =
    params;
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
    const checkMission = await missionModel
      .findOne({ mission_name, is_active: true, is_deleted: false })
      .lean();
    if (checkMission) {
      return {
        code: OK.code,
        response: handleResponseHandler(
          OK.errorCode,
          MISSION_ALREADY_EXIST_ERROR
        ),
      };
    }
    const createMission = await missionModel.create({
      mission_name,
      mission_type,
      altitude,
      speed,
      waypoints,
      created_by: user_id,
    });
    await userModel
      .findByIdAndUpdate(
        user_id,
        { $push: { missions: createMission._id } },
        { new: true }
      )
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        createMission ? MISSION_CREATED_SUCCESS : MISSION_CREATED_ERROR,
        !!createMission,
        { createMission }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function getAllMissionsService(
  params: missionGetAllParams
): Promise<any> {
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
    const getAllMissions = await missionModel
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
        getAllMissions ? MISSIONS_FETCHED_SUCCESS : MISSIONS_FETCHED_ERROR,
        !!getAllMissions,
        { getAllMissions }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function getMissionService(params: missionGetParams): Promise<any> {
  const { user_id, mission_id } = params;
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
    const getMission = await missionModel
      .findOne({
        _id: mission_id,
        created_by: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        getMission ? MISSION_FETCHED_SUCCESS : MISSION_FETCHED_ERROR,
        !!getMission,
        { getMission }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function deleteMissionService(params: missionGetParams): Promise<any> {
  const { user_id, mission_id } = params;
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
    const checkMission = await missionModel
      .findOne({
        _id: mission_id,
        created_by: user_id,
        is_active: true,
        is_deleted: false,
      })
      .lean();
    if (!checkMission) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, MISSION_NOT_EXIST),
      };
    }
    const deleteMission = await missionModel
      .findByIdAndUpdate(
        mission_id,
        { is_active: false, is_deleted: true },
        { new: true }
      )
      .lean();
    await userModel
      .findByIdAndUpdate(
        user_id,
        { $pull: { drones: mission_id } },
        { new: true }
      )
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        deleteMission ? MISSION_DELETED_SUCCESS : MISSION_DELETED_ERROR,
        !!deleteMission,
        { deleteMission }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function updateMissionService(params: missionUpdateParams): Promise<any> {
  const {
    mission_name,
    altitude,
    speed,
    waypoints,
    user_id,
    mission_id,
    mission_type,
  } = params;
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
    const checkMission = await missionModel
      .findOne({ _id: mission_id, is_active: true, is_deleted: false })
      .lean();
    if (!checkMission) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, MISSION_NOT_EXIST),
      };
    }
    const updateMission = await missionModel
      .findByIdAndUpdate(
        mission_id,
        { mission_name, altitude, speed, waypoints, mission_type },
        { new: true }
      )
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        updateMission ? MISSION_UPDATED_SUCCESS : MISSION_UPDATED_ERROR,
        !!updateMission,
        { updateMission }
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
  createMissionService,
  getAllMissionsService,
  getMissionService,
  deleteMissionService,
  updateMissionService,
};
