import Player from "./player.model.js";
import Team from "../Team/team.model.js";

export const deleteAPlayer = async (id: string, editionPlayed: string) =>{

    const player2Delete = await Player.findOneAndDelete({id, editionPlayed});
    const team = await Team.find({id: player2Delete?.team});
    team[0].players = team[0].players?.filter((player)=>{return player != Number(id)});
    const updatedTeam = await Team.updateOne({id:team[0].id}, team[0])
    if(player2Delete){
        return {success: "Player deleted successfully"};
    } else {
        return {error: "player not found"}
    }
}