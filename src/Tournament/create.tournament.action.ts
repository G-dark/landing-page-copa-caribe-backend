import { createID } from "../Utils/utils.js";
import Tournament, { tournamentType } from "./tournament.model.js";

export const createTournament = async (tournament: tournamentType) => {
  let registeredTeam;
  // verify if the id is being used by another tournament
  let existstingTN, id;
  do {
    id = createID();
    existstingTN = await Tournament.find({ id });
  } while (existstingTN.length > 0);

  const newTournament = new Tournament({ ...tournament, id });
  const created = await newTournament.save();

  if (created) {
    return { ...tournament, id };
  } else {
    return { error: "Error creating the tournament" };
  }
};
