import Team, { teamType } from "./team.model.js";
import { createID } from "../Utils/utils.js";
import User from "../User/user.model.js";

export const registerATeam = async (team: teamType, username: string) => {
  let registeredTeam;
  // verify if the id is being used by another team in the same edition
  let existstingTeam, id;
  do {
    id = createID();
    existstingTeam = await Team.find({ id, edition: team.edition });
  } while (existstingTeam.length > 0);

  const newTeam = new Team({ ...team, id });
  registeredTeam = await newTeam.save();

  if (registeredTeam) {
    const userUpdated = await User.find({ username });
    userUpdated[0].team?.push(String(id));

    await User.updateOne({ username }, userUpdated[0]);
    return { success: "Team registered successfully" };
  } else {
    return { error: "Failed to register team" };
  }
};
