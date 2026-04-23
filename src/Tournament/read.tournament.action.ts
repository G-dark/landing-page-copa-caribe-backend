import Tournament, { tournamentType } from "./tournament.model.js";

export const readTournaments = async (id?: string, query?: any) => {
  let tournaments;
  if (id) {
    tournaments = await Tournament.find({ id });
  } else if (query) {
    tournaments = await Tournament.find(query).exec();
  } else {
    tournaments = await Tournament.find();
  }
  if (tournaments.length > 0) {
    return tournaments;
  }
};

export const transform2Tournament = (tournament: any): tournamentType => {
  return {
    id: tournament.id,
    name: tournament.name,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    matches: tournament.matches,
    boardGroups: tournament.boardGroups,
    numberTeamsPerGroup: tournament.numberTeamsPerGroup,
    category: tournament.category,
    city: tournament.city,
    edition: tournament.edition,
    numberGroups: tournament.numberGroups
  };
};
