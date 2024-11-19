export interface droneCreateParams {
  drone_name: string;
  drone_type: string;
  user_id: string;
}

export interface droneGetAllParams {
  user_id: string;
}

export interface droneGetParams {
  drone_id: string;
  user_id: string;
}

export interface droneUpdateParams {
  drone_name?: string;
  drone_type?: string;
  user_id: string;
  drone_id: string;
}
