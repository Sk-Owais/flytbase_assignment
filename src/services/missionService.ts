import mongoose, { Types } from "mongoose";
import userModel from "../models/userModel";
import droneModel from "../models/droneModel";
import missionModel from "../models/missionModel";
import flightLogModel from "../models/flightLogModel";
import {
  calculateDistance,
  calculateTimeToTravel,
  getCurrentPosition,
  calculateTotalDistance,
} from "../helpers/simulationFunctions";
import { generateUniqueId } from "../helpers/commonHelperFunction";
import {
  missionCreateParams,
  missionGetAllParams,
  missionUpdateParams,
  missionGetParams,
  missionAssignDroneParams,
  StartMissionExecutionParams,
  StopMissionExecutionParams,
} from "../interfaces/missionInterfaces";
import {
  handleServiceError,
  handleResponseHandler,
} from "../helpers/responseHandler";
import httpStatusCodes from "../constants/httpsStatusConstant";
import {
  USER_MESSAGES,
  MISSION_MESSAGES,
  DRONE_MESSAGES,
  FLIGHT_MESSAGES,
} from "../constants/messageConstant";
const { USER_NOT_EXIST } = USER_MESSAGES;
const { FLIGHT_NOT_EXIST } = FLIGHT_MESSAGES;
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
  MISSION_NOT_ASSIGNED_ERROR,
  MISSION_ASSIGNED_ERROR,
  MISSION_ASSIGNED_SUCCESS,
  MISSION_REMOVED_ERROR,
  MISSION_REMOVED_SUCCESS,
  MISSION_STARTED_ERROR,
  MISSION_STARTED_SUCCESS,
  MISSION_STOPPED_ERROR,
  MISSION_STOPPED_SUCCESS,
} = MISSION_MESSAGES;
const { DRONE_NOT_EXIST } = DRONE_MESSAGES;
const { OK, INTERNAL_SERVER_ERROR } = httpStatusCodes;

