import { deleteAUser } from "./delete.user.action.js";
import { registerAUser } from "./create.user.action.js";
import { readUser } from "./read.user.action.js";
import { updateAUser } from "./update.user.action.js";
import { loginAUser, refreshToken } from "./login.user.action.js";
import { UserType } from "./user.model.js";


export const makeUserController = async (user: UserType) => {
  try {
    return await registerAUser(user);
  } catch (error) {
    return { error: "Failed to delete" };
  }
};

export const deleteUserController = async (username: string) => {
  try {
    return await deleteAUser(username);
  } catch (error) {
    return { error: "Failed to delete" };
  }
};

export const updateUserController = async (
  username: string,
  user: UserType,
) => {
  try {
    return await updateAUser(user, username);
  } catch (error) {
    return { error: "Failed to update" };
  }
};

export const getUserController = async (username?: string) => {
  try {
    return await readUser(username);
  } catch (error) {
    return { error: "Failed to get" };
  }
};

export const loginUserController = async (
  username: string,
  password: string,
) => {
  try {
    return await loginAUser(username, password);
  } catch (error) {
    return { error: "Failed to login" };
  }
};

export const refreshTokenController = async (
  username: string,
  password: string,
) => {
  try {
    return await refreshToken(username, password);
  } catch (error) {
    return { error: "Failed to refresh token" };
  }
};
