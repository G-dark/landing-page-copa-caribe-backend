import { Request, Response, Router } from "express";
import {
  createTournamentController,
  getTournamentsController,
  updateTournamentController,
  deleteTournamentController,
} from "./tournament.controller.js";
import { AuthRequest, authMiddleware } from "../Middlewares/auth.middleware.js";
import { teamInGroup, tournamentType } from "./tournament.model.js";
import { getTeamsController } from "../Team/team.controller.js";
import { teamType } from "../Team/team.model.js";
import { combinatoria, randomChoice } from "../Utils/utils.js";
import { makeMatchController } from "../Match/match.controller.js";
import { matchType, rules } from "../Match/match.model.js";
export const tournamentRouter = Router();

const getTournamentByIDHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getTournamentsController(id as string);
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};
const getTournamentByQueryHandler = async (req: Request, res: Response) => {
  const { name, edition, city, category } = req.query;
  let query: any = {};
  if (name) {
    query.name = name;
  }
  if (edition) {
    query.edition = edition;
  }
  if (city) {
    query.country = city;
  }
  if (category) {
    query.category = category;
  }
  const result = await getTournamentsController(undefined, query);
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};

const getTournamentsHandler = async (req: Request, res: Response) => {
  const result = await getTournamentsController();
  const statusCode = typeof result == "string" ? 500 : 200;
  return res.status(statusCode).json(result);
};
const createTournamentHandler = async (req: AuthRequest, res: Response) => {
  const {
    name,
    category,
    edition,
    city,
    startDate,
    endDate,
    teams,
    teamsPerGroup,
    numberGroups,
    numberPlayers,
    matchLong,
  } = req.body;
  if (req.user?.rol == "Admin") {
    const startD = new Date(startDate);
    const endD = new Date(endDate);

    console.log(teamsPerGroup);

    // making the groups
    let teamsIds = teams;
    console.log(teamsIds);

    let Groups = Array.from({ length: numberGroups }, () => [] as any[]);

    for (let i = 0; i < numberGroups; ++i) {
      for (let j = 0; j < teamsPerGroup; ++j) {
        Groups[i].push(randomChoice(teamsIds));
        teamsIds = teamsIds.flat();
      }
    }
    console.log(Groups);

    // parse the groups to teamIngroups

    let GroupInTeamInGroup = Array.from(
      { length: numberGroups },
      () => [] as teamInGroup[],
    );
    let i = 0;
    for (let ids of Groups) {
      for (let id of ids) {
        const teamInG: teamInGroup = {
          team: id!,
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          gamesDraw: 0,
          points: 0,
          goalsP: 0,
          goalsC: 0,
          goalDifference: 0,
          yellowCards: 0,
          redCards: 0,
        };
        GroupInTeamInGroup[i].push(teamInG);
      }
      ++i;
    }
    console.log(GroupInTeamInGroup);
    const tournament: tournamentType = {
      name,
      category,
      edition,
      city,
      matches: [],
      startDate: startD,
      endDate: endD,
      boardGroups: GroupInTeamInGroup,
      numberTeamsPerGroup: teamsPerGroup,
      numberGroups,
    };
    // get the tournament with ID
    const tournamentWID = await createTournamentController(tournament);
    const tournamentParsed = tournamentWID as any as tournamentType;

    // rules for the matches
    const rules: rules = {
      players: numberPlayers,
      minutesPerTime: matchLong,
    };

    let nextRoundGroups= "";
    if(numberGroups * teamsPerGroup == 8){
      nextRoundGroups = "Repechaje | semifinal"
    } else if(numberGroups * teamsPerGroup > 8){

    }
    let k = 1;
      for (let ids of Groups) {
        for (let i = 0; i < ids.length - 1; ++i) {
          for (let j = i + 1; j < ids.length; ++j) {
            const matchGroup: matchType = {
              teamA: ids[i],
              teamB: ids[j],
              date: startD,
              scorersA: [],
              scorersB: [],
              assistersA: [],
              assistersB: [],
              yellowPlayersA: [],
              redPlayersA: [],
              yellowPlayersB: [],
              redPlayersB: [],
              yellowCards: 0,
              redCards: 0,
              eventos: [],
              referee: [],
              rules,
              tournament: tournamentParsed.id!,
              edition,
              phase: "Grupos",
              order: String(k),
              cornersA: 0,
              cornersB: 0,
              nextRound: nextRoundGroups,
            };
            const group = await makeMatchController(matchGroup);
            console.log(group);
            const groupWT = group as any as matchType;
            tournamentParsed.matches.push(groupWT.id!);
          }
        }
        k++;
      }
    // first phase of matches: groups
    if (numberGroups * teamsPerGroup == 8) {

      //matches for the fifth place repechaje
      const match1: matchType = {
        teamA: "3A",
        teamB: "3B",
        date: endD,
        scorersA: [],
        scorersB: [],
        assistersA: [],
        assistersB: [],
        yellowPlayersA: [],
        redPlayersA: [],
        yellowPlayersB: [],
        redPlayersB: [],
        yellowCards: 0,
        redCards: 0,
        eventos: [],
        referee: [],
        rules,
        tournament: tournamentParsed.id!,
        edition,
        phase: "Repechaje",
        order: "1",
        nextRound: "Nothing",
        cornersA: 0,
        cornersB: 0,
      };
      const fifthP1 = await makeMatchController(match1);
      const fifthP1WT = fifthP1 as any as matchType;
      tournamentParsed.matches.push(fifthP1WT.id!);

      const match2: matchType = {
        teamA: "4A",
        teamB: "4B",
        date: endD,
        scorersA: [],
        scorersB: [],
        assistersA: [],
        assistersB: [],
        yellowPlayersA: [],
        redPlayersA: [],
        yellowPlayersB: [],
        redPlayersB: [],
        yellowCards: 0,
        redCards: 0,
        eventos: [],
        referee: [],
        rules,
        tournament: tournamentParsed.id!,
        edition,
        phase: "Repechaje",
        order: "1",
        nextRound: "Nothing",
        cornersA: 0,
        cornersB: 0,
      };
      const fifthP2 = await makeMatchController(match2);
      const fifthP2WT = fifthP2 as any as matchType;
      tournamentParsed.matches.push(fifthP2WT.id!);

      //semi-final matches

      const match3: matchType = {
        teamA: "1A",
        teamB: "2B",
        date: endD,
        scorersA: [],
        scorersB: [],
        assistersA: [],
        assistersB: [],
        yellowPlayersA: [],
        redPlayersA: [],
        yellowPlayersB: [],
        redPlayersB: [],
        yellowCards: 0,
        redCards: 0,
        eventos: [],
        referee: [],
        rules,
        tournament: tournamentParsed.id!,
        edition,
        phase: "Semifinal",
        order: "1",
        nextRound: "Final",
        cornersA:0,
        cornersB: 0,
      };
      const semifinal1 = await makeMatchController(match3);
      const semifinal1WT = semifinal1 as any as matchType;
      tournamentParsed.matches.push(semifinal1WT.id!);

      const match4: matchType = {
        teamA: "2A",
        teamB: "1B",
        date: endD,
        scorersA: [],
        scorersB: [],
        assistersA: [],
        assistersB: [],
        yellowPlayersA: [],
        redPlayersA: [],
        yellowPlayersB: [],
        redPlayersB: [],
        yellowCards: 0,
        redCards: 0,
        eventos: [],
        referee: [],
        rules,
        tournament: tournamentParsed.id!,
        edition,
        phase: "Semifinal",
        order: "1",
        nextRound: "Final",
        cornersA:0,
        cornersB: 0,
      };
      const semifinal2 = await makeMatchController(match4);
      const semifinal2WT = semifinal2 as any as matchType;
      tournamentParsed.matches.push(semifinal2WT.id!);
      //final match
      const match5: matchType = {
        teamA: "SF1",
        teamB: "SF2",
        date: endD,
        scorersA: [],
        scorersB: [],
        assistersA: [],
        assistersB: [],
        yellowPlayersA: [],
        redPlayersA: [],
        yellowPlayersB: [],
        redPlayersB: [],
        yellowCards: 0,
        redCards: 0,
        eventos: [],
        referee: [],
        rules,
        tournament: tournamentParsed.id!,
        edition,
        phase: "Final",
        order: "1",
        nextRound: "Nothing",
        cornersA:0,
        cornersB: 0,
      };
      const final = await makeMatchController(match5);
      const finalWT = final as any as matchType;
      tournamentParsed.matches.push(finalWT.id!);
    } else if (teamsPerGroup * numberGroups > 8) {
    }

    const updateMatches = await updateTournamentController(
      tournamentParsed.id!,
      tournamentParsed,
    );

    if (updateMatches.success) {
      return res.json({ success: "tournament done" });
    } else {
      return res.status(500).json({ error: "Error creating the tournament" });
    }
  }
};
const deleteTournamentHandler = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (req.user?.rol == "Admin") {
    const result = await deleteTournamentController(id as string);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  }
};
const updateTournamentHandler = async (req: AuthRequest, res: Response) => {
  const { tournament } = req.body;
  const { id } = req.params;
  if (req.user?.rol == "Admin") {
    const result = await updateTournamentController(id as string, tournament);
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  }
};
tournamentRouter.get("/API/tournament/:id", getTournamentByIDHandler);
tournamentRouter.get("/API/tournamentQuery", getTournamentByQueryHandler);
tournamentRouter.get("/API/tournaments", getTournamentsHandler);

tournamentRouter.post(
  "/API/tournament/create",
  authMiddleware,
  createTournamentHandler,
);

tournamentRouter.delete(
  "/API/tournament/delete/:id",
  authMiddleware,
  deleteTournamentHandler,
);

tournamentRouter.patch(
  "/API/tournament/update/:id",
  authMiddleware,
  updateTournamentHandler,
);
