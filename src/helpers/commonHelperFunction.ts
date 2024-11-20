import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { JWT } from "../config/config";
import mongoose from "mongoose";
const privateKEY = fs.readFileSync(
  path.join(__dirname, "../../certs/private.key"),
  "utf8"
);
const publicKEY = fs.readFileSync(
  path.join(__dirname, "../../certs/public.key"),
  "utf8"
);

const { JWT_ALGORITHM, JWT_ISSUER, JWT_AUDIENCE } = JWT;

interface Payload {
  [key: string]: any;
}

const generateJwtToken = async (
  payload: Payload,
  expired_at?: string | number
): Promise<string> => {
  const signOptions: SignOptions = {
    issuer: JWT_ISSUER,
    subject: JWT_AUDIENCE,
    audience: JWT_AUDIENCE,
    algorithm: JWT_ALGORITHM as jwt.Algorithm,
    allowInsecureKeySizes: true,
  };

  if (expired_at) {
    signOptions.expiresIn = expired_at;
  }

  return jwt.sign(payload, privateKEY, signOptions);
};

const verifyJwtToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const verifyOptions: VerifyOptions = {
      issuer: JWT_ISSUER,
      subject: JWT_AUDIENCE,
      audience: JWT_AUDIENCE,
      algorithms: [JWT_ALGORITHM as jwt.Algorithm],
    };

    const verifiedToken = jwt.verify(
      token,
      publicKEY,
      verifyOptions
    ) as JwtPayload;

    return verifiedToken;
  } catch (e) {
    return null;
  }
};

const generateUniqueId = (): string => {
  return new mongoose.Types.ObjectId().toString();
};

export { generateJwtToken, verifyJwtToken, generateUniqueId };
