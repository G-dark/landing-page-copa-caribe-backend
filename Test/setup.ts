import { SUPER_USER, SUPER_USER_PW } from "../src/App/config.js";
import { makeUserController } from "../src/User/user.controller.js";
import { UserType } from "../src/User/user.model.js";
import mongoose from "mongoose";

const user: UserType = {
  username: SUPER_USER,
  password: SUPER_USER_PW,
  tel: "",
  rol: "Admin",
};

beforeAll(async () => {
  const initializeSuperUser = async (user: UserType) => {
    return await makeUserController(user);
  };

  await initializeSuperUser(user);
});


afterAll(async () => {
   const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}, 20000);
