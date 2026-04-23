import User from "../User/user.model.js";
import Team from "./team.model.js";

export const deleteATeam = async (id: string, username: string) => {
  const userUpdated = await User.find({ username });
  const team = await Team.find({ id });
  userUpdated[0].team = userUpdated[0].team?.filter((team) => {
    return team !== id;
  });
  await User.updateOne({ username }, userUpdated[0]);
  const deleted = await Team.findOneAndDelete({ id });

  if (deleted) {
    return { success: "Team deleted successfully" };
  } else {
    return { error: "Team not found" };
  }
};
