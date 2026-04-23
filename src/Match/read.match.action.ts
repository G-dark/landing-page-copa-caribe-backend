import Match, { matchType } from "./match.model.js";

export const readMatch = async (id?: string) => {
  let match;
  if (id) {
    match = await Match.find({ id });
  } else {
    match = await Match.find();
  }

  if (match.length > 0) {
    return match.map((match: any) => {
      return transform2Match(match);
    });
  } else {
    return { error: "Match not found" };
  }
};
export const transform2Match = (match: any): matchType => {
  return {
    id: match.id,
    teamA: match.teamA,
    teamB: match.teamB,
    date: match.date,
    location: match.location,
    edition: match.edition,
    result: match.result,
    scorersA: match.scorersA,
    scorersB: match.scorersB,
    assistersA: match.assistersA,
    assistersB: match.assistersB,
    yellowPlayersA: match.yellowPlayers,
    redPlayersA: match.redPlayers,
    yellowPlayersB: match.yellowPlayers,
    redPlayersB: match.redPlayers,
    referee: match.referee,
    formacionA: match.formacionA,
    formacionB: match.formacionB,
    yellowCards: match.yellowCards,
    redCards: match.redCards,
    eventos: match.eventos,
    rules: match.rules,
    status: match.status,
    extraTime: match.extraTime,
    extraTime2: match.extraTime2,
    penaltyTakersA: match.penañtyTakersA,
    penaltyTakersB: match.penaltyTakersB,
    penaltyStarter: match.penaltyStarter,
    penalties: match.penalties,
    penaltieResult: match.penaltieResult,
    tournament: match.tournament,
    phase: match.phase,
    order: match.order,
    nextRound: match.nextRound,
    cornersA: match.cornersA,
    cornersB: match.cornersB
  };
};
