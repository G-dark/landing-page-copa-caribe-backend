import User from "../User/user.model.js";
import Team, { coachInfo, teamType } from "./team.model.js";

export const updateATeam = async (
  id: string,
  team: teamType
) => {
  const updated = await Team.findOneAndUpdate({ id }, { $set: team });

  if (updated) {
    return { success: "Team updated" };
  } else {
    return { error: "That Team doesn't exist" };
  }
};

export const updateACoach = async (
  id: string,
  idCoach: string,
  coach: coachInfo,
  username: string,
) => {
  const team = await Team.find({ id });
  team[0].editedAt = new Date(Date.now());
  team[0].editedBy = username;
  const coachs = team[0].coach;

  if (coachs) {
    const coachIndex = coachs.findIndex((c) => {
      return c.id == idCoach;
    });
    if (coach.id) {
      coachs[coachIndex].id = coach.id;
    }
    if (coach.name) {
      coachs[coachIndex].name = coach.name;
    }
    if (coach.image) {
      coachs[coachIndex].image = coach.image;
    }
    if (coach.image_id) {
      coachs[coachIndex].image_id = coach.image_id;
    }
  }
  team[0].coach = coachs;
  const updated = await Team.findOneAndUpdate({ id }, { $set: team[0] });
  if (updated) {
    return { success: "Coach Updated inside Team" };
  } else {
    return { error: "That Team doesn't exist" };
  }
};

export const addACoach = async (
  id: string,
  coach: coachInfo,
  username: string,
) => {
  const team = await Team.find({ id });
  team[0].editedAt = new Date(Date.now());
  team[0].editedBy = username;
  if (team.length > 0) {
    if (team[0].coach && team[0].coach.length > 0) {
      const findCoach = team[0].coach.find((c) => {
        return c.id == coach.id;
      });
      if (findCoach) {
        return { error: "That coach already exists inside the team" };
      } else {
        team[0].coach?.push(coach);
      }
    } else {
      team[0].coach?.push(coach);
    }

    const updated = await Team.findOneAndUpdate({ id }, { $set: team[0] });
    return { success: "The coach has been added to the team" };
  } else {
    return { error: "That team doesn't exist" };
  }
};

export const deleteACoach = async (
  id: string,
  idCoach: string,
  username: string,
) => {
  const team = await Team.find({ id });
  team[0].editedAt = new Date(Date.now());
  team[0].editedBy = username;
  if (team.length > 0) {
    const coachs = team[0].coach;
    if (coachs) {
      const deleteCoachs = coachs.filter((coach) => {
        return coach.id !== idCoach;
      });
      team[0].coach = deleteCoachs;
      const updated = await Team.findOneAndUpdate({ id }, { $set: team[0] });
      return { success: "coach deleted inside the team" };
    }
  } else {
    return { error: "That team doesn't exist" };
  }
};
