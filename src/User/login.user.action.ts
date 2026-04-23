import User from "./user.model.js";
import { PEPPER, JWT_SECRET } from "../App/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginAUser = async (username: string, password: string) => {
  const userFound = await User.find({ username });
  const logged = await bcrypt.compare(password + PEPPER, userFound[0].password);

  if (logged) {
    const payload = {
      username,
      email: userFound[0].email,
      rol: userFound[0].rol,
      team: userFound[0].team,
    };
    const jsonw = jwt.sign(payload, JWT_SECRET, {expiresIn : "1h" });
    return { success: "User logged successfully", token: jsonw };
  } else {
    return { error: "User and password don't match" };
  }
};

export const refreshToken = async (username: string, password: string) => {
  const userFound = await User.find({ username });
  const logged = await bcrypt.compare(password + PEPPER, userFound[0].password);

  if (logged) {
    const payload = {
      username,
      email: userFound[0].email,
      rol: userFound[0].rol,
      team: userFound[0].team,
    };
    const jsonw = jwt.sign(payload, JWT_SECRET, {expiresIn : "15d" });
    return { success: "refresh token done successfully", token: jsonw };
  } else {
    return { error: "User and password don't match" };
  }
};
