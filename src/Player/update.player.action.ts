import Player, { PlayerType } from "./player.model.js";

export const updateAplayer = async (
  id: string,
  editionPlayed: string,
  player2Update: PlayerType,
) => {
    const updatedPlayer = await Player.findOneAndUpdate({id, editionPlayed}, {$set:player2Update});

    if(updatedPlayer){
        return {success: "Player updated successfully"};
    } else {
        return {error: "player not found"}
    }
};
