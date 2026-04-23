import Player from "../Player/player.model.js";
import Tournament from "../Tournament/tournament.model.js";
import Match, {
  evento,
  matchType,
  penalty,
  refereeInfo,
} from "./match.model.js";
import { transform2Match } from "./read.match.action.js";

export const updateAMatch = async (id: string, match: matchType) => {
  const updated = await Match.findOneAndUpdate({ id }, match);
  if (updated) {
    return { success: "Match updated successfully" };
  } else {
    return { error: "Failed to update the match" };
  }
};

export const addEvent = async (evento: evento, id: string) => {
  const match = await Match.find({ id });
  console.log(match[0]);
  if (match[0].eventos.length == 0) {
    evento.id = id + "-" + Number(match[0].eventos.length + 1);
  } else {
    const partesid =
      match[0].eventos[match[0].eventos.length - 1].id.split("-");
    evento.id = id + "-" + Number(Number(partesid[1]) + 1);
  }

  match[0].eventos.push(evento);
  const updated = await Match.findOneAndUpdate({ id }, { $set: match[0] });
  if (updated) {
    return { success: "Event added successfully" };
  } else {
    return { error: "Failed to add the event" };
  }
};

export const editEvent = async (
  evento: evento,
  id: string,
  idEvent: string,
) => {
  const match = await Match.find({ id });
  const indexEvent = match[0].eventos.findIndex((evento) => {
    return evento.id == idEvent;
  });
  if (evento.description) {
    match[0].eventos[indexEvent].description = evento.description;
  }
  if (evento.minute) {
    match[0].eventos[indexEvent].minute = evento.minute;
  }

  if (evento.id || evento.tipo) {
    return { error: "This is only for editing descripcion and minute" };
  }

  const updated = await Match.findOneAndUpdate({ id }, { $set: match[0] });
  if (updated) {
    return { success: "Event edited successfully" };
  } else {
    return { error: "Failed to edit the event" };
  }
};

export const deleteEvent = async (id: string, idEvent: string) => {
  const match = await Match.find({ id });

  if (match) {
    match[0].eventos = match[0].eventos.filter((evento) => {
      return evento.id !== idEvent;
    });

    const updated = await Match.findOneAndUpdate({ id }, { $set: match[0] });

    if (updated) {
      return { success: "Event deleted successfully" };
    } else {
      return { error: "Failed to delete the event" };
    }
  } else {
    return { error: "That event doesn't exist" };
  }
};

export const changeStatsBOEvent = async (
  id: string,
  typo: string,
  action: "Delete" | "Update",
  minute: string,
  player?: string,
  player2?: string,
) => {
  let GA, GA_;
  const match = await Match.find({ id });
  const playerR = await Player.find({ id: player });
  const playerR2 = await Player.find({ id: player2 });

  switch (typo) {
    case "AssistA":
      if (action == "Update") {
        match[0].assistersA.push(player!);
        playerR[0].assists++;
      } else if (action == "Delete") {
        GA = match[0].assistersA.filter((assister) => {
          return assister == player;
        });
        GA_ = match[0].assistersA.filter((assister) => {
          return assister !== player;
        });
        GA.pop();
        GA = GA.concat(GA_);
        match[0].assistersA = GA;
        playerR[0].assists--;
      }

      break;
    case "AssistB":
      if (action == "Update") {
        match[0].assistersB.push(player!);
        playerR[0].assists++;
      } else if (action == "Delete") {
        GA = match[0].assistersB.filter((assister) => {
          return assister == player;
        });
        GA_ = match[0].assistersB.filter((assister) => {
          return assister !== player;
        });
        GA.pop();
        GA = GA.concat(GA_);
        match[0].assistersB = GA;
        playerR[0].assists--;
      }
      break;
    case "GoalA":
      if (action == "Update") {
        match[0].scorersA.push(player!);
        playerR[0].goals++;
      } else if (action == "Delete") {
        GA = match[0].scorersA.filter((scorer) => {
          return scorer == player;
        });
        GA_ = match[0].scorersA.filter((scorer) => {
          return scorer !== player;
        });
        GA.pop();
        GA = GA.concat(GA_);
        match[0].scorersA = GA;
        playerR[0].goals--;
      }
      break;
    case "GoalB":
      if (action == "Update") {
        match[0].scorersB.push(player!);
        playerR[0].goals++;
      } else if (action == "Delete") {
        GA = match[0].scorersB.filter((scorer) => {
          return scorer == player;
        });
        GA_ = match[0].scorersB.filter((scorer) => {
          return scorer !== player;
        });
        GA.pop();
        GA = GA.concat(GA_);

        console.log(player, GA);
        match[0].scorersB = GA;
        playerR[0].goals--;
      }
      break;
    case "RedA":
      if (action == "Update") {
        match[0].redPlayersA.push(player!);
        match[0].redCards++;
        playerR[0].redCards++;
      } else if (action == "Delete") {
        GA = match[0].redPlayersA.filter((p) => {
          return p !== player;
        });
        match[0].redPlayersA = GA;
        match[0].redCards--;
        playerR[0].redCards--;
      }
      break;
    case "YellowA":
      if (action == "Update") {
        const findPlayer = match[0].yellowPlayersA.find((yp) => {
          return yp == player!;
        });
        if (findPlayer) {
          match[0].redPlayersA.push(player!);
          match[0].redCards++;
          playerR[0].redCards++;
        } else {
          match[0].yellowPlayersA.push(player!);
          match[0].yellowCards++;
          playerR[0].yellowCards++;
        }
      } else if (action == "Delete") {
        const findPlayer = match[0].redPlayersA.find((rp) => {
          return rp == player!;
        });
        if (findPlayer) {
          GA = match[0].redPlayersA.filter((p) => {
            return p !== player;
          });
          match[0].redPlayersA = GA;
          match[0].redCards--;
          playerR[0].redCards--;
        } else {
          GA = match[0].yellowPlayersA.filter((p) => {
            return p !== player;
          });
          match[0].yellowPlayersA = GA;
          match[0].yellowCards--;
          playerR[0].yellowCards--;
        }
      }
      break;
    case "RedB":
      if (action == "Update") {
        match[0].redPlayersB.push(player!);
        match[0].redCards++;
        playerR[0].redCards++;
      } else if (action == "Delete") {
        GA = match[0].redPlayersB.filter((p) => {
          return p !== player;
        });

        match[0].redPlayersB = GA;
        match[0].redCards--;
        playerR[0].redCards--;
      }
      break;
    case "YellowB":
      if (action == "Update") {
        const findPlayer = match[0].yellowPlayersB.find((yp) => {
          return yp == player!;
        });
        if (findPlayer) {
          match[0].redPlayersB.push(player!);
          match[0].redCards++;
          playerR[0].redCards++;
        } else {
          match[0].yellowPlayersB.push(player!);
          match[0].yellowCards++;
          playerR[0].yellowCards++;
        }
      } else if (action == "Delete") {
        const findPlayer = match[0].redPlayersB.find((rp) => {
          return rp == player!;
        });
        if (findPlayer) {
          GA = match[0].redPlayersB.filter((p) => {
            return p !== player;
          });
          match[0].redPlayersB = GA;
          match[0].redCards--;
          playerR[0].redCards--;
        } else {
          GA = match[0].yellowPlayersB.filter((p) => {
            return p !== player;
          });

          match[0].yellowPlayersB = GA;
          match[0].yellowCards--;
          playerR[0].yellowCards--;
        }
      }
      break;
    case "SubstitutionA":
      const playerSOIndexA = match[0].formacionA?.starters.findIndex((pl) => {
        return pl == player;
      });
      const playerSOIndexA2 = match[0].formacionA?.subPlayers.findIndex(
        (pl) => {
          return pl == player2;
        },
      );
      if (playerSOIndexA !== -1 && playerSOIndexA !== undefined) {
        match[0].formacionA!.starters[playerSOIndexA] = player2!;
      }
      if (playerSOIndexA2 !== -1 && playerSOIndexA2 !== undefined) {
        match[0].formacionA!.subPlayers[playerSOIndexA2] = player!;
      }
      if (minute.includes("+") && player2) {
        const partes = minute.split("+");
        playerR[0].minutesPlayed = Number(partes[0]) + Number(partes[1]);
        playerR2[0].minutesPlayed = -(Number(partes[0]) + Number(partes[1]));
      } else {
        playerR[0].minutesPlayed = Number(minute);
        playerR2[0].minutesPlayed = -Number(minute);
      }
      playerR2[0].subInGames++;
      playerR2[0].gamesPlayed++;
      break;

    case "SubstitutionB":
      const playerSOIndexB = match[0].formacionB?.starters.findIndex((pl) => {
        return pl == player;
      });
      const playerSOIndexB2 = match[0].formacionB?.subPlayers.findIndex(
        (pl) => {
          return pl == player2;
        },
      );
      if (playerSOIndexB !== -1 && playerSOIndexB !== undefined) {
        match[0].formacionB!.starters[playerSOIndexB] = player2!;
      }
      if (playerSOIndexB2 !== -1 && playerSOIndexB2 !== undefined) {
        match[0].formacionB!.subPlayers[playerSOIndexB2] = player!;
      }
      if (minute.includes("+") && player2) {
        const partes = minute.split("+");
        playerR[0].minutesPlayed = Number(partes[0]) + Number(partes[1]);
        playerR2[0].minutesPlayed = -(Number(partes[0]) + Number(partes[1]));
      } else {
        playerR[0].minutesPlayed = Number(minute);
        playerR2[0].minutesPlayed = -Number(minute);
      }
      playerR2[0].subInGames++;
      playerR2[0].gamesPlayed++;

      break;
    case "CornerA":
      if (action == "Update") {
        match[0].cornersA++;
      } else if (action == "Delete") {
        match[0].cornersA--;
      }

      break;
    case "CornerB":
      if (action == "Update") {
        match[0].cornersB++;
      } else if (action == "Delete") {
        match[0].cornersB--;
      }

      break;
    case "Start":
      match[0].status = "En vivo";
      playerR[0].gamesPlayed++;
      playerR[0].starterGames++;
      break;
    case "Final":
      playerR[0].minutesPlayed +=
        match[0].rules.minutesPerTime * 2 +
        match[0].extraTime! +
        match[0].extraTime2!;

      match[0].status = "Finalizado";
      break;
    case "Positions":
      const matches = await Match.find({
        tournament: match[0].tournament,
        phase: match[0].phase,
        status: "Programado",
        order: match[0].order,
      });
      const matchesLive = await Match.find({
        tournament: match[0].tournament,
        phase: match[0].phase,
        status: "En vivo",
        order: match[0].order,
      });
      const marcador = match[0].result?.split("-");
      const tournament = await Tournament.find({ id: match[0].tournament });
      if (match[0].phase == "Grupos") {
        let teamInGroupIndex, teamInGroupIndexB;

        teamInGroupIndex = tournament[0].boardGroups[
          Number(match[0].order) - 1
        ].findIndex((teamInGroup) => {
          return teamInGroup.team == match[0].teamA;
        });

        teamInGroupIndexB = tournament[0].boardGroups[
          Number(match[0].order) - 1
        ].findIndex((teamInGroup) => {
          return teamInGroup.team == match[0].teamB;
        });

        if (Number(marcador![0]) > Number(marcador![1])) {
          // change the stats after the end of the game

          //games won
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndex]
            .gamesWon++;
          //points
          tournament[0].boardGroups[Number(match[0].order)][
            teamInGroupIndex
          ].points += 3;
        } else if (Number(marcador![0]) < Number(marcador![1])) {
          // change the stats after the end of the game

          //games won
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndexB]
            .gamesWon++;
          //points
          tournament[0].boardGroups[Number(match[0].order)][
            teamInGroupIndexB
          ].points += 3;
        } else if (Number(marcador![0]) == Number(marcador![1])) {
          // change the stats after the end of the game

          //games won
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndexB]
            .gamesDraw++;
          //games won
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndex]
            .gamesDraw++;

          //points
          tournament[0].boardGroups[Number(match[0].order)][
            teamInGroupIndexB
          ].points += 1;
          //points
          tournament[0].boardGroups[Number(match[0].order)][
            teamInGroupIndex
          ].points += 1;
        }
        // team A
        // games played
        tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndex]
          .gamesPlayed++;

        // goals done
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndex
        ].goalsP += Number(marcador![0]);
        // goals against
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndex
        ].goalsC += Number(marcador![1]);
        //goal difference
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndex
        ].goalDifference =
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndex]
            .goalsP -
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndex]
            .goalsC;

        // yellow cards
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndex
        ].yellowCards = match[0].yellowPlayersA.length;

        // red cards
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndex
        ].redCards = match[0].redPlayersA.length;

        // team B
        // games played
        tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndexB]
          .gamesPlayed++;
        // goals done
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndexB
        ].goalsP += Number(marcador![1]);
        // goals against
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndexB
        ].goalsC += Number(marcador![0]);
        //goal difference
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndexB
        ].goalDifference =
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndexB]
            .goalsP -
          tournament[0].boardGroups[Number(match[0].order)][teamInGroupIndexB]
            .goalsC;

        // yellow cards
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndexB
        ].yellowCards = match[0].yellowPlayersB.length;

        // red cards
        tournament[0].boardGroups[Number(match[0].order)][
          teamInGroupIndexB
        ].redCards = match[0].redPlayersB.length;

        const sortedGroups = tournament[0].boardGroups[
          Number(match[0].order)
        ].sort((a, b) => {
          return b.points - a.points;
        });
        tournament[0].boardGroups[Number(match[0].order)] = sortedGroups;

        // pass the next round
        if (matches.length == 0 && matchesLive.length == 0) {
          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              8 &&
            match[0].nextRound == "Repechaje | Semifinal"
          ) {
            if (match[0].order == "1") {
              const semifinal1 = await Match.find({
                phase: "Semifinal",
                teamA: "1A",
                tournament: tournament[0].id,
              });
              const semifinal2 = await Match.find({
                phase: "Semifinal",
                teamA: "2A",
                tournament: tournament[0].id,
              });
              const repechaje1 = await Match.find({
                phase: "Repechaje",
                teamA: "3A",
                tournament: tournament[0].id,
              });
              const repechaje2 = await Match.find({
                phase: "Repechaje",
                teamA: "4A",
                tournament: tournament[0].id,
              });

              semifinal1[0].teamA =
                tournament[0].boardGroups[Number(match[0].order)][0].team;
              semifinal2[0].teamA =
                tournament[0].boardGroups[Number(match[0].order)][1].team;
              repechaje1[0].teamA =
                tournament[0].boardGroups[Number(match[0].order)][2].team;
              repechaje2[0].teamA =
                tournament[0].boardGroups[Number(match[0].order)][3].team;
            }

            if (match[0].order == "2") {
              const semifinal1 = await Match.find({
                phase: "Semifinal",
                teamB: "1B",
                tournament: tournament[0].id,
              });
              const semifinal2 = await Match.find({
                phase: "Semifinal",
                teamB: "2B",
                tournament: tournament[0].id,
              });
              const repechaje1 = await Match.find({
                phase: "Repechaje",
                teamB: "3B",
                tournament: tournament[0].id,
              });
              const repechaje2 = await Match.find({
                phase: "Repechaje",
                teamB: "4B",
                tournament: tournament[0].id,
              });

              semifinal1[0].teamB =
                tournament[0].boardGroups[Number(match[0].order)][0].team;
              semifinal2[0].teamB =
                tournament[0].boardGroups[Number(match[0].order)][1].team;
              repechaje1[0].teamB =
                tournament[0].boardGroups[Number(match[0].order)][2].team;
              repechaje2[0].teamB =
                tournament[0].boardGroups[Number(match[0].order)][3].team;
            }
          }
        }
      }
      if (match[0].phase == "Octavos de final") {
      }
      if (match[0].phase == "Cuartos de final") {
      }
      if (match[0].phase == "Semifinal") {
        if (matches.length == 0 && matchesLive.length == 0) {
          const final = await Match.find({
            phase: "Final",
            tournament: tournament[0].id,
          });
          if (Number(marcador![0]) > Number(marcador![1])) {
            final[0].teamB = match[0].teamA;
          } else if (Number(marcador![0]) < Number(marcador![1])) {
            final[0].teamB = match[0].teamB;
          } else if (Number(marcador![0]) == Number(marcador![1])) {
            const marcardorPenalties = match[0].penaltieResult?.split("-");
            if (
              Number(marcardorPenalties![0]) > Number(marcardorPenalties![1])
            ) {
              final[0].teamB = match[0].teamA;
            } else if (
              Number(marcardorPenalties![0]) < Number(marcardorPenalties![1])
            ) {
              final[0].teamB = match[0].teamB;
            }
          }
        }

        if (matches.length == 1 || matchesLive.length == 1) {
          const final = await Match.find({
            phase: "Final",
            tournament: tournament[0].id,
          });
          if (Number(marcador![0]) > Number(marcador![1])) {
            final[0].teamA = match[0].teamA;
          } else if (Number(marcador![0]) < Number(marcador![1])) {
            final[0].teamA = match[0].teamB;
          } else if (Number(marcador![0]) == Number(marcador![1])) {
            const marcardorPenalties = match[0].penaltieResult?.split("-");
            if (
              Number(marcardorPenalties![0]) > Number(marcardorPenalties![1])
            ) {
              final[0].teamA = match[0].teamA;
            } else if (
              Number(marcardorPenalties![0]) < Number(marcardorPenalties![1])
            ) {
              final[0].teamA = match[0].teamB;
            }
          }
        }
      }

      await Tournament.updateOne(
        { id: match[0].tournament },
        { $set: tournament[0] },
      );
      break;
    default:
      return { error: "That action type doensn't exist" };
  }
  if (typo.startsWith("Goal")) {
    match[0].result = match[0].scorersA.length + "-" + match[0].scorersB.length;
  }

  const updated = await Match.updateOne(
    { id },
    { $set: transform2Match(match[0]) },
  );
  const updated2 = await Player.updateOne({ id: player }, { $set: playerR[0] });
  let updated3;
  if (player2) {
    updated3 = await Player.updateOne({ id: player2 }, { $set: playerR2[0] });
  }

  if (updated && updated2) {
    return { success: "Goal participation registered successfully" };
  } else {
    return { error: "Failed to register the G/A" };
  }
};

