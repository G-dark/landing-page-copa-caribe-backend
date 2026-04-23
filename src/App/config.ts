import { config } from "dotenv";
import mongoose from "mongoose";


config();

export const APP_PORT = process.env.PORT || 3000;
export const APP_HOST = process.env.HOST || "localhost";
export const MONGO_URI = process.env.MONGO_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const SALT_ROUNDS = process.env.SALT_ROUNDS
  ? parseInt(process.env.SALT_ROUNDS)
  : 10;
export const PEPPER = process.env.PEPPER || "";
export const SUPER_USER = process.env.SUPER_USER || "super_user";
export const SUPER_USER_PW =
  process.env.SUPER_USER_PW ||
  " ";
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
export const SENDER = process.env.SENDER || "";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });


