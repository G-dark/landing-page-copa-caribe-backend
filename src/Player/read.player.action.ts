import Player, { PlayerType as playerType } from "./player.model.js";

export const readPlayers = async (id?: string, query?: any) => {
  let player2Find;
  if (id) {
    player2Find = await Player.find({ id });
  } else {
    const { goals, assists, ...restQuery } = query || {};

    player2Find = await Player.find({
      goals: { $gt: goals ? goals : 0 },
      assists: { $gt: assists ? assists : 0 },
      ...restQuery,
    }).exec();
  }

  if (player2Find.length > 0) {
    return player2Find.map((player) => {
      return transform2Player(player);
    });
  } else {
    return { error: "player(s) not found" };
  }
};

export const readPlayersWOId = async (query?: any) => {
  let player2Find;
  if (query) {
    const { goals, assists, ...restQuery } = query;
    player2Find = await Player.find({
      goals: { $gte: goals ? goals : 0 },
      assists: { $gte: assists ? assists : 0 },
      ...restQuery,
    }).exec();
  } else {
    player2Find = await Player.find();
  }

  if (player2Find.length > 0) {
    player2Find.map((player) => {
      player.id = "sin ID"
      return player;
    });
   return player2Find.map((player) => {
      return transform2Player(player);
    });
  } else {
    return { error: "player(s) not found" };
  }
};

export const transform2Player = (player: any): playerType => {
  return {
    name: player.name,
    id: player.id,
    dorsal: player.dorsal,
    nation: player.nation,
    position: player.position,
    team: player.team,
    teamName: player.teamName,
    image: player.image,
    image_id: player.image_id,
    goals: player.goals,
    assists: player.assists,
    gamesPlayed: player.gamesPlayed,
    yellowCards: player.yellowCards,
    redCards: player.redCards,
    editionPlayed: player.editionPlayed,
    minutesPlayed: player.minutesPlayed,
    starterGames: player.starterGames,
    subInGames: player.subInGames,
    age: player.age,
    birthYear: player.birthYear,
    talla: player.talla,
    editedAt: player.editedAt,
    editedBy: player.editedBy
  };
};
