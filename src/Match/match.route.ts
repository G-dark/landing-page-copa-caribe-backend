import express, { Request, Response, Router } from "express";
import {
  readMatchController,
  makeMatchController,
  updateMatchController,
  deleteMatchController,
  addEventController,
  editEventController,
  deleteEventController,
  ChangeStatsBOEventController,
  addRefereeController,
  editRefereeController,
  deleteRefereeController,
  addPenaltyController,
  editPenaltyController,
  deletePenaltyController,
} from "./match.controller.js";
import { authMiddleware, AuthRequest } from "../Middlewares/auth.middleware.js";
import { transform2Match } from "./read.match.action.js";
import { evento, matchType } from "./match.model.js";

const matchRouter = Router();

const readMatchHandlerByID: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await readMatchController(id as string);
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};

const readMatchHandler: any = async (req: Request, res: Response) => {
  const result = await readMatchController();
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};

const createMatchHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { match } = req.body;
    const date = new Date(match.date);
    match.date = date;
    const result = await makeMatchController(match);
    const statusCode = typeof result == "string" ? 500 : 200;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const skipTypes = ["Final", "Start", "Anulation"]; // constant for skip the team depending on type

const updateMatchHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { match } = req.body;
    const { id } = req.params;
    const result = await updateMatchController(id as string, match);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const addEventHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { event } = req.body;
    const { id } = req.params;

    // creates the event
    const result = await addEventController(id as string, event);
    let typo;
    // adapts for the action
    if (event.tipo !== "Comment") {
      let tipo;
      if (event.tipo == "Penalty Goal") {
        tipo = "Goal";
      } else {
        tipo = event.tipo;
      }
      const complement = skipTypes.some((st) => {
        return st == event.tipo;
      })
        ? ""
        : event.team;
      typo = tipo + complement;
      // get the match which we're creating an event
      const match = await readMatchController(id as string);
      const matchReal = transform2Match((match as matchType[])[0]);
      let lastEvent: any, playersRelated;
      let action: "Delete" | "Update";

      //Anulate in case of anulation
      if (event.tipo == "Anulation") {
        action = "Delete";
        lastEvent = matchReal.eventos[matchReal.eventos.length - 2];
        const complement2 = skipTypes.some((st) => {
          return st == lastEvent.tipo;
        })
          ? ""
          : lastEvent.team;
        typo = lastEvent.tipo + complement2;
        playersRelated = lastEvent.playersRelated;
      } else {
        playersRelated = event.playersRelated;
        action = "Update";
      }
      if (!typo.includes("Substitution")) {
        for (let player of playersRelated) {
          const change = await ChangeStatsBOEventController(
            id as string,
            typo,
            action,
            event.minute,
            player,
          );
        }
      } else {
        for (let i = 0; i < playersRelated.length; i += 2) {
          const change = await ChangeStatsBOEventController(
            id as string,
            typo,
            action,
            event.minute,
            playersRelated[i],
            playersRelated[i + 1],
          );
        }
      }

      if (
        (typo.includes("Corner")) && playersRelated.length == 0
      ) {

        const change = await ChangeStatsBOEventController(
            id as string,
            typo,
            action,
            event.minute
          );
      }
    }
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
// not let edit the tipo only the description and minute
const editEventHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { event } = req.body;
    const { id, idEvent } = req.params;
    const result = await editEventController(
      id as string,
      event,
      idEvent as string,
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const deleteEventHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id, idEvent } = req.params;
    const match = await readMatchController(id as string);
    const matchR = transform2Match((match as matchType[])[0]);
    const evento = matchR.eventos.find((evento: evento) => {
      return evento.id == idEvent;
    });
    // Delete the entry in the events array
    const result = await deleteEventController(id as string, idEvent as string);

    // reverse the changes in the match related stats
    if (evento && evento.tipo !== "Comment") {
      const complement = skipTypes.some((st) => {
        return st == evento.tipo;
      })
        ? ""
        : evento.team;
      const typo = evento.tipo + complement;
      for (let player of evento.playersRelated) {
        const change = await ChangeStatsBOEventController(
          id as string,
          typo,
          "Delete",
          "1",
          player,
        );
      }
    }

    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const deleteMatchHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id } = req.params;
    const result = await deleteMatchController(id as string);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

const addRefereeHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { referee } = req.body;
    const { id } = req.params;
    const result = await addRefereeController(id as string, referee);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const editRefereeHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { referee } = req.body;
    const { id, refereeID } = req.params;
    const result = await editRefereeController(
      id as string,
      referee,
      refereeID as string,
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const deleteRefereeHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id, refereeID } = req.params;
    const result = await deleteRefereeController(
      id as string,
      refereeID as string,
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const addPenaltyHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id } = req.params;
    const { penalty } = req.body;
    const result = await addPenaltyController(id as string, penalty);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const editPenaltyHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id, penaltyIndex } = req.params;
    const { penalty } = req.body;
    const result = await editPenaltyController(
      id as string,
      penalty,
      Number(penaltyIndex),
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const deletePenaltyHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id, penaltyIndex } = req.params;
    const result = await deletePenaltyController(
      id as string,
      Number(penaltyIndex),
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

matchRouter.get("/API/match/:id", readMatchHandlerByID);
matchRouter.get("/API/match", readMatchHandler);
matchRouter.post("/API/match/create", authMiddleware, createMatchHandler);
matchRouter.delete("/API/match/delete/:id", authMiddleware, deleteMatchHandler);
matchRouter.patch("/API/match/update/:id", authMiddleware, updateMatchHandler);
matchRouter.patch(
  "/API/match/update/addEvent/:id",
  authMiddleware,
  express.json(),
  addEventHandler,
);
matchRouter.patch(
  "/API/match/update/editEvent/:id/:idEvent",
  authMiddleware,
  express.json(),
  editEventHandler,
);
matchRouter.patch(
  "/API/match/update/deleteEvent/:id/:idEvent",
  authMiddleware,
  deleteEventHandler,
);

matchRouter.patch(
  "/API/match/update/addReferee/:id",
  authMiddleware,
  addRefereeHandler,
);
matchRouter.patch(
  "/API/match/update/editReferee/:id/:refereeID",
  authMiddleware,
  editRefereeHandler,
);
matchRouter.patch(
  "/API/match/update/deleteReferee/:id/:refereeID",
  authMiddleware,
  deleteRefereeHandler,
);

export default matchRouter;
