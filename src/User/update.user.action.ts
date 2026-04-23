import User, { UserType } from "./user.model.js";

export const updateAUser = async (user: UserType, username: string) => {
  const updated = await User.findOneAndUpdate({ username }, { $set: user });

  if (updated) {
    return { success: "User updated successfully" };
  } else {
    return { error: "Failed to update user" };
  }
};
