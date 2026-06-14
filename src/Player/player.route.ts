import express, { Router, Request, Response } from "express";
import {
  getPlayersController,
  makePlayerController,
  deletePlayerController,
  updatePlayerController,
  getPlayersControllerWOId,
} from "./player.controller.js";

import { authMiddleware, AuthRequest } from "../Middlewares/auth.middleware.js";
import { PlayerType } from "./player.model.js";
import { uploadImage } from "../Middlewares/storage.middleware.js";
import { getTeamsController, updateTeamController } from "../Team/team.controller.js";
import { teamType } from "../Team/team.model.js";

const playerRouter = Router();

const getPlayersHandlerAuth: any = async (
  request: AuthRequest,
  response: Response,
) => {
  const { id } = request.params;
  const { position, editionPlayed, name, dorsal, teamName } = request.query;
  const query: any = {};
  if (position) {
    query.position = position;
  }
  if (editionPlayed) {
    query.editionPlayed = editionPlayed;
  }
  if (name) {
    query.name = name;
  }
  if (dorsal) {
    query.dorsal = dorsal;
  }
  if (teamName) {
    query.teamName = teamName;
  }
  const result = await getPlayersController(id as string, query);
  const statusCode = typeof result == "string" ? 500 : 200;
  return response.status(statusCode).json(result);
};

const getPlayersHandler: any = async (request: Request, response: Response) => {
  const { position, editionPlayed, name, dorsal, team, goals, assists } = request.query;
  const query: any = {};
  if (position) {
    query.position = position;
  }
  if (editionPlayed) {
    query.editionPlayed = editionPlayed;
  }
  if (name) {
    query.name = name;
  }
  if (dorsal) {
    query.dorsal = dorsal;
  }
  if (team) {
    query.team = team;
  }
  if (goals) {
    query.goals = goals;
  }
  if (assists) {
    query.assists = assists;
  }
  console.log(team, dorsal)
  const result = await getPlayersControllerWOId(query);
  const statusCode = typeof result == "string" ? 500 : 200;
  return response.status(statusCode).json(result);
};

const getPlayersHandlerWN: any = async (
  request: Request,
  response: Response,
) => {
  const result = await getPlayersControllerWOId();
  const statusCode = typeof result == "string" ? 500 : 200;
  return response.status(statusCode).json(result);
};

const createPlayerHandler: any = async (
  request: AuthRequest,
  response: Response,
) => {
  const {
    id,
    dorsal,
    name,
    position,
    team,
    teamName,
    nation,
    editionPlayed,
    age,
    birthYear,
    talla
  } = request.body;
  const player: PlayerType = {
    id,
    name,
    dorsal: Number(dorsal),
    nation,
    position,
    team,
    teamName,
    editionPlayed,
    age: Number(age),
    birthYear: new Date(birthYear),
    image: null,
    image_id: null,
    goals: 0,
    assists: 0,
    gamesPlayed: 0,
    subInGames: 0,
    starterGames: 0,
    minutesPlayed: 0,
    yellowCards: 0,
    redCards: 0,
    talla,
    editedAt:null,
    editedBy: null,
  };
  if (
    request.user?.rol == "Admin" ||
    request.user?.team.includes(player.team)
  ) {
    const team = await getTeamsController(player.team);
    const teamParsed = team as any[] as teamType[];
    if(teamParsed.length > 0){
      teamParsed[0].editedAt = new Date(Date.now());
      teamParsed[0].editedBy = request.user!.username;
      await updateTeamController(player.team, teamParsed[0] as teamType);
    }
    const result = await makePlayerController(player, request.user?.username, request.file);
    const statusCode = result.success ? 200 : 500;
    return response.status(statusCode).json(result);
  } else {
    return response.status(403).json({ error: "No Permissions" });
  }
};

const updatePlayerHandler: any = async (
  request: AuthRequest,
  response: Response,
) => {
  const { ide, edition } = request.params;
  const {
    id,
    dorsal,
    name,
    image,
    nation,
    position,
    team,
    teamName,
    editionPlayed,
    age,
    birthYear,
    gamesPlayed,
    goals,
    assists,
    yellowCards,
    redCards,
    minutesPlayed,
    starterGames,
    subInGames,
    talla
  } = request.body;
  let player: PlayerType = {
    id,
    dorsal,
    name,
    image,
    nation,
    position,
    team,
    teamName,
    editionPlayed,
    age,
    birthYear,
    gamesPlayed,
    goals,
    assists,
    yellowCards,
    redCards,
    minutesPlayed,
    starterGames,
    subInGames,
    talla,
    editedAt: new Date(Date.now()),
    editedBy:request.user!.username

  };
  if (
    request.user?.rol == "Admin" ||
    request.user?.team.includes(player.team)
  ) {
    const result = await updatePlayerController(
      ide as string,
      edition as string,
      player,
      request.file,
    );
    console.log(ide, edition)
    const statusCode = result.success ? 200 : 500;
    return response.status(statusCode).json(result);
  } else {
    return response.status(403).json({ error: "No Permissions" });
  }
};
const deletePlayerHandler: any = async (
  request: AuthRequest,
  response: Response,
) => {

  const { id, editionPlayed } = request.params;
  const player = await getPlayersController(id as string, undefined);

  if (
    (player && request.user?.rol == "Admin") ||
    request.user?.team.includes((player as any).team)
  ) {
    const result = await deletePlayerController(
      id as string,
      editionPlayed as string,
      request.user?.username
    );
    const statusCode = result.success ? 200 : 500;
    return response.status(statusCode).json(result);
  } else {
    return response.status(403).json({ error: "No Permissions" });
  }
};

playerRouter.get("/API/playerWID/:id", authMiddleware, getPlayersHandlerAuth); // authenticated route to get players with id
playerRouter.get("/API/players", getPlayersHandler); // public route to get players without id but with query
playerRouter.get("/API/playersWN", getPlayersHandlerWN); // public route to get players without id and without query
playerRouter.post(
  "/API/player/create",
  authMiddleware,
  uploadImage.single("image"),
  createPlayerHandler,
);
playerRouter.patch(
  "/API/player/update/:ide/:edition",
  authMiddleware,
  uploadImage.single("image"),
  updatePlayerHandler,
);
playerRouter.delete(
  "/API/player/delete/:id/:editionPlayed",
  authMiddleware,
  deletePlayerHandler,
);

export default playerRouter;