async function createMissionService(params: missionCreateParams): Promise<any> {
  const { mission_name, speed, waypoints, user_id, mission_type } = params;
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
  const { mission_name, speed, waypoints, user_id, mission_id, mission_type } =
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
        { mission_name, speed, waypoints, mission_type },
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

async function assignDroneMissionService(
  params: missionAssignDroneParams
): Promise<any> {
  const { drone_id, user_id, mission_id } = params;
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
    const assignMission = await missionModel
      .findByIdAndUpdate(
        mission_id,
        { $push: { drones: drone_id } },
        { new: true }
      )
      .lean();
    await droneModel
      .findByIdAndUpdate(
        drone_id,
        { $push: { missions: mission_id } },
        { new: true }
      )
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        assignMission ? MISSION_ASSIGNED_SUCCESS : MISSION_ASSIGNED_ERROR,
        !!assignMission,
        { assignMission }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function removeDroneMissionService(
  params: missionAssignDroneParams
): Promise<any> {
  const { drone_id, user_id, mission_id } = params;
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
    const assignMission = await missionModel
      .findByIdAndUpdate(
        mission_id,
        { $pull: { drones: drone_id } },
        { new: true }
      )
      .lean();
    await droneModel
      .findByIdAndUpdate(
        drone_id,
        { $pull: { missions: mission_id } },
        { new: true }
      )
      .lean();
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        assignMission ? MISSION_REMOVED_SUCCESS : MISSION_REMOVED_ERROR,
        !!assignMission,
        { assignMission }
      ),
    };
  } catch (error: unknown) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function startMissionService(
  params: StartMissionExecutionParams
): Promise<any> {
  const { drone_id, user_id, mission_id, flight_log } = params;

  try {
    // Verify user exists and is active
    const checkUser = await userModel
      .findOne({ _id: user_id, is_active: true, is_deleted: false })
      .lean();
    if (!checkUser) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_EXIST),
      };
    }

    // Verify mission exists
    const checkMission = await missionModel
      .findOne({ _id: mission_id, is_active: true, is_deleted: false })
      .lean();
    if (!checkMission) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, MISSION_NOT_EXIST),
      };
    }

    const checkDrone = await droneModel
      .findOne({
        _id: drone_id,
        created_by: user_id,
        is_active: true,
        is_deleted: false,
        status: "available",
      })
      .lean();
    if (!checkDrone) {
      return {
        code: OK.code,
        response: handleResponseHandler(
          OK.errorCode,
          MISSION_NOT_ASSIGNED_ERROR
        ),
      };
    }

    const newFlightLog = new flightLogModel({
      flight_log_id: generateUniqueId(),
      mission_name: checkMission.mission_name,
      drone_id,
      waypoints: [
        {
          time: 0,
          lat: flight_log.initial_position.lat,
          lng: flight_log.initial_position.lng,
          alt: flight_log.initial_position.alt,
        },
      ],
      speed: flight_log.speed,
      distance: 0,
      execution_start: flight_log.start_time,
      execution_end: null,
    });

    const savedFlightLog = await newFlightLog.save();

    let currentTime = new Date(flight_log.start_time);
    let currentPosition = {
      lat: flight_log.initial_position.lat,
      lng: flight_log.initial_position.lng,
      alt: flight_log.initial_position.alt,
    };

    for (let i = 1; i < checkMission.waypoints.length; i++) {
      const startPoint = checkMission.waypoints[i - 1];
      const endPoint = checkMission.waypoints[i];

      const distance = calculateDistance(
        startPoint.lat,
        startPoint.lng,
        endPoint.lat,
        endPoint.lng
      );
      const travelTime = calculateTimeToTravel(distance, flight_log.speed);

      currentTime.setTime(currentTime.getTime() + travelTime);
      currentPosition = {
        lat: endPoint.lat,
        lng: endPoint.lng,
        alt: endPoint.alt || 0,
      };

      await flightLogModel.findByIdAndUpdate(
        savedFlightLog._id,
        {
          $push: {
            waypoints: {
              time: currentTime,
              lat: currentPosition.lat,
              lng: currentPosition.lng,
              alt: endPoint.alt !== undefined ? endPoint.alt : 0,
            },
          },
        },
        { new: true }
      );
    }
    await missionModel
      .findByIdAndUpdate(
        mission_id,
        { $set: { status: "started" } },
        { new: true }
      )
      .lean();
    if (checkMission?.drones?.length) {
      const droneID = checkMission.drones[0];
      await droneModel
        .findByIdAndUpdate(
          droneID,
          { $set: { status: "in use" } },
          { new: true }
        )
        .lean();
    }
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        savedFlightLog ? MISSION_STARTED_SUCCESS : MISSION_STARTED_ERROR,
        !!savedFlightLog,
        { savedFlightLog }
      ),
    };
  } catch (error) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function stopMissionService(
  params: StopMissionExecutionParams
): Promise<any> {
  const { mission_id, flight_log_id, user_id, drone_id } = params;

  try {
    const checkUser = await userModel
      .findOne({ _id: user_id, is_active: true, is_deleted: false })
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
        status: "available",
      })
      .lean();
    if (!checkDrone) {
      return {
        code: OK.code,
        response: handleResponseHandler(
          OK.errorCode,
          MISSION_NOT_ASSIGNED_ERROR
        ),
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

    const checkFlightLog = await flightLogModel
    .findOne({ flight_log_id })
    .lean();
    if (!checkFlightLog) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, FLIGHT_NOT_EXIST),
      };
    }

    const updatedFlightLog = await flightLogModel
    .findOneAndUpdate(
      { flight_log_id },
      { $set: { execution_end: new Date() } },
      { new: true }
    )
    .lean();

    if (!updatedFlightLog) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, MISSION_STOPPED_ERROR),
      };
    }

    const totalDistance = calculateTotalDistance(
      updatedFlightLog.waypoints.map((waypoint) => ({
        lat: waypoint.lat,
        lng: waypoint.lng,
      }))
    );
    const totalTime =
      (new Date().getTime() -
        new Date(updatedFlightLog.execution_start).getTime()) /
      1000;
    const averageSpeed = totalDistance / totalTime;

    await flightLogModel.findByIdAndUpdate(
      updatedFlightLog._id,
      {
        $set: {
          total_distance: totalDistance,
          total_time: totalTime,
          average_speed: averageSpeed,
          execution_end: new Date(),
        },
      },
      { new: true }
    );

    const currentPosition = getCurrentPosition();
    await flightLogModel.findByIdAndUpdate(
      updatedFlightLog._id,
      {
        $push: {
          waypoints: {
            time: new Date(),
            lat: currentPosition.lat,
            lng: currentPosition.lng,
            alt: currentPosition.alt,
          },
        },
      },
      { new: true }
    );

    await missionModel
      .findByIdAndUpdate(
        mission_id,
        { $set: { status: "ended" } },
        { new: true }
      )
      .lean();

    await droneModel
      .findByIdAndUpdate(
        drone_id,
        { $set: { status: "available" } },
        { new: true }
      )
      .lean();

    await missionModel
      .findByIdAndUpdate(
        mission_id,
        { $pull: { drones: drone_id } },
        { new: true }
      )
      .lean();

    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        MISSION_STOPPED_SUCCESS,
        true,
        { updatedFlightLog }
      ),
    };
  } catch (error) {
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
  assignDroneMissionService,
  removeDroneMissionService,
  startMissionService,
  stopMissionService,
};
