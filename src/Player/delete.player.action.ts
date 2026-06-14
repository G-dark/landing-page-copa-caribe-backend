import Player from "./player.model.js";
import Team from "../Team/team.model.js";

export const deleteAPlayer = async (
  id: string,
  editionPlayed: string,
  username: string,
) => {
  console.log(id, editionPlayed);
  const player2Delete = await Player.findOneAndDelete({
    id,
    editionPlayed: editionPlayed,
  });
  console.log(player2Delete);

  if (player2Delete) {
    const team = await Team.find({ id: player2Delete.team });
    team[0].players = team[0].players?.filter((player) => {
      return player != Number(id);
    });
    team[0].editedAt = new Date(Date.now());
    team[0].editedBy = username;
    const updatedTeam = await Team.updateOne({ id: team[0].id }, team[0]);
    return { success: "Player deleted successfully" };
  } else {
    return { error: "Player not found" };
  }
};
