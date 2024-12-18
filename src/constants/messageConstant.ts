export const GLOBAL_ERROR = {
  CONTROLLER_ERROR: "Something went wrong in controller",
  SERVICE_ERROR: "Something went wrong in service",
  DATA_VALIDATION: "Api data validation failed",
  API_NOT_FOUND: "Please check the api",
  MAIL_ALREADY_EXISTS: "Email already exists",
  PHONENUMBER_ALREADY_EXISTS: "Phonenumber already exists",
  CHECK_ACCESS_TOKEN_ERROR: "Error while validating access token",
  CHECK_ACCESS_TOKEN_INVALID: "Invalid access token",
  CHECK_ACCESS_TOKEN_NOT_IN_DATABASE: "Access token not found",
  REFRESH_TOKEN_ERROR: "Tokens can not be refreshed!",
  REFRESH_TOKEN_SUCCESS: "Tokens refreshed successfully",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",
  REFRESH_TOKEN_NOT_FOUND: "Refresh token not found",
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  LINK_TOKEN: "LINK_TOKEN",
  UNAUTHORIZED_TOKEN: "Unauthorized access",
  PROVIDE_ANOTHER_EMAIL:
    "Please provide different email previous and updating email should not be same",
  PROVIDE_ANOTHER_PHONENUMBER:
    "Please provide different number previous and updating number should not be same",
  CHECK_ACCESS_TOKEN_EXPIRED: "Token is expired!",
  REGISTER_SESSION_TOKEN_EXPIRED:
    "Register session expired or may be wrong token provided, please check",
  CHECK_REGISTER_SESSION_TOKEN_ERROR:
    "Error while validating register session token",
} as const;

export const COMMON_VALIDATIONS = {
  IS_REQUIRED: "is required",
  NUMBER_REQUIRED: "should be number",
  STRING_REQUIRED: "should be string",
  NUMBER_IN_STRING_REQUIRED: "should be number in string",
  NUMBER_SPACES_ALPHABETS_ONLY: "should be alphabet , numbers , spaces only",
  EMAIL_IS_MANDATORY: "Email is mandatory for creating account",
  INVALID_INPUT: "Invalid input",
  CHAR_LENGTH: (operator: string, length: number): string => {
    return `should be ${operator} than ${length} characters`;
  },
  NUMBER_IS_MANDATORY: "Phonenumber is mandatory for creating account",
} as const;

export const USER_MESSAGES = {
  USER_REGISTER_SUCCESS: "User registered successfully",
  USER_REGISTER_ERROR: "Error while registering user",
  USER_NOT_EXIST: "User does not exist",
  USER_LOGIN_SUCCESS: "User logged in successfully",
  USER_LOGIN_ERROR: "Error while logging user",
  USER_ALREADY_EXIST_ERROR: "User already exists",
  USER_PASSWORD_INCORRECT: "User password is incorrect",
} as const;

export const DRONE_MESSAGES = {
  DRONE_ALREADY_EXIST_ERROR: "Drone already exists",
  DRONE_CREATED_SUCCESS: "Drone created successfully",
  DRONE_CREATED_ERROR: "Error while creating drone",
  DRONES_FETCHED_SUCCESS: "All drones fetched successfully",
  DRONES_FETCHED_ERROR: "Error while fetching drones",
  DRONE_NOT_EXIST: "Drones does not exist",
  DRONE_FETCHED_SUCCESS: "Drone fetched successfully",
  DRONE_FETCHED_ERROR: "Error while fetching drone",
  DRONE_UPDATED_SUCCESS: "Drone updated successfully",
  DRONE_UPDATED_ERROR: "Error while updating drone",
  DRONE_DELETED_SUCCESS: "Drone deleted successfully",
  DRONE_DELETED_ERROR: "Error while updating drone",
} as const;

export const MISSION_MESSAGES = {
  MISSION_ALREADY_EXIST_ERROR: "Mission already exists",
  MISSION_CREATED_SUCCESS: "Mission created successfully",
  MISSION_CREATED_ERROR: "Error while creating mission",
  MISSIONS_FETCHED_SUCCESS: "All missions fetched successfully",
  MISSIONS_FETCHED_ERROR: "Error while fetching missions",
  MISSION_NOT_EXIST: "Mission does not exist",
  MISSION_FETCHED_SUCCESS: "Mission fetched successfully",
  MISSION_FETCHED_ERROR: "Error while fetching mission",
  MISSION_UPDATED_SUCCESS: "Mission updated successfully",
  MISSION_UPDATED_ERROR: "Error while updating mission",
  MISSION_DELETED_SUCCESS: "Mission deleted successfully",
  MISSION_DELETED_ERROR: "Error while deleting mission",
  MISSION_ASSIGNED_SUCCESS: "Mission assigned to drone successfully",
  MISSION_ASSIGNED_ERROR: "Error while assigning mission to drone",
  MISSION_REMOVED_SUCCESS: "Mission removed from drone successfully",
  MISSION_REMOVED_ERROR: "Error while removing mission from drone",
  MISSION_STARTED_SUCCESS: "Mission started successfully",
  MISSION_STARTED_ERROR: "Error while starting mission",
  MISSION_NOT_ASSIGNED_ERROR: "MIssion is not assigned to drone",
  MISSION_STOPPED_SUCCESS: "Mission stopped successfully",
  MISSION_STOPPED_ERROR: "Error while stoping mission",
} as const;

export const FLIGHT_MESSAGES = {
  FLIGHT_NOT_EXIST: "Flight logs does not exist",
  FLIGHT_FETCHED_SUCCESS: "Flight fetched successfully",
  FLIGHT_FETCHED_ERROR: "Error while fetching flight",
  FLIGHT_PDF_GENERATED_SUCCESS: "PDF generated successfully. Please find it in service folder",
} as const;
