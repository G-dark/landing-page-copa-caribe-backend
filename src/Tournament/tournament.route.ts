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
import { randomChoice } from "../Utils/utils.js";
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
  const { name, edition, city, category, date } = req.query;
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
  if (date) {
    const newDate = new Date(String(date));
    query.date = newDate;
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
    AutomatedSorteo,
    boardGroups,
    isParent,
    parent,
    department,
  } = req.body;

  if (req.user?.rol == "Admin") {
    const startD = new Date(startDate);
    const endD = new Date(endDate);

    console.log(teamsPerGroup);

    let Groups;
    // sorteo automatico
    if (AutomatedSorteo && !isParent) {
      // making the groups
      let teamsIds = [...teams];
      console.log(teamsIds);
      Groups = Array.from({ length: numberGroups }, () => [] as any[]);

      for (let i = 0; i < numberGroups; ++i) {
        for (let j = 0; j < teamsPerGroup; ++j) {
          Groups[i].push(randomChoice(teamsIds));
          teamsIds = teamsIds.flat();
        }
      }
    }
    // manual
    if (!AutomatedSorteo) {
      console.log(boardGroups);
      Groups = boardGroups;
    }

    console.log("grupos", Groups);

    // parse the groups to teamIngroups
    let GroupInTeamInGroup;
    if (!isParent) {
      GroupInTeamInGroup = Array.from(
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
    }

    let tournament: tournamentType;
    if (isParent) {
      tournament = {
        name,
        parent,
        isParent,
        children: [],
        category: "Padre",
        edition,
        city,
        matches: [],
        startDate: startD,
        endDate: endD,
        boardGroups: [],
        numberTeamsPerGroup: 0,
        numberGroups: 0,
        numberPlayers: 0,
        teams: [],
        matchDuration: 0,
        department,
        goalscorers: [],
        assisters: [],
        playerWithMostYellowCards: [],
        playersInTournament: [],
      };
    } else {
      tournament = {
        name,
        parent,
        isParent,
        children: [],
        category,
        edition,
        city,
        matches: [],
        startDate: startD,
        endDate: endD,
        boardGroups: GroupInTeamInGroup!,
        numberTeamsPerGroup: teamsPerGroup,
        numberGroups,
        numberPlayers,
        teams,
        matchDuration: matchLong,
        department,
        goalscorers: [],
        assisters: [],
        playerWithMostYellowCards: [],
        playersInTournament: [],
      };
    }
    let updateParent;
    const tournamentWID = await createTournamentController(tournament);
    if (!isParent) {
      // get the tournament with ID
      const tournamentParsed = tournamentWID as any as tournamentType;
      if (parent) {
        const tournamentParent = await getTournamentsController(parent);
        const tournamentParentParsed =
          tournamentParent as any[] as tournamentType[];
        tournamentParentParsed[0].children.push(tournamentParsed.id!);
        updateParent = await updateTournamentController(
          tournamentParentParsed[0].id!,
          tournamentParentParsed[0],
        );
      }
      // rules for the matches
      const rules: rules = {
        players: numberPlayers,
        minutesPerTime: matchLong,
      };

      let nextRoundGroups = "";
      if (numberGroups * teamsPerGroup == 8) {
        nextRoundGroups = "Repechaje | semifinal";
      } else if (numberGroups * teamsPerGroup > 8) {
      }
      // program all the matches
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
              faultsA: 0,
              faultsB: 0,
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
          faultsA: 0,
          faultsB: 0,
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
          faultsA: 0,
          faultsB: 0,
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
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
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
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
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
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
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

      if (updateMatches.success && updateParent?.success) {
        return res.json({ success: "tournament done" });
      } else {
        return res.status(500).json({ error: "Error creating the tournament" });
      }
    } else {
      if (tournamentWID.error == undefined) {
        return res.json({ success: "tournament done" });
      } else {
        return res.json({ error: "Failed to create the tournament" });
      }
    }
  }
};
const deleteTournamentHandler = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.rol == "Admin") {
    const tournament = await getTournamentsController(id as string);
    const tournamentParsed = tournament as any[] as tournamentType[];

    if (tournamentParsed[0].isParent) {
      for (let child of tournamentParsed[0].children) {
        await deleteTournamentController(child);
      }
    } else if (tournamentParsed[0].parent) {
      const tournamentParent = await getTournamentsController(
        tournamentParsed[0].parent,
      );
      const tournamentParentParsed =
        tournamentParent as any[] as tournamentType[];
      const newChildren = tournamentParentParsed[0].children.filter((child) => {
        return child !== tournamentParsed[0].id;
      });
      tournamentParentParsed[0].children = newChildren;

      const updateParent = await updateTournamentController(
        tournamentParentParsed[0].id!,
        tournamentParentParsed[0],
      );
    }
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
const inscribeTeamHandler = async (req: AuthRequest, res: Response) => {
  const { tournament } = req.params;
  const { team, players } = req.body;
  if (req.user?.team.includes(team) || req.user?.rol == "Admin") {
    const tournamentR = await getTournamentsController(tournament as string);
    const tournamentParsed = tournamentR as any[] as tournamentType[];
    if (tournamentParsed[0].teams.includes(team)) {
      const index = tournamentParsed[0].playersInTournament.findIndex(
        (players) => players.team == team,
      );
      const today = new Date();
      if (today < tournamentParsed[0].startDate) {
        if (players.length <= 20) {
          if (index !== -1 && index !== undefined) {
            tournamentParsed[0].playersInTournament[index].players = players;
            tournamentParsed[0].playersInTournament[index].numberPlayers =
              players.length;
            const result = await updateTournamentController(
              tournamentParsed[0].id!,
              tournamentParsed[0],
            );
            return result.success
              ? res.json({ success: "The inscription has been changed" })
              : res.json({ error: "The inscription hasn't been changed" });
          } else {
            tournamentParsed[0].playersInTournament.push({
              team,
              numberPlayers: players.length,
              players,
            });
            const result = await updateTournamentController(
              tournamentParsed[0].id!,
              tournamentParsed[0],
            );
            return result.success
              ? res.json({ success: "The inscription has been done" })
              : res.json({ error: "The inscription hasn't been done" });
          }
        } else {
          return res
            .status(406)
            .json({ error: "The limit for amount of players is 20" });
        }
      } else {
        return res
          .status(406)
          .json({ error: "The tournament already started" });
      }
    } else {
      return res.status(406).json({ error: "This team is not pre-registered" });
    }
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
tournamentRouter.patch(
  "/API/tournament/inscribeTeam/:tournament",
  authMiddleware,
  inscribeTeamHandler,
);
