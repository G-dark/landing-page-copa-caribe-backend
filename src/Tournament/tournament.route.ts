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

    let Groups;
    // sorteo automatico
    if (AutomatedSorteo && !isParent) {
      // making the groups
      let teamsIds = [...teams];
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



       let nextRoundGroups = "Repechaje | Knockout";

      // first phase of matches: groups
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
              code: "G",
              nextRound: nextRoundGroups,
            };
            const group = await makeMatchController(matchGroup);
            const groupWT = group as any as matchType;
            tournamentParsed.matches.push(groupWT.id!);
          }
        }
        k++;
      }

      if (numberGroups * teamsPerGroup == 8) {
        //matches for the fifth place repechaje
        const match1: matchType = {
          teamA: "3A",
          teamB: "4A",
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
          code: "R1",
        };
        const fifthP1 = await makeMatchController(match1);
        const fifthP1WT = fifthP1 as any as matchType;
        tournamentParsed.matches.push(fifthP1WT.id!);

        const match2: matchType = {
          teamA: "3B",
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
          code: "R2",
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
          code: "SF1",
        };
        const semifinal1 = await makeMatchController(match3);
        const semifinal1WT = semifinal1 as any as matchType;
        tournamentParsed.matches.push(semifinal1WT.id!);

        const match4: matchType = {
          teamA: "1B",
          teamB: "2A",
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
          code: "SF2",
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
          code: "F",
        };
        const final = await makeMatchController(match5);
        const finalWT = final as any as matchType;
        tournamentParsed.matches.push(finalWT.id!);
      } else if (teamsPerGroup * numberGroups == 12 && teamsPerGroup == 4) {
        //matches for the fifth place repechaje
        const match1: matchType = {
          teamA: "3A",
          teamB: "4A",
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
          code: "R1",
        };
        const fifthP1 = await makeMatchController(match1);
        const fifthP1WT = fifthP1 as any as matchType;
        tournamentParsed.matches.push(fifthP1WT.id!);

        const match2: matchType = {
          teamA: "3B",
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
          code: "R2",
        };
        const fifthP2 = await makeMatchController(match2);
        const fifthP2WT = fifthP2 as any as matchType;
        tournamentParsed.matches.push(fifthP2WT.id!);

        const match3: matchType = {
          teamA: "3C",
          teamB: "4C",
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
          code: "R3",
        };
        const fifthP3 = await makeMatchController(match3);
        const fifthP3WT = fifthP3 as any as matchType;
        tournamentParsed.matches.push(fifthP3WT.id!);

        // Pre-semifinal

        const match4: matchType = {
          teamA: "3",
          teamB: "4",
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
          phase: "Pre-semifinal",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PS1",
        };
        const pre_semifinal1 = await makeMatchController(match4);
        const pre_semifinal1WT = pre_semifinal1 as any as matchType;
        tournamentParsed.matches.push(pre_semifinal1WT.id!);

        const match5: matchType = {
          teamA: "5",
          teamB: "6",
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
          phase: "Pre-semifinal",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PS2",
        };
        const pre_semifinal2 = await makeMatchController(match5);
        const pre_semifinal2WT = pre_semifinal2 as any as matchType;
        tournamentParsed.matches.push(pre_semifinal2WT.id!);

        //semi-final matches

        const match6: matchType = {
          teamA: "1",
          teamB: "PS1",
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
          code: "SF1",
        };
        const semifinal1 = await makeMatchController(match6);
        const semifinal1WT = semifinal1 as any as matchType;
        tournamentParsed.matches.push(semifinal1WT.id!);

        const match7: matchType = {
          teamA: "2",
          teamB: "PS2",
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
          code: "SF2",
        };
        const semifinal2 = await makeMatchController(match7);
        const semifinal2WT = semifinal2 as any as matchType;
        tournamentParsed.matches.push(semifinal2WT.id!);
        //final match
        const match8: matchType = {
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
          code: "F",
        };
        const final = await makeMatchController(match8);
        const finalWT = final as any as matchType;
        tournamentParsed.matches.push(finalWT.id!);
      } else if (teamsPerGroup * numberGroups == 16 && teamsPerGroup == 4) {
        //matches for the fifth place repechaje
        const match1: matchType = {
          teamA: "3A",
          teamB: "4A",
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
          code: "R1",
        };
        const fifthP1 = await makeMatchController(match1);
        const fifthP1WT = fifthP1 as any as matchType;
        tournamentParsed.matches.push(fifthP1WT.id!);

        const match2: matchType = {
          teamA: "3B",
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
          code: "R2",
        };
        const fifthP2 = await makeMatchController(match2);
        const fifthP2WT = fifthP2 as any as matchType;
        tournamentParsed.matches.push(fifthP2WT.id!);

        const match3: matchType = {
          teamA: "3C",
          teamB: "4C",
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
          code: "R3",
        };
        const fifthP3 = await makeMatchController(match3);
        const fifthP3WT = fifthP3 as any as matchType;
        tournamentParsed.matches.push(fifthP3WT.id!);

        const match4: matchType = {
          teamA: "3D",
          teamB: "4D",
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
          code: "R4",
        };
        const fifthP4 = await makeMatchController(match4);
        const fifthP4WT = fifthP4 as any as matchType;
        tournamentParsed.matches.push(fifthP4WT.id!);

        // Cuartos de final

        const match5: matchType = {
          teamA: "1A",
          teamB: "2C",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF1",
        };
        const cuartosfinal1 = await makeMatchController(match5);
        const cuartosfinal1WT = cuartosfinal1 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal1WT.id!);

        const match6: matchType = {
          teamA: "1B",
          teamB: "2D",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF2",
        };
        const cuartosfinal2 = await makeMatchController(match6);
        const cuartosfinal2WT = cuartosfinal2 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal2WT.id!);

        const match7: matchType = {
          teamA: "1D",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF3",
        };
        const cuartosfinal3 = await makeMatchController(match7);
        const cuartosfinal3WT = cuartosfinal3 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal3WT.id!);

        const match8: matchType = {
          teamA: "1C",
          teamB: "2A",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF4",
        };
        const cuartosfinal4 = await makeMatchController(match8);
        const cuartosfinal4WT = cuartosfinal4 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal4WT.id!);

        //semi-final matches

        const match9: matchType = {
          teamA: "CF1",
          teamB: "CF2",
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
          code: "SF1",
        };
        const semifinal1 = await makeMatchController(match9);
        const semifinal1WT = semifinal1 as any as matchType;
        tournamentParsed.matches.push(semifinal1WT.id!);

        const match10: matchType = {
          teamA: "CF3",
          teamB: "CF4",
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
          code: "SF2",
        };
        const semifinal2 = await makeMatchController(match10);
        const semifinal2WT = semifinal2 as any as matchType;
        tournamentParsed.matches.push(semifinal2WT.id!);
        //final match
        const match11: matchType = {
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
          code: "F"
        };
        const final = await makeMatchController(match11);
        const finalWT = final as any as matchType;
        tournamentParsed.matches.push(finalWT.id!);
      } else if(teamsPerGroup*numberGroups == 20 && teamsPerGroup == 4){
        //matches for the fifth place repechaje
        const match1: matchType = {
          teamA: "3A",
          teamB: "4A",
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
          code: "R1",
        };
        const fifthP1 = await makeMatchController(match1);
        const fifthP1WT = fifthP1 as any as matchType;
        tournamentParsed.matches.push(fifthP1WT.id!);

        const match2: matchType = {
          teamA: "3B",
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
          code: "R2",
        };
        const fifthP2 = await makeMatchController(match2);
        const fifthP2WT = fifthP2 as any as matchType;
        tournamentParsed.matches.push(fifthP2WT.id!);

        const match3: matchType = {
          teamA: "3C",
          teamB: "4C",
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
          code: "R3",
        };
        const fifthP3 = await makeMatchController(match3);
        const fifthP3WT = fifthP3 as any as matchType;
        tournamentParsed.matches.push(fifthP3WT.id!);

        const match4: matchType = {
          teamA: "3D",
          teamB: "4D",
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
          code: "R4",
        };
        const fifthP4 = await makeMatchController(match4);
        const fifthP4WT = fifthP4 as any as matchType;
        tournamentParsed.matches.push(fifthP4WT.id!);

        const match5: matchType = {
          teamA: "3E",
          teamB: "4E",
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
          code: "R5",
        };
        const fifthP5 = await makeMatchController(match5);
        const fifthP5WT = fifthP5 as any as matchType;
        tournamentParsed.matches.push(fifthP5WT.id!);


        // pre-cuartos de final
        const match6: matchType = {
          teamA: "7",
          teamB: "8",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC1",
        };
        const pc1 = await makeMatchController(match6);
        const pc1WT = pc1 as any as matchType;
        tournamentParsed.matches.push(pc1WT.id!);

        const match7: matchType = {
          teamA: "9",
          teamB: "10",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC2",
        };
        const pc2 = await makeMatchController(match7);
        const pc2WT = pc2 as any as matchType;
        tournamentParsed.matches.push(pc2WT.id!);

        // Cuartos de final

        const match8: matchType = {
          teamA: "1",
          teamB: "2",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF1",
        };
        const cuartosfinal1 = await makeMatchController(match8);
        const cuartosfinal1WT = cuartosfinal1 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal1WT.id!);

        const match9: matchType = {
          teamA: "3",
          teamB: "4",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF2",
        };
        const cuartosfinal2 = await makeMatchController(match9);
        const cuartosfinal2WT = cuartosfinal2 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal2WT.id!);

        const match10: matchType = {
          teamA: "5",
          teamB: "6",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF3",
        };
        const cuartosfinal3 = await makeMatchController(match10);
        const cuartosfinal3WT = cuartosfinal3 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal3WT.id!);

        const match11: matchType = {
          teamA: "PC1",
          teamB: "PC2",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF4",
        };
        const cuartosfinal4 = await makeMatchController(match11);
        const cuartosfinal4WT = cuartosfinal4 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal4WT.id!);

        //semi-final matches

        const match12: matchType = {
          teamA: "CF1",
          teamB: "CF2",
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
          code: "SF1",
        };
        const semifinal1 = await makeMatchController(match12);
        const semifinal1WT = semifinal1 as any as matchType;
        tournamentParsed.matches.push(semifinal1WT.id!);

        const match13: matchType = {
          teamA: "CF3",
          teamB: "CF4",
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
          code: "SF2",
        };
        const semifinal2 = await makeMatchController(match13);
        const semifinal2WT = semifinal2 as any as matchType;
        tournamentParsed.matches.push(semifinal2WT.id!);
        //final match
        const match14: matchType = {
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
          code: "F"
        };
        const final = await makeMatchController(match14);
        const finalWT = final as any as matchType;
        tournamentParsed.matches.push(finalWT.id!);
      } else if(numberGroups * teamsPerGroup == 24 && teamsPerGroup == 4){
         //matches for the fifth place repechaje
        const match1: matchType = {
          teamA: "3A",
          teamB: "4A",
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
          code: "R1",
        };
        const fifthP1 = await makeMatchController(match1);
        const fifthP1WT = fifthP1 as any as matchType;
        tournamentParsed.matches.push(fifthP1WT.id!);

        const match2: matchType = {
          teamA: "3B",
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
          code: "R2",
        };
        const fifthP2 = await makeMatchController(match2);
        const fifthP2WT = fifthP2 as any as matchType;
        tournamentParsed.matches.push(fifthP2WT.id!);

        const match3: matchType = {
          teamA: "3C",
          teamB: "4C",
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
          code: "R3",
        };
        const fifthP3 = await makeMatchController(match3);
        const fifthP3WT = fifthP3 as any as matchType;
        tournamentParsed.matches.push(fifthP3WT.id!);

        const match4: matchType = {
          teamA: "3D",
          teamB: "4D",
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
          code: "R4",
        };
        const fifthP4 = await makeMatchController(match4);
        const fifthP4WT = fifthP4 as any as matchType;
        tournamentParsed.matches.push(fifthP4WT.id!);

        const match5: matchType = {
          teamA: "3E",
          teamB: "4E",
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
          code: "R5",
        };
        const fifthP5 = await makeMatchController(match5);
        const fifthP5WT = fifthP5 as any as matchType;
        tournamentParsed.matches.push(fifthP5WT.id!);

          const match6: matchType = {
          teamA: "3F",
          teamB: "4F",
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
          code: "R6",
        };
        const fifthP6 = await makeMatchController(match6);
        const fifthP6WT = fifthP6 as any as matchType;
        tournamentParsed.matches.push(fifthP6WT.id!);

        // pre-cuartos de final
         const match7: matchType = {
          teamA: "5",
          teamB: "6",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC1",
        };
        const pc1 = await makeMatchController(match7);
        const pc1WT = pc1 as any as matchType;
        tournamentParsed.matches.push(pc1WT.id!);

        const match8: matchType = {
          teamA: "7",
          teamB: "8",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC2",
        };
        const pc2 = await makeMatchController(match8);
        const pc2WT = pc2 as any as matchType;
        tournamentParsed.matches.push(pc2WT.id!);

        const match9: matchType = {
          teamA: "9",
          teamB: "10",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC3",
        };
        const pc3 = await makeMatchController(match9);
        const pc3WT = pc3 as any as matchType;
        tournamentParsed.matches.push(pc3WT.id!);

        const match10: matchType = {
          teamA: "11",
          teamB: "12",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC4",
        };
        const pc4 = await makeMatchController(match10);
        const pc4WT = pc4 as any as matchType;
        tournamentParsed.matches.push(pc4WT.id!);

        // Cuartos de final

        const match11: matchType = {
          teamA: "1",
          teamB: "2",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF1",
        };
        const cuartosfinal1 = await makeMatchController(match11);
        const cuartosfinal1WT = cuartosfinal1 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal1WT.id!);

        const match12: matchType = {
          teamA: "3",
          teamB: "4",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF2",
        };
        const cuartosfinal2 = await makeMatchController(match12);
        const cuartosfinal2WT = cuartosfinal2 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal2WT.id!);

        const match13: matchType = {
          teamA: "PC1",
          teamB: "PC2",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF3",
        };
        const cuartosfinal3 = await makeMatchController(match13);
        const cuartosfinal3WT = cuartosfinal3 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal3WT.id!);

        const match14: matchType = {
          teamA: "PC3",
          teamB: "PC4",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF4",
        };
        const cuartosfinal4 = await makeMatchController(match14);
        const cuartosfinal4WT = cuartosfinal4 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal4WT.id!);

        //semi-final matches

        const match15: matchType = {
          teamA: "CF1",
          teamB: "CF2",
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
          code: "SF1",
        };
        const semifinal1 = await makeMatchController(match15);
        const semifinal1WT = semifinal1 as any as matchType;
        tournamentParsed.matches.push(semifinal1WT.id!);

        const match16: matchType = {
          teamA: "CF3",
          teamB: "CF4",
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
          code: "SF2",
        };
        const semifinal2 = await makeMatchController(match16);
        const semifinal2WT = semifinal2 as any as matchType;
        tournamentParsed.matches.push(semifinal2WT.id!);
        //final match
        const match17: matchType = {
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
          code: "F"
        };
        const final = await makeMatchController(match17);
        const finalWT = final as any as matchType;
        tournamentParsed.matches.push(finalWT.id!);
      } else if(numberGroups * teamsPerGroup == 28 && teamsPerGroup == 4){
                 //matches for the fifth place repechaje
        const match1: matchType = {
          teamA: "3A",
          teamB: "4A",
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
          code: "R1",
        };
        const fifthP1 = await makeMatchController(match1);
        const fifthP1WT = fifthP1 as any as matchType;
        tournamentParsed.matches.push(fifthP1WT.id!);

        const match2: matchType = {
          teamA: "3B",
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
          code: "R2",
        };
        const fifthP2 = await makeMatchController(match2);
        const fifthP2WT = fifthP2 as any as matchType;
        tournamentParsed.matches.push(fifthP2WT.id!);

        const match3: matchType = {
          teamA: "3C",
          teamB: "4C",
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
          code: "R3",
        };
        const fifthP3 = await makeMatchController(match3);
        const fifthP3WT = fifthP3 as any as matchType;
        tournamentParsed.matches.push(fifthP3WT.id!);

        const match4: matchType = {
          teamA: "3D",
          teamB: "4D",
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
          code: "R4",
        };
        const fifthP4 = await makeMatchController(match4);
        const fifthP4WT = fifthP4 as any as matchType;
        tournamentParsed.matches.push(fifthP4WT.id!);

        const match5: matchType = {
          teamA: "3E",
          teamB: "4E",
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
          code: "R5",
        };
        const fifthP5 = await makeMatchController(match5);
        const fifthP5WT = fifthP5 as any as matchType;
        tournamentParsed.matches.push(fifthP5WT.id!);

          const match6: matchType = {
          teamA: "3F",
          teamB: "4F",
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
          code: "R6",
        };
        const fifthP6 = await makeMatchController(match6);
        const fifthP6WT = fifthP6 as any as matchType;
        tournamentParsed.matches.push(fifthP6WT.id!);

          const match7: matchType = {
          teamA: "3G",
          teamB: "4G",
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
          code: "R7",
        };
        const fifthP7 = await makeMatchController(match7);
        const fifthP7WT = fifthP7 as any as matchType;
        tournamentParsed.matches.push(fifthP7WT.id!);
        // pre-cuartos de final
        const match8: matchType = {
          teamA: "3",
          teamB: "4",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC1",
        };
        const pc1 = await makeMatchController(match8);
        const pc1WT = pc1 as any as matchType;
        tournamentParsed.matches.push(pc1WT.id!);

         const match9: matchType = {
          teamA: "5",
          teamB: "6",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC2",
        };
        const pc2 = await makeMatchController(match9);
        const pc2WT = pc2 as any as matchType;
        tournamentParsed.matches.push(pc2WT.id!);

        const match10: matchType = {
          teamA: "7",
          teamB: "8",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC3",
        };
        const pc3 = await makeMatchController(match10);
        const pc3WT = pc3 as any as matchType;
        tournamentParsed.matches.push(pc3WT.id!);

        const match11: matchType = {
          teamA: "9",
          teamB: "10",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC4",
        };
        const pc4 = await makeMatchController(match11);
        const pc4WT = pc4 as any as matchType;
        tournamentParsed.matches.push(pc4WT.id!);

        const match12: matchType = {
          teamA: "11",
          teamB: "12",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC5",
        };
        const pc5 = await makeMatchController(match12);
        const pc5WT = pc5 as any as matchType;
        tournamentParsed.matches.push(pc5WT.id!);

        const match13: matchType = {
          teamA: "13",
          teamB: "14",
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
          phase: "Pre-cuartos",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "PC6",
        };
        const pc6 = await makeMatchController(match13);
        const pc6WT = pc6 as any as matchType;
        tournamentParsed.matches.push(pc6WT.id!);

        // Cuartos de final

        const match14: matchType = {
          teamA: "1",
          teamB: "2",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF1",
        };
        const cuartosfinal1 = await makeMatchController(match14);
        const cuartosfinal1WT = cuartosfinal1 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal1WT.id!);

        const match15: matchType = {
          teamA: "PC1",
          teamB: "PC2",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF2",
        };
        const cuartosfinal2 = await makeMatchController(match15);
        const cuartosfinal2WT = cuartosfinal2 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal2WT.id!);

        const match16: matchType = {
          teamA: "PC3",
          teamB: "PC4",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF3",
        };
        const cuartosfinal3 = await makeMatchController(match16);
        const cuartosfinal3WT = cuartosfinal3 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal3WT.id!);

        const match17: matchType = {
          teamA: "PC5",
          teamB: "PC6",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF4",
        };
        const cuartosfinal4 = await makeMatchController(match17);
        const cuartosfinal4WT = cuartosfinal4 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal4WT.id!);

        //semi-final matches

        const match18: matchType = {
          teamA: "CF1",
          teamB: "CF2",
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
          code: "SF1",
        };
        const semifinal1 = await makeMatchController(match18);
        const semifinal1WT = semifinal1 as any as matchType;
        tournamentParsed.matches.push(semifinal1WT.id!);

        const match19: matchType = {
          teamA: "CF3",
          teamB: "CF4",
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
          code: "SF2",
        };
        const semifinal2 = await makeMatchController(match19);
        const semifinal2WT = semifinal2 as any as matchType;
        tournamentParsed.matches.push(semifinal2WT.id!);
        //final match
        const match20: matchType = {
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
          code: "F"
        };
        const final = await makeMatchController(match20);
        const finalWT = final as any as matchType;
        tournamentParsed.matches.push(finalWT.id!);
      } else if(teamsPerGroup * numberGroups == 32 && teamsPerGroup == 4){
           //matches for the fifth place repechaje
        const match1: matchType = {
          teamA: "3A",
          teamB: "4A",
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
          code: "R1",
        };
        const fifthP1 = await makeMatchController(match1);
        const fifthP1WT = fifthP1 as any as matchType;
        tournamentParsed.matches.push(fifthP1WT.id!);

        const match2: matchType = {
          teamA: "3B",
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
          code: "R2",
        };
        const fifthP2 = await makeMatchController(match2);
        const fifthP2WT = fifthP2 as any as matchType;
        tournamentParsed.matches.push(fifthP2WT.id!);

        const match3: matchType = {
          teamA: "3C",
          teamB: "4C",
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
          code: "R3",
        };
        const fifthP3 = await makeMatchController(match3);
        const fifthP3WT = fifthP3 as any as matchType;
        tournamentParsed.matches.push(fifthP3WT.id!);

        const match4: matchType = {
          teamA: "3D",
          teamB: "4D",
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
          code: "R4",
        };
        const fifthP4 = await makeMatchController(match4);
        const fifthP4WT = fifthP4 as any as matchType;
        tournamentParsed.matches.push(fifthP4WT.id!);

        const match5: matchType = {
          teamA: "3E",
          teamB: "4E",
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
          code: "R5",
        };
        const fifthP5 = await makeMatchController(match5);
        const fifthP5WT = fifthP5 as any as matchType;
        tournamentParsed.matches.push(fifthP5WT.id!);

          const match6: matchType = {
          teamA: "3F",
          teamB: "4F",
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
          code: "R6",
        };
        const fifthP6 = await makeMatchController(match6);
        const fifthP6WT = fifthP6 as any as matchType;
        tournamentParsed.matches.push(fifthP6WT.id!);

          const match7: matchType = {
          teamA: "3G",
          teamB: "4G",
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
          code: "R7",
        };
        const fifthP7 = await makeMatchController(match7);
        const fifthP7WT = fifthP7 as any as matchType;
        tournamentParsed.matches.push(fifthP7WT.id!);

        const match8: matchType = {
          teamA: "3H",
          teamB: "4H",
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
          code: "R8",
        };
        const fifthP8 = await makeMatchController(match8);
        const fifthP8WT = fifthP8 as any as matchType;
        tournamentParsed.matches.push(fifthP8WT.id!);

        // Octavos de final
        const match9: matchType = {
          teamA: "1A",
          teamB: "2C",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF1",
        };
        const of1 = await makeMatchController(match9);
        const of1WT = of1 as any as matchType;
        tournamentParsed.matches.push(of1WT.id!);

         const match10: matchType = {
          teamA: "1E",
          teamB: "2H",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF2",
        };
        const of2 = await makeMatchController(match10);
        const of2WT = of2 as any as matchType;
        tournamentParsed.matches.push(of2WT.id!);

        const match11: matchType = {
          teamA: "1G",
          teamB: "2F",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF3",
        };
        const of3 = await makeMatchController(match11);
        const of3WT = of3 as any as matchType;
        tournamentParsed.matches.push(of3WT.id!);

        const match12: matchType = {
          teamA: "1B",
          teamB: "2D",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF4",
        };
        const of4 = await makeMatchController(match12);
        const of4WT = of4 as any as matchType;
        tournamentParsed.matches.push(of4WT.id!);

        const match13: matchType = {
          teamA: "1D",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF5",
        };
        const of5 = await makeMatchController(match13);
        const of5WT = of5 as any as matchType;
        tournamentParsed.matches.push(of5WT.id!);

        const match14: matchType = {
          teamA: "1H",
          teamB: "2E",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF6",
        };
        const of6 = await makeMatchController(match14);
        const of6WT = of6 as any as matchType;
        tournamentParsed.matches.push(of6WT.id!);

         const match15: matchType = {
          teamA: "1F",
          teamB: "2G",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF7",
        };
        const of7 = await makeMatchController(match15);
        const of7WT = of7 as any as matchType;
        tournamentParsed.matches.push(of7WT.id!);

         const match16: matchType = {
          teamA: "1C",
          teamB: "2A",
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
          phase: "Octavos de final",
          order: "1",
          nextRound: "Cuartos de final",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "OF8",
        };
        const of8 = await makeMatchController(match16);
        const of8WT = of8 as any as matchType;
        tournamentParsed.matches.push(of8WT.id!);

        // Cuartos de final

        const match17: matchType = {
          teamA: "OF1",
          teamB: "OF2",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF1",
        };
        const cuartosfinal1 = await makeMatchController(match17);
        const cuartosfinal1WT = cuartosfinal1 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal1WT.id!);

        const match18: matchType = {
          teamA: "OF3",
          teamB: "OF4",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF2",
        };
        const cuartosfinal2 = await makeMatchController(match18);
        const cuartosfinal2WT = cuartosfinal2 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal2WT.id!);

        const match19: matchType = {
          teamA: "OF5",
          teamB: "OF6",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF3",
        };
        const cuartosfinal3 = await makeMatchController(match19);
        const cuartosfinal3WT = cuartosfinal3 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal3WT.id!);

        const match20: matchType = {
          teamA: "OF7",
          teamB: "OF8",
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
          phase: "Cuartos de final",
          order: "1",
          nextRound: "Semifinal",
          cornersA: 0,
          cornersB: 0,
          faultsA: 0,
          faultsB: 0,
          code: "CF4",
        };
        const cuartosfinal4 = await makeMatchController(match20);
        const cuartosfinal4WT = cuartosfinal4 as any as matchType;
        tournamentParsed.matches.push(cuartosfinal4WT.id!);

        //semi-final matches

        const match21: matchType = {
          teamA: "CF1",
          teamB: "CF2",
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
          code: "SF1",
        };
        const semifinal1 = await makeMatchController(match21);
        const semifinal1WT = semifinal1 as any as matchType;
        tournamentParsed.matches.push(semifinal1WT.id!);

        const match22: matchType = {
          teamA: "CF3",
          teamB: "CF4",
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
          code: "SF2",
        };
        const semifinal2 = await makeMatchController(match22);
        const semifinal2WT = semifinal2 as any as matchType;
        tournamentParsed.matches.push(semifinal2WT.id!);
        //final match
        const match23: matchType = {
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
          code: "F"
        };
        const final = await makeMatchController(match23);
        const finalWT = final as any as matchType;
        tournamentParsed.matches.push(finalWT.id!);
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
