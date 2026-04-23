import Tournament, { tournamentType } from "./tournament.model.js";

export const updateTournament = async(id:string, tournament:tournamentType) => {
    const updated = await Tournament.findOneAndUpdate({id}, {$set: tournament});

    if(updated){
        return {success: "Tournament updated successfully"}
    } else {
        return {error: "Error updating the tournament"}
    }
};

