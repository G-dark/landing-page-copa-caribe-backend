import { createID } from "../Utils/utils.js";
import Match, { matchType } from "./match.model.js";

export const registerAMatch = async (match: matchType) => {
  let registeredMatch;
  // verify if the id is being used by another match
  let existingMatch, id;
  do {
    id = createID();
    existingMatch = await Match.find({ id });
  } while (existingMatch.length > 0);

  const newmatch = new Match({ ...match, id });
  registeredMatch = await newmatch.save();

  if (registeredMatch) {
    return {...match, id};
  } else {
    return { error: "Failed to register match" };
  }
};
