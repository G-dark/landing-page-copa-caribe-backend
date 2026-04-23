import User, { UserType } from "./user.model.js";
import bcrypt from "bcryptjs";
import { PEPPER, SALT_ROUNDS } from "../App/config.js";

export const registerAUser = async (user: UserType) => {
  const existingUser = await User.find({ username: user.username });

  if (existingUser.length > 0) {
    return { error: "That user already exists" };
  } else {
    user.password = await bcrypt.hash(user.password + PEPPER, SALT_ROUNDS);
    const newUser = new User(user);
    const created = await newUser.save();
    return created
      ? { success: "User registered successfully" }
      : { error: "failed to register the user" };
  }
};
