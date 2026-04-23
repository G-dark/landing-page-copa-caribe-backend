import Match from "../Match/match.model.js";
import Tournament from "./tournament.model.js";

export const deleteTournament = async (id: string) => {
  const deleted = await Tournament.findOneAndDelete({ id });

  if (deleted) {
    if(deleted.matches){
      for(let match of deleted.matches){
        await Match.deleteOne({id:match});
      }
    }
    return { success: "Tournament was successfully deleted" };
  } else {
    return { error: "Error deleting the tournament" };
  }
};
