import { registerATeam } from "./create.team.action.js";
import {
  addACoach,
  deleteACoach,
  updateACoach,
  updateATeam,
} from "./update.team.action.js";
import { deleteATeam } from "./delete.team.action.js";
import { readTeams, transform2Team } from "./read.team.action.js";
import { coachInfo, teamType } from "./team.model.js";
import { v2 as cloudinary } from "cloudinary";
import { API_KEY, API_SECRET, CLOUD_NAME } from "../App/config.js";
import { matchType } from "../Match/match.model.js";

export const makeTeamController = async (
  team: teamType,
  username: string,
  file?: any,
) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });

    let base64String, uploadResult;

    if (file) {
      // Convertir buffer a base64

      base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      // Upload an image
      uploadResult = await cloudinary.uploader
        .upload(base64String, {
          folder: "teams/flags",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        })
        .catch((error) => {
          console.log(error);
        });
      team.flag = uploadResult ? uploadResult.secure_url : null;
      team.id_flag = uploadResult ? uploadResult.public_id : null;
    }

    const create = await registerATeam(team, username);
    return create;
  } catch (error) {
    return { error: "Failed to register team" };
  }
};

export const getTeamsController = async (id?: string, query?: any) => {
  try {
    const read = await readTeams(id, query);
    return read;
  } catch (error) {
    return { error: "Failed to get team(s)" }; //
  }
};

export const updateTeamController = async (
  id: string,
  team: teamType,
  file?: any,
) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });

    let base64String, base64String2, uploadResult, uploadResult2;

    if (file) {
      // Convertir buffer a base64
      base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      if (team.flag !== null) {
        // Upload an image
        uploadResult = await cloudinary.uploader
          .upload(base64String, {
            folder: "teams/flags",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ],
          })
          .catch((error) => {
            console.log(error);
          });
        team.flag = uploadResult ? uploadResult.secure_url : null;
        team.id_flag = uploadResult ? uploadResult.public_id : null;
      } else {
        // update image
        uploadResult = await cloudinary.uploader
          .upload(base64String, {
            folder: "teams/flags",
            public_id: team.id_flag!,
            overwrite: true,
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ],
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    return await updateATeam(id, team);
  } catch (error) {
    return { error: "Failed to update team" };
  }
};



export const deleteTeamController = async (id: string, username: string) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    const team = await readTeams(id);
    const teamR = transform2Team((team as teamType[])[0]);
    if (teamR.id_flag && teamR.flag !== null) {
      const deleteFlag = await cloudinary.uploader.destroy(teamR.id_flag);
    }

    const coachs = teamR.coach;

    if (coachs) {
      for (let coach of coachs) {
        if (coach.image !== null) {
          await cloudinary.uploader.destroy(coach.image_id!);
        }
      }
    }

    return await deleteATeam(id, username);
  } catch (error) {
    return { error: "Failed to delete team" };
  }
};

export const addCoachController = async (
  id: string,
  coach: coachInfo,
  username:string,
  file?: any,
) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    let base64String, uploadResult;

    if (file) {
      base64String = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64",
      )}`;
      // Upload an image
      uploadResult = await cloudinary.uploader
        .upload(base64String, {
          folder: "teams/coachs",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        })
        .catch((error) => {
          console.log(error);
        });
      coach.image = uploadResult ? uploadResult.secure_url : null;
      coach.image_id = uploadResult ? uploadResult.public_id : null;
    }

    return await addACoach(id, coach, username);
  } catch (error) {
    return { error: "Failed to add the coach" };
  }
};

export const deleteCoachController = async (id: string, idCoach: string, username: string) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    const team = await readTeams(id);
    const teamR = transform2Team((team as teamType[])[0]);
    const coachIndex = teamR.coach?.findIndex((coach) => {
      return coach.id == idCoach;
    });
    if (coachIndex) {
      if (teamR.coach && teamR.coach[coachIndex].image !== null) {
        await cloudinary.uploader.destroy(teamR.coach[coachIndex].image_id!);
      }
    } else {
      return { error: "That coach doesn't exist" };
    }

    return await deleteACoach(id, idCoach, username);
  } catch (error) {
    return { error: "Failed to delete the coach" };
  }
};

export const updateCoachController = async (
  id: string,
  coach: coachInfo,
  idCoach: string,
  username: string,
  file?: any,
) => {
  let base64String, uploadResult;
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
    if (file) {
      // Convertir buffer a base64
      base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      if (coach.image !== null) {
        // Upload an image
        uploadResult = await cloudinary.uploader
          .upload(base64String, {
            folder: "teams/coachs",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ],
          })
          .catch((error) => {
            console.log(error);
          });
        coach.image = uploadResult ? uploadResult.secure_url : null;
        coach.image_id = uploadResult ? uploadResult.public_id : null;
      } else {
        // update image
        uploadResult = await cloudinary.uploader
          .upload(base64String, {
            folder: "teams/coachs",
            public_id: coach.image_id!,
            overwrite: true,
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ],
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    return await updateACoach(id, idCoach, coach, username);
  } catch (error) {
    return { error: "Failed to update the coach"  };
  }
};


