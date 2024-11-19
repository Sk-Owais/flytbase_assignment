export interface missionCreateParams {
  mission_name: string;
  mission_type:string
  altitude: number;
  speed: number;
  waypoints: { lat: number; lng: number }[];
  user_id: string;
}

export interface missionGetAllParams {
  user_id: string;
}

export interface missionGetParams {
  user_id: string;
  mission_id:string
}

export interface missionUpdateParams {
  mission_name?: string;
  mission_type?:string
  altitude?: number;
  speed?: number;
  waypoints?: { lat: number; lng: number }[];
  user_id: string;
  mission_id:string
}