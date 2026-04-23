import User, { UserType as userType } from "./user.model.js";

export const readUser = async (username?: string) => {
  if (username) {
    const user = await User.find({ username });
    user[0].password = "No password";
    return user ? user[0] : { error: "User not found" };
  } else {
    const users = await User.find();
    users.map((user) => {
      user.password = "No password";
      return transform2User(user);
    });

    return users.length > 0 ? users : { error: "there aren't users yet" };
  }
};


const transform2User = (user: any): userType => {
  return {
    username: user.username,
    email: user.email,
    password: user.password,
    rol: user.rol,
    team: user.team,
    tel: user.tel
  };
};