import { Request, Response, Router } from "express";
import {
  getUserController,
  deleteUserController,
  updateUserController,
  makeUserController,
  loginUserController,
  refreshTokenController,
} from "./user.controller.js";
import { AuthRequest, authMiddleware } from "../Middlewares/auth.middleware.js";
import { PEPPER, SALT_ROUNDS } from "../App/config.js";
import bcrypt from "bcryptjs";
import { UserType } from "./user.model.js";
import { sendEmailController } from "../SignedPeople/signedpeople.controller.js";
const userRouter = Router();

const getUserHandlerByUsername: any = async (
  req: AuthRequest,
  res: Response,
) => {
  const { username } = req.params;
  if (req.user?.rol == "Admin" || (username as string) == req.user?.username) {
    const result = await getUserController(username as string);
    const statusCode = typeof result == "string" ? 500 : 200;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "No Permissions" });
  }
};

const getUserHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const result = await getUserController();
    const statusCode = typeof result == "string" ? 500 : 200;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "No Permissions" });
  }
};

const deleteUserHandler: any = async (req: AuthRequest, res: Response) => {
  const { username } = req.params;
  if (req.user?.rol == "Admin") {
    const result = await deleteUserController(username as string);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "No Permissions" });
  }
};

const updateUserHandler: any = async (req: AuthRequest, res: Response) => {
  const { user } = req.body;
  const { username } = req.params;
  if (username == req.user?.username) {
    if (user.password !== "" && user.password !== "No password") {
      user.password = await bcrypt.hash(user.password + PEPPER, SALT_ROUNDS);
    } else {
      user.password = undefined;
    }

    const result = await updateUserController(username as string, user);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "No Permissions" });
  }
};

const createUserHandler: any = async (req: AuthRequest, res: Response) => {
  const { user } = req.body;
  if (req.user?.rol == "Admin") {
    const result = await makeUserController(user);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "No Permissions" });
  }
};
const loginUserHandler: any = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await loginUserController(username, password);
  const statusCode = result.success ? 200 : 500;
  return res.status(statusCode).json(result);
};

const refreshTokenHandler: any = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await refreshTokenController(username, password);
  const statusCode = result.success ? 200 : 500;
  return res.status(statusCode).json(result);
};

const CreateUser4SignedHandler: any = async (
  req: AuthRequest,
  res: Response,
) => {
  const { name, lastName, id, email, tel } = req.body;
  let user: UserType;
  if (req.user?.rol == "Admin") {
    let result2, result, name1, name2, ln1, ln2;
    let usernameS = "";
    do {
      if (name.includes(" ")) {
        const partes = name.split(" ");
        name1 = partes[0];
        name2 = partes[1];
      }
      if (lastName.includes(" ")) {
        const partes = lastName.split(" ");
        ln1 = partes[0];
        ln2 = partes[1];
      }

      const values: string[] = [name, name2, ln1, ln2];
      // selecciona un nombre y corta en tres letras para empezar
      let seleccion = Math.floor(Math.random() * 4);
      usernameS += values[seleccion].substring(0, 3);
      values.filter((v) => {
        return v !== values[seleccion];
      });

      // selecciona un nombre de los restantes completo
      seleccion = Math.floor(Math.random() * 3);
      usernameS += values[seleccion];
      values.filter((v) => {
        return v !== values[seleccion];
      });

      //selecciona la inicial de alguno de los dos ultimos
      seleccion = Math.floor(Math.random() * 2);
      usernameS += values[seleccion].substring(0, 1);

       user = {
        username: usernameS,
        password: id,
        email,
        tel,
        rol: "User",
      };
      result2 = await makeUserController(user);
    } while ("Error" in result2);
    result = await sendEmailController(
      email,
      "Introduction",
      name,
      usernameS,
      id,
    );
    const statusCode =  result.success && result2.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
userRouter.get("/API/user/:username", authMiddleware, getUserHandlerByUsername);
userRouter.get("/API/users", authMiddleware, getUserHandler);
userRouter.post("/API/user/create", authMiddleware, createUserHandler);
userRouter.post(
  "/API/user/createUser4Signed",
  authMiddleware,
  CreateUser4SignedHandler,
);
userRouter.post("/API/user/login", loginUserHandler);
userRouter.post("/API/user/refreshToken", refreshTokenHandler);
userRouter.delete(
  "/API/user/delete/:username",
  authMiddleware,
  deleteUserHandler,
);
userRouter.patch(
  "/API/user/update/:username",
  authMiddleware,
  updateUserHandler,
);

export default userRouter;
