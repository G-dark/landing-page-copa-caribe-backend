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

const readMatchHandlerByIDHandler: any = async (
  req: Request,
  res: Response,
) => {
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

const readMatchByQueryHandler: any = async (req: Request, res: Response) => {
  const { teamA, teamB } = req.query;
  let query: any = {};
  if (teamA) {
    query.teamA = teamA;
  }
  if (teamB) {
    query.teamB = teamB;
  }

  const result = await readMatchController(undefined, query);
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

const skipTypes = [
  "Final",
  "Start",
  "Anulation",
  "Positions",
  "RestTime",
  "Start2",
  "Penales"
]; // constant for skip the team depending on type

const updateMatchHandler: any = async (req: AuthRequest, res: Response) => {
  const { match } = req.body;
  const { id } = req.params;
  const matchR = await readMatchController(id as string);
  const matchRParsed = matchR as any[] as matchType[];

  if (
    req.user?.rol == "Admin" ||
    req.user?.team.includes(matchRParsed[0].teamA) ||
    req.user?.team.includes(matchRParsed[0].teamB)
  ) {
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
      let lastEvent: any, playersRelated, penultime: any;
      let action: "Delete" | "Update";

      //Anulate in case of anulation
      if (event.tipo == "Anulation") {
        action = "Delete";
        lastEvent = matchReal.eventos[matchReal.eventos.length - 2];
        if (lastEvent.tipo == "Goal"){
          // assist is the penultimate event when a gol is anulled
          penultime = matchReal.eventos[matchReal.eventos.length - 3];
        }
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
        console.log("playersRelated", playersRelated, typo, action);
        for (let player of playersRelated) {
          const change = await ChangeStatsBOEventController(
            id as string,
            typo,
            action,
            event.minute,
            player,
          );
        }
        if(event.tipo == "Anulation" && lastEvent.tipo == "Goal" && penultime.tipo == "Assist"){
          for (let player of penultime.playersRelated) {
            const change = await ChangeStatsBOEventController(
              id as string,
              "Assist" + penultime.team,
              "Delete",
              penultime.minute,
              player,
            );
          }
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
        typo.includes("Corner") ||
        typo.includes("Fault") ||
        typo.includes("Comment") ||
        typo.includes("Positions") ||
        typo.includes("RestTime") ||
        typo.includes("Penales") ||
        typo.includes("Start2") && playersRelated.length == 0
      ) {
        const change = await ChangeStatsBOEventController(
          id as string,
          typo,
          action,
          event.minute,
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
      if (evento.playersRelated.length > 0) {
        for (let player of evento.playersRelated) {
          const change = await ChangeStatsBOEventController(
            id as string,
            typo,
            "Delete",
            "1",
            player,
          );
        }
      } else {
        const change = await ChangeStatsBOEventController(
            id as string,
            typo,
            "Delete",
            evento.minute
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
    const { id, penaltyID } = req.params;
    const { penalty } = req.body;
    const result = await editPenaltyController(
      id as string,
      penalty,
      penaltyID as string,
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};
const deletePenaltyHandler: any = async (req: AuthRequest, res: Response) => {
  if (req.user?.rol == "Admin") {
    const { id, penaltyID } = req.params;
    const result = await deletePenaltyController(
      id as string,
      penaltyID as string,
    );
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } else {
    return res.status(403).json({ error: "Not permissions" });
  }
};

matchRouter.get("/API/match/:id", readMatchHandlerByIDHandler);
matchRouter.get("/API/match", readMatchHandler);
matchRouter.post("/API/match/create", authMiddleware, createMatchHandler);
matchRouter.delete("/API/match/delete/:id", authMiddleware, deleteMatchHandler);
matchRouter.patch("/API/match/update/:id", authMiddleware, updateMatchHandler);
matchRouter.patch(
  "/API/match/addEvent/:id",
  authMiddleware,
  express.json(),
  addEventHandler,
);
matchRouter.patch(
  "/API/match/editEvent/:id/:idEvent",
  authMiddleware,
  express.json(),
  editEventHandler,
);
matchRouter.patch(
  "/API/match/deleteEvent/:id/:idEvent",
  authMiddleware,
  deleteEventHandler,
);

matchRouter.patch(
  "/API/match/addReferee/:id",
  authMiddleware,
  addRefereeHandler,
);
matchRouter.patch(
  "/API/match/editReferee/:id/:refereeID",
  authMiddleware,
  editRefereeHandler,
);
matchRouter.patch(
  "/API/match/deleteReferee/:id/:refereeID",
  authMiddleware,
  deleteRefereeHandler,
);
matchRouter.patch(
  "/API/match/addPenalty/:id",
  authMiddleware,
  addPenaltyHandler,
);
matchRouter.patch(
  "/API/match/editPenalty/:id/:penaltyID",
  authMiddleware,
  editPenaltyHandler,
);
matchRouter.patch(
  "/API/match/deletePenalty/:id/:penaltyID",
  authMiddleware,
  deletePenaltyHandler,
);


export default matchRouter;
