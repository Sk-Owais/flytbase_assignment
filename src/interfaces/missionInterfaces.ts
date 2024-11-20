export interface missionCreateParams {
  mission_name: string;
  mission_type: string;
  speed: number;
  waypoints: { lat: number; lng: number; alt?: number }[];
  user_id: string;
}

export interface missionGetAllParams {
  user_id: string;
}

export interface missionGetParams {
  user_id: string;
  mission_id: string;
}

export interface missionUpdateParams {
  mission_name?: string;
  mission_type?: string;
  speed?: number;
  waypoints?: { lat?: number; lng?: number; alt?: number }[];
  user_id: string;
  mission_id: string;
}

export interface missionAssignDroneParams {
  user_id: string;
  mission_id: string;
  drone_id: string;
}

export interface StartMissionExecutionParams {
  mission_id: string;
  drone_id: string;
  user_id: string;
  flight_log: {
    initial_position: { lat: number; lng: number; alt: number };
    speed: number;
    start_time: string;
  };
}

export interface StopMissionExecutionParams {
  mission_id: string;
  flight_log_id: string;
  user_id: string;
  drone_id:string
}