export const addReferee = async (matchID: string, referee: refereeInfo) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    let id = match[0].id + match[0].referee.length;
    referee.id = id;
    match[0].referee.push(referee);

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "Referee added successfully" };
    } else {
      return { error: "Referee didn't add" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};

export const editReferee = async (
  matchID: string,
  referee: refereeInfo,
  refereeID: string,
) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    const refereeIndex = match[0].referee.findIndex((ref) => {
      return ref.id == refereeID;
    });

    if (refereeIndex !== -1 && refereeIndex !== undefined) {
      if (referee.name) {
        match[0].referee[refereeIndex].name = referee.name;
      }

      if (referee.lastName) {
        match[0].referee[refereeIndex].lastName = referee.lastName;
      }

      if (referee.position) {
        match[0].referee[refereeIndex].position = referee.position;
      }
    }

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "Referee updated successfully" };
    } else {
      return { error: "Referee didn't update" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};

export const deleteReferee = async (matchID: string, refereeID: string) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    const refereeClearList = match[0].referee.filter((ref) => {
      return ref.id !== refereeID;
    });

    match[0].referee = refereeClearList;

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "Referee deleted successfully" };
    } else {
      return { error: "Referee didn't delete" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};

// first part is added via update method for match

export const addPenalty = async (matchID: string, penalty: penalty) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    if (match[0].penalties) {
      match[0].penalties.push(penalty);
    }

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "penalty added successfully" };
    } else {
      return { error: "Referee didn't add" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};

export const editPenalty = async (
  matchID: string,
  penalty: penalty,
  penaltyIndex: number,
) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    if (penalty.goalkeeper) {
      match[0].penalties![penaltyIndex].goalkeeper = penalty.goalkeeper;
    }

    if (penalty.player) {
      match[0].penalties![penaltyIndex].player = penalty.player;
    }

    if (penalty.result) {
      match[0].penalties![penaltyIndex].result = penalty.result;
    }

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "penalty added successfully" };
    } else {
      return { error: "Referee didn't add" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};

export const deletePenalty = async (matchID: string, penaltyIndex: number) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    const penalties = match[0].penalties!.filter((penal, index) => {
      return index !== penaltyIndex;
    });

    match[0].penalties = penalties;

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "penalty added successfully" };
    } else {
      return { error: "Referee didn't add" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};
