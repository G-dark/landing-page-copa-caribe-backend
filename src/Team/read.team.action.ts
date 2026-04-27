import Team, { teamType } from "./team.model.js";

export const readTeams = async (id?: string, query?: any) => {
  let teams;
  if (id) {
    teams = await Team.find({ id });
  } else {
    const {name, ...restQuery} = query;
    teams = await Team.find({name: {$regex: name, $options: "i"}, ...restQuery}).exec();
  }
  if (!id && !query) {
    teams = await Team.find();
  }

  if (teams.length > 0) {
    return teams.map((team) => {
      return transform2Team(team);
    });
  } else {
    return { error: "Not team(s) found" };
  }
};
export const transform2Team = (team: any): teamType => {
  return {
    name: team.name,
    id: team.id,
    flag: team.flag,
    id_flag: team.id_flag,
    country: team.country,
    founded: team.founded,
    coach: team.coach,
    players: team.players,
    category: team.category,
    edition: team.edition,
  };
};

