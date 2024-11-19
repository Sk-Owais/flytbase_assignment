import dotenv from "dotenv";

dotenv.config();

interface JwtConfig {
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
  JWT_ALGORITHM: string;
}

export const PORT: number = parseInt(process.env.PORT || "1001", 10);
export const DEBUG: boolean = true;
export const APP_HOST_WITHOUT_PROTOCOL: string = process.env.APP_HOST_WITHOUT_PROTOCOL || `localhost:1001`;
export const MICROSERVICE_API_PATH: string = process.env.MICROSERVICE_API_PATH || "/flytbase";

export const JWT: JwtConfig = {
  JWT_ISSUER: process.env.JWT_ISSUER || "flytbase",
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || "Authentication Service",
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || "RS256",
};
