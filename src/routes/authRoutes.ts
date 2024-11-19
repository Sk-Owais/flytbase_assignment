import express from "express";
import {
  userRegisterController,
  userLoginController,
} from "../controllers/authController";
const route = express.Router();

route.post("/register", userRegisterController);
route.post("/login", userLoginController);

export default route;
