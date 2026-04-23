import Match from "./match.model.js";

export const deleteAMatch = async (id: string) => {
  const deleted = await Match.findOneAndDelete({ id });

  if(deleted){
    return {success: "Successfully deleted"}
  } else {
    return {error: "Failed to delete"}
  }
};
