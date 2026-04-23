import { Request, Response, Router } from "express";
import {
  getTeamsController,
  updateTeamController,
  deleteTeamController,
  makeTeamController,
  addCoachController,
  deleteCoachController,
  updateCoachController,
} from "./team.controller.js";
import { AuthRequest, authMiddleware } from "../Middlewares/auth.middleware.js";
import { uploadImage } from "../Middlewares/storage.middleware.js";
import { coachInfo, teamType } from "./team.model.js";
const teamRouter = Router();

const getTeamsHandlerID: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getTeamsController(id as string, undefined);
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};

const getTeamsHandlerQuery: any = async (req: Request, res: Response) => {
  const { name, edition, country, category } = req.query;
  let query: any = {};
  if (name) {
    query.name = name;
  }
  if (edition) {
    query.edition = edition;
  }
  if (country) {
    query.country = country;
  }
  if (category) {
    query.category = category;
  }
  const result = await getTeamsController(undefined, query);
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};
const getTeamsHandlerWN: any = async (req: Request, res: Response) => {
  const result = await getTeamsController();
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};

const createTeamHandler: any = async (req: AuthRequest, res: Response) => {
  const { username } = req.params;

  const { name, edition, country, founded, category } = req.body;

  const team: teamType = {
    name,
    edition,
    country,
    founded,
    category,
  };
  const date = new Date(team.founded);
  team.founded = date;
  if (req.user?.username == username) {
    const result = await makeTeamController(team, username, req.file);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const deleteTeamHandler: any = async (req: AuthRequest, res: Response) => {
  const { id, username } = req.params;
  if (req.user?.rol == "Admin" || req.user?.team.includes(id as string)) {
    const result = await deleteTeamController(id as string, username as string);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const updateTeamHandler: any = async (req: AuthRequest, res: Response) => {
  const { name, edition, country, founded, category } = req.body;
  const team: teamType = {
    name,
    edition,
    country,
    founded,
    category,
  };
  const { ide, username } = req.params;
  if (req.user?.team.includes(ide as string) || req.user?.rol == "Admin") {
    const result = await updateTeamController(
      ide as string,
      team,
      username as string,
      req.file,
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

// team id
const addCoachHandler: any = async (req: AuthRequest, res: Response) => {
  const { id, name } = req.body;
  const coach: coachInfo = { id, name };
  const { ide } = req.params;
  if (req.user?.team.includes(ide as string) || req.user?.rol == "Admin") {
    const result = await addCoachController(ide as string, coach, req.file);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const deleteCoachHandler: any = async (req: AuthRequest, res: Response) => {
  const { id, idCoach } = req.params;
  if (req.user?.team.includes(id as string) || req.user?.rol == "Admin") {
    const result = await deleteCoachController(id as string, idCoach as string);
    let statusCode;
    if ("success" in result!) {
      statusCode = 200;
    } else {
      statusCode = 500;
    }

    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const updateCoachHandler: any = async (req: AuthRequest, res: Response) => {
  const { id, name } = req.body;
  const coach: coachInfo = { id, name };
  const { ide, idCoach } = req.params;
  if (req.user?.team.includes(ide as string) || req.user?.rol == "Admin") {
    const result = await updateCoachController(
      ide as string,
      coach,
      idCoach as string,
      req.file,
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};


teamRouter.get("/API/team/:id", getTeamsHandlerID);
teamRouter.get("/API/teams/query", getTeamsHandlerQuery);
teamRouter.get("/API/teams", getTeamsHandlerWN);
teamRouter.post(
  "/API/team/create/:username",
  authMiddleware,
  uploadImage.single("flag"),
  createTeamHandler,
);
teamRouter.delete(
  "/API/team/delete/:id/:username",
  authMiddleware,
  deleteTeamHandler,
);
teamRouter.patch(
  "/API/team/update/:ide/:username",
  authMiddleware,
  uploadImage.single("flag"),
  updateTeamHandler,
);

teamRouter.patch(
  "/API/team/addCoach/:ide",
  authMiddleware,
  uploadImage.single("image"),
  addCoachHandler,
);

teamRouter.patch(
  "/API/team/deleteCoach/:id/:idCoach",
  authMiddleware,
  deleteCoachHandler,
);

teamRouter.patch(
  "/API/team/updateCoach/:ide/:idCoach",
  authMiddleware,
  uploadImage.single("image"),
  updateCoachHandler,
);

export default teamRouter;
