import { createTournament } from "./create.tournament.action.js";
import { deleteTournament } from "./delete.tournament.action.js";
import { readTournaments } from "./read.tournament.action.js";
import { tournamentType } from "./tournament.model.js";
import { updateTournament } from "./update.tournament.action.js";

export const createTournamentController = async (
  tournament: tournamentType,
) => {
  try {
    return createTournament(tournament);
  } catch (error) {
    return { error: "create a tournament failed" };
  }
};

export const getTournamentsController = async (id?: string, query?: any) => {
  try {
    return readTournaments(id, query);
  } catch (error) {
    return { error: "get tournaments failed" };
  }
};

export const updateTournamentController = async (id: string, tournament:tournamentType) => {
  try {
    return updateTournament(id, tournament);
  } catch (error) {
    return { error: "update tournament failed" };
  }
};

export const deleteTournamentController = async (id: string) => {
  try {
    return deleteTournament(id);
  } catch (error) {
    return { error: "delete tournament failed" };
  }
};
