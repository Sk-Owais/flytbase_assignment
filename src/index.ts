import express, { Request, Response, NextFunction } from "express";
import { PORT, MICROSERVICE_API_PATH } from "../src/config/config";
import connectDB from "./config/db";
import indexRoutes from "./routes/indexRoutes";
import { handleResponseHandler } from "./helpers/responseHandler";
import httpStatusCodes from "./constants/httpsStatusConstant";
import { GLOBAL_ERROR } from "./constants/messageConstant";

const { NOT_FOUND } = httpStatusCodes;
const { API_NOT_FOUND } = GLOBAL_ERROR;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${MICROSERVICE_API_PATH}/api/v1`, indexRoutes);

app.use(
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res
        .status(NOT_FOUND.code)
        .json(handleResponseHandler(NOT_FOUND.errorCode, API_NOT_FOUND));
    } catch (err) {
      next(err);
    }
  }
);

connectDB();
app.listen(PORT, () => {
  console.log(`Server is connected on Port ${PORT}`);
});
