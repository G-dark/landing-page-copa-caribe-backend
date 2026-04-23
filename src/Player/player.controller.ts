import { registerAPlayer } from "./create.player.action.js";
import { deleteAPlayer } from "./delete.player.action.js";
import {
  readPlayers,
  readPlayersWOId,
  transform2Player,
} from "./read.player.action.js";
import { updateAplayer } from "./update.player.action.js";
import { PlayerType } from "./player.model.js";
import { v2 as cloudinary } from "cloudinary";
import { API_KEY, API_SECRET, CLOUD_NAME } from "../App/config.js";

export const makePlayerController = async (player: PlayerType, file?: any) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });

    let base64String, uploadResult;

    if (file) {
      // Convertir buffer a base64
      base64String = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64",
      )}`;
      // Upload an image
      uploadResult = await cloudinary.uploader
        .upload(base64String, {
          folder: "players/images",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        })
        .catch((error) => {
          console.log(error);
        });
    }

    player.image = uploadResult ? uploadResult.secure_url : " ";
    player.image_id = uploadResult ? uploadResult.public_id : " ";

    const result = await registerAPlayer(player);
    return result;
  } catch (error) {
    return { error: String(error) };  //Failed to register a player
  }
};

export const getPlayersController = async (id?: string, query?: any) => {
  try {
    const players = await readPlayers(id, query);
    return players;
  } catch (error) {
    return { error: "failed to get players" };
  }
};

export const getPlayersControllerWOId = async (query?: any) => {
  try {
    const players = await readPlayersWOId(query);
    return players;
  } catch (error) {
    return { error: "failed to get players" };
  }
};

export const deletePlayerController = async (
  id: string,
  editionPlayed: string,
) => {
  try {
    const player = await readPlayers(id);
    const playerR = transform2Player((player as PlayerType[])[0]);
    if (playerR.image !== " ") {
      const deleteFlag = cloudinary.uploader.destroy(playerR.image_id!);
    }
    const result = await deleteAPlayer(id, editionPlayed);
    return result;
  } catch (error) {
    return { error: "Failed to delete a player" };
  }
};

export const updatePlayerController = async (
  id: string,
  editionPlayed: string,
  player2Update: PlayerType,
  file?: any,
) => {
  try {
    let base64String, uploadResult;
    if (file) {
      // Convertir buffer a base64
      base64String = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64",
      )}`;

      if (player2Update.image !== " ") {
        // Upload an image
        uploadResult = await cloudinary.uploader
          .upload(base64String, {
            folder: "players/images",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ],
          })
          .catch((error) => {
            console.log(error);
          });
        player2Update.image = uploadResult ? uploadResult.secure_url : " ";
        player2Update.image_id = uploadResult ? uploadResult.public_id : " ";
      } else {
        // update image
        uploadResult = await cloudinary.uploader
          .upload(base64String, {
            folder: "players/images",
            public_id: player2Update.image_id,
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
    const result = await updateAplayer(id, editionPlayed, player2Update);
    return result;
  } catch (error) {
    return { error: "Failed to update a player" };
  }
};
