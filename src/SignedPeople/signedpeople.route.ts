import { Request, Response, Router } from "express";
import {
  updateSignedController,
  deleteSignedController,
  readSignedController,
  makeSignedController,
  sendEmailController,
} from "./signedpeople.controller.js";
import { SignedPeopleType } from "./signedpeople.model.js";
import { AuthRequest, authMiddleware } from "../Middlewares/auth.middleware.js";

export const signedRouter = Router();

const getSignedHandlerID: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id } = req.params;
    const result = await readSignedController(id as string, undefined);
    const statusCode = typeof result == "string" ? 500 : 200;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const getSignedHandlerQuery: any = async (req: AuthRequest, res: Response) => {
  const { name, date, email, teamName, multiplesCat, OneCat, fase } = req.query;

  if (req.user?.rol == "Admin") {
    let query: any = {};
    if (name) {
      query.name = name;
    }
    if (date) {
      query.date = date;
    }
    if (email) {
      query.email = email;
    }
    if (teamName) {
      query.teamName = teamName;
    }
    if (multiplesCat !== undefined) {
      query.multiplesCat = multiplesCat;
    }
    if (OneCat !== undefined) {
      query.oneCat = OneCat;
    }
    if (fase) {
      query.fase = fase;
    }

    const result = await readSignedController(undefined, query);
    const statusCode = typeof result == "string" ? 500 : 200;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const getSignedHandlerWN: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const result = await readSignedController();
    const statusCode = typeof result == "string" ? 500 : 200;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const createSignedHandler: any = async (req: Request, res: Response) => {
  const { id, name, tel, email, teamName, lastName, oneCat, multiplesCat, cargo } =
    req.body;
  const newdate = new Date(Date.now());

  const signed: SignedPeopleType = {
    id,
    name,
    lastName,
    tel,
    email,
    teamName,
    multiplesCat,
    oneCat,
    date: newdate,
    cargo
  };

  const result = await makeSignedController(signed);
  const statusCode = result.success ? 200 : 500;
  return res.status(statusCode).json(result);
};

const deleteSignedHandler: any = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (req.user?.rol == "Admin") {
    const result = await deleteSignedController(id as string);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const updateSignedHandler: any = async (req: AuthRequest, res: Response) => {

  const {
    id,
    name,
    tel,
    email,
    teamName,
    lastName,
    oneCat,
    multiplesCat,
    date,
    fase,
    cargo
  } = req.body;

  const signed: SignedPeopleType = {
    id,
    name,
    lastName,
    tel,
    email,
    teamName,
    multiplesCat,
    oneCat,
    date,
    fase,
    cargo
  };
  const { ide } = req.params;
  if (req.user?.rol == "Admin") {

    const result = await updateSignedController(ide as string, signed);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const SendEmailHandler: any = async (req: Request, res: Response) => {
  const { email, tipo, name } = req.params;
  return sendEmailController(email as string, tipo as string, name as string);
};


signedRouter.get("/API/signed", authMiddleware, getSignedHandlerWN);
signedRouter.get("/API/signedSendEmail/:name/:tipo/:email", SendEmailHandler);
signedRouter.get("/API/signed/:id", authMiddleware, getSignedHandlerID);
signedRouter.get("/API/signedQuery", authMiddleware, getSignedHandlerQuery);
signedRouter.post("/API/signed/Create", createSignedHandler);
signedRouter.delete("/API/signed/delete", authMiddleware, deleteSignedHandler);
signedRouter.patch("/API/signed/update/:ide", authMiddleware, updateSignedHandler);
