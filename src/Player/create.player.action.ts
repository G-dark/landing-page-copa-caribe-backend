import Player from "./player.model.js";
import { PlayerType } from "./player.model.js";
import Team from "../Team/team.model.js";

export const registerAPlayer = async (player: PlayerType) => {
  const existingPlayer = await Player.find({
    id: player.id,
    editionPlayed: player.editionPlayed,
  });
  let registered;
  if (existingPlayer.length > 0) {
    return { error: "Player already exists in this edition" };
  } else {
    const team = await Team.find({ id: player.team });

    if (team.length > 0) {
      const newPlayer = new Player(player);
      registered = await newPlayer.save();
      team[0].players?.push(Number(player.id));
      const updatedTeam = await Team.updateOne({ id: team[0].id }, team[0]);
    } else {
      return {error: "That team doesn't exist"}
    }
  }

  if (registered) {
    return { success: "Player registered successfully" };
  } else {
    return { error: "Failed to register player" };
  }
};
