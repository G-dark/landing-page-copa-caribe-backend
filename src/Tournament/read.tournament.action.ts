import Tournament, { tournamentType } from "./tournament.model.js";

export const readTournaments = async (id?: string, query?: any) => {
  let tournaments;
  if (id) {
    tournaments = await Tournament.find({ id });
  } else if (query) {
    if (query.date && query.name) {
      const { date, name, ...restQuery } = query;
      tournaments = await Tournament.find({
        startDate: { $gte: date },
        name: { $regex: name, $options: "i" },
        ...restQuery,
      }).exec();
    } else if (query.date) {
      const { date, ...restQuery } = query;
      tournaments = await Tournament.find({
        startDate: { $gte: date },
        ...restQuery,
      }).exec();
    } else if (query.name) {
      const {name, ...restQuery } = query;
      tournaments = await Tournament.find({
        name: { $regex: name, $options: "i" },
        ...restQuery,
      }).exec();
    } else {
      tournaments = await Tournament.find(query).exec();
    }
  } else {
    tournaments = await Tournament.find();
  }
  if (tournaments.length > 0) {
    return tournaments.map((tournament) => {
      return transform2Tournament(tournament);
    });
  } else {
    return { error: "There are no tournaments" };
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
    numberGroups: tournament.numberGroups,
    isParent: tournament.isParent,
    parent: tournament.parent,
    children: tournament.children,
    department: tournament.department,
    matchDuration: tournament.matchDuration,
    numberPlayers: tournament.numberPlayers,
    teams: tournament.teams,
    goalscorers: tournament.goalscorers,
    assisters: tournament.assisters,
    playerWithMostYellowCards: tournament.playerWithMostYellowCards,
    playersInTournament: tournament.playersInTournament,
  };
};
