import {app} from './app.js';
import { APP_PORT, SUPER_USER, SUPER_USER_PW } from './config.js';
import { makeUserController } from '../User/user.controller.js';
import { UserType } from '../User/user.model.js';

const user: UserType = {
  username: SUPER_USER,
  password: SUPER_USER_PW,
  tel:"",
  rol: "Admin",
};

app.listen(APP_PORT,async () => {
    console.log(`Server running on port ${APP_PORT}`);
    console.log(await initializeSuperUser(user));
});

const initializeSuperUser = async (user: UserType) => {
  return await makeUserController(user);
};