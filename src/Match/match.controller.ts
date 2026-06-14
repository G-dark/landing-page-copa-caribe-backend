import { readMatch, transform2Match } from "./read.match.action.js";
import {
  addEvent,
  addPenalty,
  addReferee,
  changeStatsBOEvent,
  deleteEvent,
  deletePenalty,
  deleteReferee,
  editEvent,
  editPenalty,
  editReferee,
  updateAMatch,
} from "./update.match.action.js";
import { registerAMatch } from "./create.match.action.js";
import { deleteAMatch } from "./delete.match.action.js";
import { evento, matchType, penalty, refereeInfo } from "./match.model.js";
import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "../App/config.js";

export const readMatchController = async (
  id?: string, query?:any
): Promise<matchType[] | { error: String }> => {
  try {
    return await readMatch(id, query);
  } catch (error) {
    return { error: "Failed to get the match" };
  }
};

export const updateMatchController = async (
  id: string,
  match: matchType
) => {
  try {
    return await updateAMatch(id, match);
  } catch (error) {
    return { error: "Failed to update the match" };
  }
};

export const addEventController = async (id: string, evento: evento) => {
  try {
    return await addEvent(evento, id);
  } catch (error) {
    return { error:"Failed to add the event" };
  }
};
export const editEventController = async (
  id: string,
  evento: evento,
  idEvent: string,
) => {
  try {
    return await editEvent(evento, id, idEvent);
  } catch (error) {
    return { error: "Failed to edit the event" };
  }
};

export const deleteEventController = async (id: string, idEvent: string) => {
  try {
    return await deleteEvent(id, idEvent);
  } catch (error) {
    return { error: "Failed to delete the event" };
  }
};

export const deleteMatchController = async (id: string) => {
  try {
    const match = await readMatch(id);
    const matchR = transform2Match((match as matchType[])[0]);
    return await deleteAMatch(id);
  } catch (error) {
    return { error: "Failed to delete the match" };
  }
};
/**
 * cambia las estadisticas necesarias del partido despues de un evento
 * @param {String} id - id del match
 * @param {String} typo - tipo de participacion goal o assistencia y de que equipo
 * @param {String} player - id del jugador a ingresar en la lista
 * @param {String} action - accion a realizar, eliminar o actualizar
 * @param {String} minute - minuto del evento
 * @param {String} player2 - id del jugador a eliminar de la lista en caso de ser una asistencia o una sustitucion
 * @returns {Object} resultado de la operacion
 * @throws {Object} error si falla la operacion

*/
export const ChangeStatsBOEventController = async (
  id: string,
  typo: string,
  action: "Delete" | "Update",
  minute: string,
  player?: string,
  player2?: string,
) => {
  try {
    return await changeStatsBOEvent(id, typo, action, minute,player, player2);
  } catch (error) {
    return { error: "Failed to add GA to the match" };
  }
};

export const makeMatchController = async (match: matchType) => {
  try {
    return await registerAMatch(match);
  } catch (error) {
    return { error: "failed to register the match" };
  }
};

export const addRefereeController = async (matchID: string, referee: refereeInfo) => {
  try {
    return await addReferee(matchID, referee);
  } catch (error) {
    return { error: "failed to add the referee" };
  }
};

export const editRefereeController = async (matchID: string, referee: refereeInfo, refereeID: string) => {
  try {
    return await editReferee(matchID, referee, refereeID);
  } catch (error) {
    return { error: "failed to edit the referee" };
  }
};

export const deleteRefereeController = async (matchID: string, refereeID: string) => {
  try {
    return await deleteReferee(matchID, refereeID);
  } catch (error) {
    return { error: "failed to delete the referee" };
  }
};

export const addPenaltyController = async (matchID: string, penalty: penalty) => {
  try {
    return await addPenalty(matchID, penalty);
  } catch (error) {
    return { error: String(error) }; // "failed to add the penalty"
  }
};

export const editPenaltyController = async (matchID: string, penalty: penalty, penaltyID: string) => {
  try {
    return await editPenalty(matchID, penalty, penaltyID);
  } catch (error) {
    return { error: "failed to edit the penalty" };
  }
};

export const deletePenaltyController = async (matchID: string, penaltyID: string) => {
  try {
    return await deletePenalty(matchID, penaltyID);
  } catch (error) {
    return { error: String(error) }; //"failed to delete the penalty"
  }
};
