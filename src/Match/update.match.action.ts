import Player from "../Player/player.model.js";
import Tournament from "../Tournament/tournament.model.js";
import { createID } from "../Utils/utils.js";
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
  const tournament = await Tournament.find({ id: match[0].tournament });

  switch (typo) {
    case "AssistA":
      if (action == "Update") {
        match[0].assistersA.push(player!);
        playerR[0].assists++;

        if (tournament[0].assisters.some((p) => p.player == player)) {
          const assisterIndex = tournament[0].assisters.findIndex(
            (p) => p.player == player,
          );
          tournament[0].assisters[assisterIndex].assists++;
        } else {
          tournament[0].assisters.push({
            team: playerR[0].team,
            player: playerR[0].id,
            assists: 1,
          });
        }
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

        if (
          tournament[0].assisters.some(
            (p) => p.player == player && p.assists > 1,
          )
        ) {
          const assisterIndex = tournament[0].assisters.findIndex(
            (p) => p.player == player,
          );
          tournament[0].assisters[assisterIndex].assists--;
        } else if (
          tournament[0].assisters.some(
            (p) => p.player == player && p.assists == 1,
          )
        ) {
          tournament[0].assisters = tournament[0].assisters.filter(
            (p) => p.player !== player,
          );
        }
      }
      tournament[0].assisters = tournament[0].assisters.sort(
        (a, b) => b.assists - a.assists,
      );
      break;
    case "AssistB":
      if (action == "Update") {
        match[0].assistersB.push(player!);
        playerR[0].assists++;

        if (tournament[0].assisters.some((p) => p.player == player)) {
          const assisterIndex = tournament[0].assisters.findIndex(
            (p) => p.player == player,
          );
          tournament[0].assisters[assisterIndex].assists++;
        } else {
          tournament[0].assisters.push({
            team: playerR[0].team,
            player: playerR[0].id,
            assists: 1,
          });
        }
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

        if (
          tournament[0].assisters.some(
            (p) => p.player == player && p.assists > 1,
          )
        ) {
          const assisterIndex = tournament[0].assisters.findIndex(
            (p) => p.player == player,
          );
          tournament[0].assisters[assisterIndex].assists--;
        } else if (
          tournament[0].assisters.some(
            (p) => p.player == player && p.assists == 1,
          )
        ) {
          tournament[0].assisters = tournament[0].assisters.filter(
            (p) => p.player !== player,
          );
        }
      }

      tournament[0].assisters = tournament[0].assisters.sort(
        (a, b) => b.assists - a.assists,
      );
      break;
    case "GoalA":
      if (action == "Update") {
        match[0].scorersA.push(player!);
        playerR[0].goals++;

        if (tournament[0].goalscorers.some((p) => p.player == player)) {
          const scorersIndex = tournament[0].goalscorers.findIndex(
            (p) => p.player == player,
          );
          tournament[0].goalscorers[scorersIndex].goals++;
        } else {
          tournament[0].goalscorers.push({
            team: playerR[0].team,
            player: playerR[0].id,
            goals: 1,
          });
        }
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

        if (
          tournament[0].goalscorers.some(
            (p) => p.player == player && p.goals > 1,
          )
        ) {
          const goalscorerIndex = tournament[0].goalscorers.findIndex(
            (p) => p.player == player,
          );
          tournament[0].goalscorers[goalscorerIndex].goals--;
        } else if (
          tournament[0].goalscorers.some(
            (p) => p.player == player && p.goals == 1,
          )
        ) {
          tournament[0].goalscorers = tournament[0].goalscorers.filter(
            (p) => p.player !== player,
          );
        }
      }
      tournament[0].goalscorers = tournament[0].goalscorers.sort(
        (a, b) => b.goals - a.goals,
      );

      break;
    case "GoalB":
      if (action == "Update") {
        match[0].scorersB.push(player!);
        playerR[0].goals++;

        if (tournament[0].goalscorers.some((p) => p.player == player)) {
          const scorersIndex = tournament[0].goalscorers.findIndex(
            (p) => p.player == player,
          );
          tournament[0].goalscorers[scorersIndex].goals++;
        } else {
          tournament[0].goalscorers.push({
            team: playerR[0].team,
            player: playerR[0].id,
            goals: 1,
          });
        }
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

        if (
          tournament[0].goalscorers.some(
            (p) => p.player == player && p.goals > 1,
          )
        ) {
          const goalscorerIndex = tournament[0].goalscorers.findIndex(
            (p) => p.player == player,
          );
          tournament[0].goalscorers[goalscorerIndex].goals--;
        } else if (
          tournament[0].goalscorers.some(
            (p) => p.player == player && p.goals == 1,
          )
        ) {
          tournament[0].goalscorers = tournament[0].goalscorers.filter(
            (p) => p.player !== player,
          );
        }
      }
      tournament[0].goalscorers = tournament[0].goalscorers.sort(
        (a, b) => b.goals - a.goals,
      );
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
          match[0].yellowPlayersA.push(player!);
          match[0].yellowCards++;
          playerR[0].yellowCards++;
        } else {
          match[0].yellowPlayersA.push(player!);
          match[0].yellowCards++;
          playerR[0].yellowCards++;
        }

        if (
          tournament[0].playerWithMostYellowCards.some(
            (p) => p.player == player,
          )
        ) {
          const mostYellowCIndex =
            tournament[0].playerWithMostYellowCards.findIndex(
              (p) => p.player == player,
            );

          tournament[0].playerWithMostYellowCards[mostYellowCIndex]
            .yellowCards++;
        } else {
          tournament[0].playerWithMostYellowCards.push({
            team: playerR[0].team,
            player: playerR[0].id,
            yellowCards: 1,
          });
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

          // delete the second yellow card too
          GA = match[0].yellowPlayersA.filter((scorer) => {
            return scorer == player;
          });
          GA_ = match[0].yellowPlayersA.filter((scorer) => {
            return scorer !== player;
          });
          GA.pop();
          GA = GA.concat(GA_);

          match[0].yellowPlayersA = GA;
          match[0].yellowCards--;
          playerR[0].yellowCards--;
        } else {
          GA = match[0].yellowPlayersA.filter((p) => {
            return p !== player;
          });
          match[0].yellowPlayersA = GA;
          match[0].yellowCards--;
          playerR[0].yellowCards--;
        }

        if (
          tournament[0].playerWithMostYellowCards.some(
            (p) => p.player == player && p.yellowCards > 1,
          )
        ) {
          const playerYellowIndex = tournament[0].goalscorers.findIndex(
            (p) => p.player == player,
          );
          tournament[0].playerWithMostYellowCards[playerYellowIndex]
            .yellowCards--;
        } else if (
          tournament[0].playerWithMostYellowCards.some(
            (p) => p.player == player && p.yellowCards == 1,
          )
        ) {
          tournament[0].playerWithMostYellowCards =
            tournament[0].playerWithMostYellowCards.filter(
              (p) => p.player !== player,
            );
        }
      }

      tournament[0].playerWithMostYellowCards =
        tournament[0].playerWithMostYellowCards.sort(
          (a, b) => b.yellowCards - a.yellowCards,
        );

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
          match[0].yellowPlayersB.push(player!);
          match[0].yellowCards++;
          playerR[0].yellowCards++;
        } else {
          match[0].yellowPlayersB.push(player!);
          match[0].yellowCards++;
          playerR[0].yellowCards++;
        }

        if (
          tournament[0].playerWithMostYellowCards.some(
            (p) => p.player == player,
          )
        ) {
          const mostYellowCIndex =
            tournament[0].playerWithMostYellowCards.findIndex(
              (p) => p.player == player,
            );

          tournament[0].playerWithMostYellowCards[mostYellowCIndex]
            .yellowCards++;
        } else {
          tournament[0].playerWithMostYellowCards.push({
            team: playerR[0].team,
            player: playerR[0].id,
            yellowCards: 1,
          });
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

          // delete the second yellow card too
          GA = match[0].yellowPlayersB.filter((scorer) => {
            return scorer == player;
          });
          GA_ = match[0].yellowPlayersB.filter((scorer) => {
            return scorer !== player;
          });
          GA.pop();
          GA = GA.concat(GA_);

          match[0].yellowPlayersB = GA;
          match[0].yellowCards--;
          playerR[0].yellowCards--;
        } else {
          GA = match[0].yellowPlayersB.filter((p) => {
            return p !== player;
          });

          match[0].yellowPlayersB = GA;
          match[0].yellowCards--;
          playerR[0].yellowCards--;
        }

        if (
          tournament[0].playerWithMostYellowCards.some(
            (p) => p.player == player && p.yellowCards > 1,
          )
        ) {
          const playerYellowIndex = tournament[0].goalscorers.findIndex(
            (p) => p.player == player,
          );
          tournament[0].playerWithMostYellowCards[playerYellowIndex]
            .yellowCards--;
        } else if (
          tournament[0].playerWithMostYellowCards.some(
            (p) => p.player == player && p.yellowCards == 1,
          )
        ) {
          tournament[0].playerWithMostYellowCards =
            tournament[0].playerWithMostYellowCards.filter(
              (p) => p.player !== player,
            );
        }
      }

      tournament[0].playerWithMostYellowCards =
        tournament[0].playerWithMostYellowCards.sort(
          (a, b) => b.yellowCards - a.yellowCards,
        );

      break;
    case "SubstitutionA":
      const playerSOIndexA = match[0].finalFormacionA?.starters.findIndex(
        (pl) => {
          return pl == player;
        },
      );
      const playerSOIndexA2 = match[0].finalFormacionA?.subPlayers.findIndex(
        (pl) => {
          return pl == player2;
        },
      );
      if (playerSOIndexA !== -1 && playerSOIndexA !== undefined) {
        match[0].finalFormacionA!.starters[playerSOIndexA] = player2!;
      }
      if (playerSOIndexA2 !== -1 && playerSOIndexA2 !== undefined) {
        match[0].finalFormacionA!.subPlayers[playerSOIndexA2] = player!;
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
      const playerSOIndexB = match[0].finalFormacionB?.starters.findIndex(
        (pl) => {
          return pl == player;
        },
      );
      const playerSOIndexB2 = match[0].finalFormacionB?.subPlayers.findIndex(
        (pl) => {
          return pl == player2;
        },
      );
      if (playerSOIndexB !== -1 && playerSOIndexB !== undefined) {
        match[0].finalFormacionB!.starters[playerSOIndexB] = player2!;
      }
      if (playerSOIndexB2 !== -1 && playerSOIndexB2 !== undefined) {
        match[0].finalFormacionB!.subPlayers[playerSOIndexB2] = player!;
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

    case "FaultA":
      if (action == "Update") {
        match[0].faultsA++;
        console.log(match[0].faultsA, match[0].faultsA++);
      } else if (action == "Delete") {
        match[0].faultsA--;
      }

      break;
    case "FaultB":
      if (action == "Update") {
        match[0].faultsB++;
      } else if (action == "Delete") {
        match[0].faultsB--;
      }

      break;
    case "Start":
      if (action == "Update") {
        match[0].status = "En vivo";
        playerR[0].gamesPlayed++;
        playerR[0].starterGames++;
      } else if (action == "Delete") {
        match[0].status = "Programado";
        playerR[0].gamesPlayed--;
        playerR[0].starterGames--;
      }

      break;

    case "Start2":
      if (action == "Update") {
        match[0].status = "En vivo";
      } else if (action == "Delete") {
        match[0].status = "Entretiempo";
      }

      break;
    case "Penales":
      if (action == "Update") {
        match[0].status = "Penales";
      } else if (action == "Delete") {
        match[0].status = "En vivo";
      }

      break;
    case "Final":
      if (action == "Update") {
        playerR[0].minutesPlayed +=
          match[0].rules.minutesPerTime * 2 +
          match[0].extraTime! +
          match[0].extraTime2!;
        if (match[0].winner == "NA") {
          const marcador = match[0].result?.split("-");
          if (Number(marcador![0]) > Number(marcador![1])) {
            match[0].winner = "A";
          } else if (Number(marcador![1]) > Number(marcador![0])) {
            match[0].winner = "B";
          } else if (Number(marcador![0]) == Number(marcador![1])) {
            const marcadorPenales = match[0].penaltieResult?.split("-");
            if (Number(marcadorPenales![0]) > Number(marcadorPenales![1])) {
              match[0].winner = "A";
            } else if (
              Number(marcadorPenales![1]) > Number(marcadorPenales![0])
            ) {
              match[0].winner = "B";
            }
          }
        }

        match[0].status = "Finalizado";
      } else if (action == "Delete") {
        playerR[0].minutesPlayed -=
          match[0].rules.minutesPerTime * 2 +
          match[0].extraTime! +
          match[0].extraTime2!;

        match[0].status = "En vivo";
      }

      break;
    case "RestTime":
      if (action == "Update") {
        match[0].status = "Entretiempo";
      } else if (action == "Delete") {
        match[0].status = "En vivo";
      }

      break;
    case "Positions":
      const matches = await Match.find({
        tournament: match[0].tournament,
        phase: "Grupos",
        status: "Programado",
      });
      const matchesLive = await Match.find({
        tournament: match[0].tournament,
        phase: "Grupos",
        status: "En vivo",
      });

      const matchesEntretiempo = await Match.find({
        tournament: match[0].tournament,
        phase: "Grupos",
        status: "Entretiempo",
      });

      const matchesPenales = await Match.find({
        tournament: match[0].tournament,
        phase: "Grupos",
        status: "Penales",
      });
      const marcador = match[0].result?.split("-");

      if (match[0].phase == "Grupos") {
        let teamInGroupIndex, teamInGroupIndexB;

        // getting  the index of the team in the group to update stats

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

        // change the stats after the end of the game

        if (Number(marcador![0]) > Number(marcador![1])) {
          // team A wins
          //games won
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndex
          ].gamesWon++;
          //points
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndex
          ].points += 3;
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndexB
          ].gamesLost++;
        } else if (Number(marcador![0]) < Number(marcador![1])) {
          // change the stats after the end of the game
          // team B wins
          //games won
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndexB
          ].gamesWon++;
          //points
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndexB
          ].points += 3;
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndex
          ].gamesLost++;
        } else if (Number(marcador![0]) == Number(marcador![1])) {
          // change the stats after the end of the game
          // draw, check the penaltie result to see who won the game
          const marcadorPenales = match[0].penaltieResult;
          if (marcadorPenales!.split("-")[0] > marcadorPenales!.split("-")[1]) {
            //games won
            tournament[0].boardGroups[Number(match[0].order) - 1][
              teamInGroupIndex
            ].gamesWon++;
            //points
            tournament[0].boardGroups[Number(match[0].order) - 1][
              teamInGroupIndex
            ].points += 3;
            tournament[0].boardGroups[Number(match[0].order) - 1][
              teamInGroupIndexB
            ].gamesLost++;
          } else if (
            marcadorPenales!.split("-")[0] < marcadorPenales!.split("-")[1]
          ) {
            //games won
            tournament[0].boardGroups[Number(match[0].order) - 1][
              teamInGroupIndexB
            ].gamesWon++;
            //points
            tournament[0].boardGroups[Number(match[0].order) - 1][
              teamInGroupIndexB
            ].points += 3;
            tournament[0].boardGroups[Number(match[0].order) - 1][
              teamInGroupIndex
            ].gamesLost++;
          }
        }
        // team A
        // games played
        tournament[0].boardGroups[Number(match[0].order) - 1][teamInGroupIndex]
          .gamesPlayed++;
        // goals done
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndex
        ].goalsP += Number(marcador![0]);
        // goals against
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndex
        ].goalsC += Number(marcador![1]);
        //goal difference
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndex
        ].goalDifference =
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndex
          ].goalsP -
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndex
          ].goalsC;

        // yellow cards
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndex
        ].yellowCards = match[0].yellowPlayersA.length;

        // red cards
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndex
        ].redCards = match[0].redPlayersA.length;

        // team B
        // games played
        tournament[0].boardGroups[Number(match[0].order) - 1][teamInGroupIndexB]
          .gamesPlayed++;
        // goals done
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndexB
        ].goalsP += Number(marcador![1]);
        // goals against
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndexB
        ].goalsC += Number(marcador![0]);
        //goal difference
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndexB
        ].goalDifference =
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndexB
          ].goalsP -
          tournament[0].boardGroups[Number(match[0].order) - 1][
            teamInGroupIndexB
          ].goalsC;

        // yellow cards
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndexB
        ].yellowCards = match[0].yellowPlayersB.length;

        // red cards
        tournament[0].boardGroups[Number(match[0].order) - 1][
          teamInGroupIndexB
        ].redCards = match[0].redPlayersB.length;

        const sortedGroups = tournament[0].boardGroups[
          Number(match[0].order) - 1
        ].sort((a, b) => {
          if (b.points - a.points == 0) {
            return b.goalDifference - a.goalDifference;
          } else {
            return b.points - a.points;
          }
        });

        tournament[0].boardGroups[Number(match[0].order) - 1] = sortedGroups;

        tournament[0].markModified("boardGroups");
        tournament[0].save();

        // pass the next round
        if (
          matches.length == 0 &&
          matchesLive.length == 0 &&
          matchesEntretiempo.length == 0 &&
          matchesPenales.length == 0
        ) {
          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              8 &&
            match[0].nextRound == "Repechaje | Knockout"
          ) {
            const semifinal1 = await Match.find({
              phase: "Semifinal",
              teamA: "1A",
              tournament: tournament[0].id,
            });
            const semifinal2 = await Match.find({
              phase: "Semifinal",
              teamA: "1B",
              tournament: tournament[0].id,
            });
            const repechaje1 = await Match.find({
              phase: "Repechaje",
              teamA: "3A",
              tournament: tournament[0].id,
            });
            const repechaje2 = await Match.find({
              phase: "Repechaje",
              teamA: "3B",
              tournament: tournament[0].id,
            });

            // team A
            semifinal1[0].teamA = tournament[0].boardGroups[0][0].team;
            semifinal2[0].teamA = tournament[0].boardGroups[1][0].team;
            repechaje1[0].teamA = tournament[0].boardGroups[0][2].team;
            repechaje2[0].teamA = tournament[0].boardGroups[1][2].team;

            // team B

            semifinal1[0].teamB = tournament[0].boardGroups[1][1].team;
            semifinal2[0].teamB = tournament[0].boardGroups[0][1].team;
            repechaje1[0].teamB = tournament[0].boardGroups[0][3].team;
            repechaje2[0].teamB = tournament[0].boardGroups[1][3].team;

            await Match.updateOne(
              { id: semifinal1[0].id },
              { $set: semifinal1[0] },
            );
            await Match.updateOne(
              { id: semifinal2[0].id },
              { $set: semifinal2[0] },
            );
            await Match.updateOne(
              { id: repechaje1[0].id },
              { $set: repechaje1[0] },
            );
            await Match.updateOne(
              { id: repechaje2[0].id },
              { $set: repechaje2[0] },
            );
          }
          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              12 &&
            tournament[0].numberTeamsPerGroup == 4 &&
            match[0].nextRound == "Repechaje | Knockout"
          ) {
            let tabla = [
              tournament[0].boardGroups[0][0],
              tournament[0].boardGroups[0][1],
              tournament[0].boardGroups[1][0],
              tournament[0].boardGroups[1][1],
              tournament[0].boardGroups[2][0],
              tournament[0].boardGroups[2][1],
            ];
            tabla = tabla.sort((a, b) => {
              if (b.points - a.points == 0) {
                return b.goalDifference - a.goalDifference;
              }
              return b.points - a.points;
            });
            const ps1 = await Match.find({
              phase: "Pre-semifinal",
              teamA: "3",
              tournament: tournament[0].id,
            });
            const ps2 = await Match.find({
              phase: "Pre-semifinal",
              teamA: "5",
              tournament: tournament[0].id,
            });
            const sf1 = await Match.find({
              phase: "Semifinal",
              teamA: "1",
              tournament: tournament[0].id,
            });
            const sf2 = await Match.find({
              phase: "Semifinal",
              teamA: "2",
              tournament: tournament[0].id,
            });
            const repechaje1 = await Match.find({
              phase: "Repechaje",
              teamA: "3A",
              tournament: tournament[0].id,
            });
            const repechaje2 = await Match.find({
              phase: "Repechaje",
              teamA: "3B",
              tournament: tournament[0].id,
            });
            const repechaje3 = await Match.find({
              phase: "Repechaje",
              teamA: "3C",
              tournament: tournament[0].id,
            });

            // team A

            sf1[0].teamA = tabla[0].team;
            sf2[0].teamA = tabla[1].team;
            ps1[0].teamA = tabla[2].team;
            ps2[0].teamA = tabla[4].team;
            repechaje1[0].teamA = tournament[0].boardGroups[0][2].team;
            repechaje2[0].teamA = tournament[0].boardGroups[1][2].team;
            repechaje3[0].teamA = tournament[0].boardGroups[2][2].team;

            // team B

            ps1[0].teamB = tabla[3].team;
            ps2[0].teamB = tabla[5].team;
            repechaje1[0].teamB = tournament[0].boardGroups[0][3].team;
            repechaje2[0].teamB = tournament[0].boardGroups[1][3].team;
            repechaje3[0].teamB = tournament[0].boardGroups[2][3].team;

            await Match.updateOne({ id: sf1[0].id }, { $set: sf1[0] });
            await Match.updateOne({ id: sf2[0].id }, { $set: sf2[0] });
            await Match.updateOne(
              { id: repechaje1[0].id },
              { $set: repechaje1[0] },
            );
            await Match.updateOne(
              { id: repechaje2[0].id },
              { $set: repechaje2[0] },
            );
            await Match.updateOne(
              { id: repechaje3[0].id },
              { $set: repechaje3[0] },
            );
            await Match.updateOne({ id: ps1[0].id }, { $set: ps1[0] });
            await Match.updateOne({ id: ps2[0].id }, { $set: ps2[0] });
          }

          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              16 &&
            match[0].nextRound == "Repechaje | Knockout"
          ) {
            const cf1 = await Match.find({
              phase: "Cuartos de final",
              teamA: "1A",
              tournament: tournament[0].id,
            });
            const cf2 = await Match.find({
              phase: "Cuartos de final",
              teamA: "1B",
              tournament: tournament[0].id,
            });
            const cf3 = await Match.find({
              phase: "Cuartos de final",
              teamA: "1D",
              tournament: tournament[0].id,
            });
            const cf4 = await Match.find({
              phase: "Cuartos de final",
              teamA: "1C",
              tournament: tournament[0].id,
            });
            const repechaje1 = await Match.find({
              phase: "Repechaje",
              teamA: "3A",
              tournament: tournament[0].id,
            });
            const repechaje2 = await Match.find({
              phase: "Repechaje",
              teamA: "3B",
              tournament: tournament[0].id,
            });
            const repechaje3 = await Match.find({
              phase: "Repechaje",
              teamA: "3C",
              tournament: tournament[0].id,
            });
            const repechaje4 = await Match.find({
              phase: "Repechaje",
              teamA: "3D",
              tournament: tournament[0].id,
            });

            // team A
            cf1[0].teamA = tournament[0].boardGroups[0][0].team;
            cf2[0].teamA = tournament[0].boardGroups[1][0].team;
            cf3[0].teamA = tournament[0].boardGroups[2][0].team;
            cf4[0].teamA = tournament[0].boardGroups[3][0].team;
            repechaje1[0].teamA = tournament[0].boardGroups[0][2].team;
            repechaje2[0].teamA = tournament[0].boardGroups[1][2].team;
            repechaje3[0].teamA = tournament[0].boardGroups[2][2].team;
            repechaje4[0].teamA = tournament[0].boardGroups[3][2].team;

            // team B

            cf1[0].teamB = tournament[0].boardGroups[2][1].team;
            cf2[0].teamB = tournament[0].boardGroups[3][1].team;
            cf3[0].teamB = tournament[0].boardGroups[1][1].team;
            cf4[0].teamB = tournament[0].boardGroups[0][1].team;
            repechaje1[0].teamB = tournament[0].boardGroups[0][3].team;
            repechaje2[0].teamB = tournament[0].boardGroups[1][3].team;
            repechaje3[0].teamB = tournament[0].boardGroups[2][3].team;
            repechaje4[0].teamB = tournament[0].boardGroups[3][3].team;

            await Match.updateOne({ id: cf1[0].id }, { $set: cf1[0] });
            await Match.updateOne({ id: cf2[0].id }, { $set: cf2[0] });
            await Match.updateOne({ id: cf3[0].id }, { $set: cf3[0] });
            await Match.updateOne({ id: cf4[0].id }, { $set: cf4[0] });
            await Match.updateOne(
              { id: repechaje1[0].id },
              { $set: repechaje1[0] },
            );
            await Match.updateOne(
              { id: repechaje2[0].id },
              { $set: repechaje2[0] },
            );
            await Match.updateOne(
              { id: repechaje3[0].id },
              { $set: repechaje3[0] },
            );
            await Match.updateOne(
              { id: repechaje4[0].id },
              { $set: repechaje4[0] },
            );
          }
          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              20 &&
            tournament[0].numberTeamsPerGroup == 4 &&
            match[0].nextRound == "Repechaje | Knockout"
          ) {
            let tabla = [
              tournament[0].boardGroups[0][0],
              tournament[0].boardGroups[0][1],
              tournament[0].boardGroups[1][0],
              tournament[0].boardGroups[1][1],
              tournament[0].boardGroups[2][0],
              tournament[0].boardGroups[2][1],
              tournament[0].boardGroups[3][0],
              tournament[0].boardGroups[3][1],
              tournament[0].boardGroups[4][0],
              tournament[0].boardGroups[4][1],
            ];
            tabla = tabla.sort((a, b) => {
              if (b.points - a.points == 0) {
                return b.goalDifference - a.goalDifference;
              }
              return b.points - a.points;
            });
            const pc1 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "7",
              tournament: tournament[0].id,
            });
            const pc2 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "9",
              tournament: tournament[0].id,
            });
            const cf1 = await Match.find({
              phase: "Cuartos de final",
              teamA: "1",
              tournament: tournament[0].id,
            });
            const cf2 = await Match.find({
              phase: "Cuartos de final",
              teamA: "3",
              tournament: tournament[0].id,
            });
            const cf3 = await Match.find({
              phase: "Cuartos de final",
              teamA: "5",
              tournament: tournament[0].id,
            });

            const repechaje1 = await Match.find({
              phase: "Repechaje",
              teamA: "3A",
              tournament: tournament[0].id,
            });
            const repechaje2 = await Match.find({
              phase: "Repechaje",
              teamA: "3B",
              tournament: tournament[0].id,
            });
            const repechaje3 = await Match.find({
              phase: "Repechaje",
              teamA: "3C",
              tournament: tournament[0].id,
            });
            const repechaje4 = await Match.find({
              phase: "Repechaje",
              teamA: "3D",
              tournament: tournament[0].id,
            });
            const repechaje5 = await Match.find({
              phase: "Repechaje",
              teamA: "3E",
              tournament: tournament[0].id,
            });

            // team A
            cf1[0].teamA = tabla[0].team;
            cf2[0].teamA = tabla[2].team;
            cf3[0].teamA = tabla[4].team;
            pc1[0].teamA = tabla[6].team;
            pc2[0].teamA = tabla[8].team;
            repechaje1[0].teamA = tournament[0].boardGroups[0][2].team;
            repechaje2[0].teamA = tournament[0].boardGroups[1][2].team;
            repechaje3[0].teamA = tournament[0].boardGroups[2][2].team;
            repechaje4[0].teamA = tournament[0].boardGroups[3][2].team;
            repechaje5[0].teamA = tournament[0].boardGroups[4][2].team;

            // team B

            cf1[0].teamB = tabla[1].team;
            cf2[0].teamB = tabla[3].team;
            cf3[0].teamB = tabla[5].team;
            pc1[0].teamB = tabla[7].team;
            pc2[0].teamB = tabla[9].team;
            repechaje1[0].teamB = tournament[0].boardGroups[0][3].team;
            repechaje2[0].teamB = tournament[0].boardGroups[1][3].team;
            repechaje3[0].teamB = tournament[0].boardGroups[2][3].team;
            repechaje4[0].teamB = tournament[0].boardGroups[3][3].team;
            repechaje5[0].teamB = tournament[0].boardGroups[4][3].team;

            await Match.updateOne({ id: cf1[0].id }, { $set: cf1[0] });
            await Match.updateOne({ id: cf2[0].id }, { $set: cf2[0] });
            await Match.updateOne({ id: cf3[0].id }, { $set: cf3[0] });
            await Match.updateOne({ id: pc1[0].id }, { $set: pc1[0] });
            await Match.updateOne({ id: pc2[0].id }, { $set: pc2[0] });

            await Match.updateOne(
              { id: repechaje1[0].id },
              { $set: repechaje1[0] },
            );
            await Match.updateOne(
              { id: repechaje2[0].id },
              { $set: repechaje2[0] },
            );
            await Match.updateOne(
              { id: repechaje3[0].id },
              { $set: repechaje3[0] },
            );
            await Match.updateOne(
              { id: repechaje4[0].id },
              { $set: repechaje4[0] },
            );
            await Match.updateOne(
              { id: repechaje5[0].id },
              { $set: repechaje5[0] },
            );
          }

          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              24 &&
            tournament[0].numberTeamsPerGroup == 4 &&
            match[0].nextRound == "Repechaje | Knockout"
          ) {
            let tabla = [
              tournament[0].boardGroups[0][0],
              tournament[0].boardGroups[0][1],
              tournament[0].boardGroups[1][0],
              tournament[0].boardGroups[1][1],
              tournament[0].boardGroups[2][0],
              tournament[0].boardGroups[2][1],
              tournament[0].boardGroups[3][0],
              tournament[0].boardGroups[3][1],
              tournament[0].boardGroups[4][0],
              tournament[0].boardGroups[4][1],
              tournament[0].boardGroups[5][0],
              tournament[0].boardGroups[5][1],
            ];
            tabla = tabla.sort((a, b) => {
              if (b.points - a.points == 0) {
                return b.goalDifference - a.goalDifference;
              }
              return b.points - a.points;
            });
            const pc1 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "5",
              tournament: tournament[0].id,
            });
            const pc2 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "7",
              tournament: tournament[0].id,
            });
            const pc3 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "9",
              tournament: tournament[0].id,
            });
            const pc4 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "11",
              tournament: tournament[0].id,
            });
            const cf1 = await Match.find({
              phase: "Cuartos de final",
              teamA: "1",
              tournament: tournament[0].id,
            });
            const cf2 = await Match.find({
              phase: "Cuartos de final",
              teamA: "3",
              tournament: tournament[0].id,
            });

            const repechaje1 = await Match.find({
              phase: "Repechaje",
              teamA: "3A",
              tournament: tournament[0].id,
            });
            const repechaje2 = await Match.find({
              phase: "Repechaje",
              teamA: "3B",
              tournament: tournament[0].id,
            });
            const repechaje3 = await Match.find({
              phase: "Repechaje",
              teamA: "3C",
              tournament: tournament[0].id,
            });
            const repechaje4 = await Match.find({
              phase: "Repechaje",
              teamA: "3D",
              tournament: tournament[0].id,
            });
            const repechaje5 = await Match.find({
              phase: "Repechaje",
              teamA: "3E",
              tournament: tournament[0].id,
            });
            const repechaje6 = await Match.find({
              phase: "Repechaje",
              teamA: "3F",
              tournament: tournament[0].id,
            });

            // team A
            pc1[0].teamA = tabla[4].team;
            pc2[0].teamA = tabla[6].team;
            pc3[0].teamA = tabla[8].team;
            pc4[0].teamA = tabla[10].team;
            cf1[0].teamA = tabla[0].team;
            cf2[0].teamA = tabla[2].team;
            repechaje1[0].teamA = tournament[0].boardGroups[0][2].team;
            repechaje2[0].teamA = tournament[0].boardGroups[1][2].team;
            repechaje3[0].teamA = tournament[0].boardGroups[2][2].team;
            repechaje4[0].teamA = tournament[0].boardGroups[3][2].team;
            repechaje5[0].teamA = tournament[0].boardGroups[4][2].team;
            repechaje6[0].teamA = tournament[0].boardGroups[5][2].team;

            // team B

            pc1[0].teamB = tabla[5].team;
            pc2[0].teamB = tabla[7].team;
            pc3[0].teamB = tabla[9].team;
            pc4[0].teamB = tabla[11].team;
            cf1[0].teamB = tabla[1].team;
            cf2[0].teamB = tabla[3].team;
            repechaje1[0].teamB = tournament[0].boardGroups[0][3].team;
            repechaje2[0].teamB = tournament[0].boardGroups[1][3].team;
            repechaje3[0].teamB = tournament[0].boardGroups[2][3].team;
            repechaje4[0].teamB = tournament[0].boardGroups[3][3].team;
            repechaje5[0].teamB = tournament[0].boardGroups[4][3].team;
            repechaje6[0].teamB = tournament[0].boardGroups[5][3].team;

            await Match.updateOne({ id: cf1[0].id }, { $set: cf1[0] });
            await Match.updateOne({ id: cf2[0].id }, { $set: cf2[0] });
            await Match.updateOne({ id: pc1[0].id }, { $set: pc1[0] });
            await Match.updateOne({ id: pc2[0].id }, { $set: pc2[0] });
            await Match.updateOne({ id: pc3[0].id }, { $set: pc3[0] });
            await Match.updateOne({ id: pc4[0].id }, { $set: pc4[0] });

            await Match.updateOne(
              { id: repechaje1[0].id },
              { $set: repechaje1[0] },
            );
            await Match.updateOne(
              { id: repechaje2[0].id },
              { $set: repechaje2[0] },
            );
            await Match.updateOne(
              { id: repechaje3[0].id },
              { $set: repechaje3[0] },
            );
            await Match.updateOne(
              { id: repechaje4[0].id },
              { $set: repechaje4[0] },
            );
            await Match.updateOne(
              { id: repechaje5[0].id },
              { $set: repechaje5[0] },
            );
          }

          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              28 &&
            tournament[0].numberTeamsPerGroup == 4 &&
            match[0].nextRound == "Repechaje | Knockout"
          ) {
            let tabla = [
              tournament[0].boardGroups[0][0],
              tournament[0].boardGroups[0][1],
              tournament[0].boardGroups[1][0],
              tournament[0].boardGroups[1][1],
              tournament[0].boardGroups[2][0],
              tournament[0].boardGroups[2][1],
              tournament[0].boardGroups[3][0],
              tournament[0].boardGroups[3][1],
              tournament[0].boardGroups[4][0],
              tournament[0].boardGroups[4][1],
              tournament[0].boardGroups[5][0],
              tournament[0].boardGroups[5][1],
              tournament[0].boardGroups[6][0],
              tournament[0].boardGroups[6][1],
            ];
            tabla = tabla.sort((a, b) => {
              if (b.points - a.points == 0) {
                return b.goalDifference - a.goalDifference;
              }
              return b.points - a.points;
            });
            const pc1 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "3",
              tournament: tournament[0].id,
            });
            const pc2 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "5",
              tournament: tournament[0].id,
            });
            const pc3 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "7",
              tournament: tournament[0].id,
            });
            const pc4 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "9",
              tournament: tournament[0].id,
            });
            const pc5 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "11",
              tournament: tournament[0].id,
            });
            const pc6 = await Match.find({
              phase: "Pre-cuartos",
              teamA: "13",
              tournament: tournament[0].id,
            });
            const cf1 = await Match.find({
              phase: "Cuartos de final",
              teamA: "1",
              tournament: tournament[0].id,
            });

            const repechaje1 = await Match.find({
              phase: "Repechaje",
              teamA: "3A",
              tournament: tournament[0].id,
            });
            const repechaje2 = await Match.find({
              phase: "Repechaje",
              teamA: "3B",
              tournament: tournament[0].id,
            });
            const repechaje3 = await Match.find({
              phase: "Repechaje",
              teamA: "3C",
              tournament: tournament[0].id,
            });
            const repechaje4 = await Match.find({
              phase: "Repechaje",
              teamA: "3D",
              tournament: tournament[0].id,
            });
            const repechaje5 = await Match.find({
              phase: "Repechaje",
              teamA: "3E",
              tournament: tournament[0].id,
            });
            const repechaje6 = await Match.find({
              phase: "Repechaje",
              teamA: "3F",
              tournament: tournament[0].id,
            });
            const repechaje7 = await Match.find({
              phase: "Repechaje",
              teamA: "3G",
              tournament: tournament[0].id,
            });

            // team A
            pc1[0].teamA = tabla[2].team;
            pc2[0].teamA = tabla[4].team;
            pc3[0].teamA = tabla[6].team;
            pc4[0].teamA = tabla[8].team;
            pc5[0].teamA = tabla[10].team;
            pc6[0].teamA = tabla[12].team;
            cf1[0].teamA = tabla[0].team;

            repechaje1[0].teamA = tournament[0].boardGroups[0][2].team;
            repechaje2[0].teamA = tournament[0].boardGroups[1][2].team;
            repechaje3[0].teamA = tournament[0].boardGroups[2][2].team;
            repechaje4[0].teamA = tournament[0].boardGroups[3][2].team;
            repechaje5[0].teamA = tournament[0].boardGroups[4][2].team;
            repechaje6[0].teamA = tournament[0].boardGroups[5][2].team;
            repechaje7[0].teamA = tournament[0].boardGroups[6][2].team;
            // team B

            pc1[0].teamB = tabla[3].team;
            pc2[0].teamB = tabla[5].team;
            pc3[0].teamB = tabla[7].team;
            pc4[0].teamB = tabla[9].team;
            pc5[0].teamB = tabla[11].team;
            pc6[0].teamB = tabla[13].team;
            cf1[0].teamB = tabla[1].team;

            repechaje1[0].teamB = tournament[0].boardGroups[0][3].team;
            repechaje2[0].teamB = tournament[0].boardGroups[1][3].team;
            repechaje3[0].teamB = tournament[0].boardGroups[2][3].team;
            repechaje4[0].teamB = tournament[0].boardGroups[3][3].team;
            repechaje5[0].teamB = tournament[0].boardGroups[4][3].team;
            repechaje6[0].teamB = tournament[0].boardGroups[5][3].team;
            repechaje7[0].teamB = tournament[0].boardGroups[6][3].team;

            await Match.updateOne({ id: cf1[0].id }, { $set: cf1[0] });
            await Match.updateOne({ id: pc1[0].id }, { $set: pc1[0] });
            await Match.updateOne({ id: pc2[0].id }, { $set: pc2[0] });
            await Match.updateOne({ id: pc3[0].id }, { $set: pc3[0] });
            await Match.updateOne({ id: pc4[0].id }, { $set: pc4[0] });
            await Match.updateOne({ id: pc5[0].id }, { $set: pc5[0] });
            await Match.updateOne({ id: pc6[0].id }, { $set: pc6[0] });

            await Match.updateOne(
              { id: repechaje1[0].id },
              { $set: repechaje1[0] },
            );
            await Match.updateOne(
              { id: repechaje2[0].id },
              { $set: repechaje2[0] },
            );
            await Match.updateOne(
              { id: repechaje3[0].id },
              { $set: repechaje3[0] },
            );
            await Match.updateOne(
              { id: repechaje4[0].id },
              { $set: repechaje4[0] },
            );
            await Match.updateOne(
              { id: repechaje5[0].id },
              { $set: repechaje5[0] },
            );
          }
          if (
            tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
              32 &&
            tournament[0].numberTeamsPerGroup == 4 &&
            match[0].nextRound == "Repechaje | Knockout"
          ) {
            const of1 = await Match.find({
              phase: "Octavos de final",
              teamA: "1A",
              tournament: tournament[0].id,
            });
            const of2 = await Match.find({
              phase: "Octavos de final",
              teamA: "1E",
              tournament: tournament[0].id,
            });
            const of3 = await Match.find({
              phase: "Octavos de final",
              teamA: "1G",
              tournament: tournament[0].id,
            });
            const of4 = await Match.find({
              phase: "Octavos de final",
              teamA: "1B",
              tournament: tournament[0].id,
            });
            const of5 = await Match.find({
              phase: "Octavos de final",
              teamA: "1D",
              tournament: tournament[0].id,
            });
            const of6 = await Match.find({
              phase: "Octavos de final",
              teamA: "1H",
              tournament: tournament[0].id,
            });
            const of7 = await Match.find({
              phase: "Octavos de final",
              teamA: "1F",
              tournament: tournament[0].id,
            });
            const of8 = await Match.find({
              phase: "Octavos de final",
              teamA: "1C",
              tournament: tournament[0].id,
            });

            const repechaje1 = await Match.find({
              phase: "Repechaje",
              teamA: "3A",
              tournament: tournament[0].id,
            });
            const repechaje2 = await Match.find({
              phase: "Repechaje",
              teamA: "3B",
              tournament: tournament[0].id,
            });
            const repechaje3 = await Match.find({
              phase: "Repechaje",
              teamA: "3C",
              tournament: tournament[0].id,
            });
            const repechaje4 = await Match.find({
              phase: "Repechaje",
              teamA: "3D",
              tournament: tournament[0].id,
            });
            const repechaje5 = await Match.find({
              phase: "Repechaje",
              teamA: "3E",
              tournament: tournament[0].id,
            });
            const repechaje6 = await Match.find({
              phase: "Repechaje",
              teamA: "3F",
              tournament: tournament[0].id,
            });
            const repechaje7 = await Match.find({
              phase: "Repechaje",
              teamA: "3G",
              tournament: tournament[0].id,
            });
            const repechaje8 = await Match.find({
              phase: "Repechaje",
              teamA: "3H",
              tournament: tournament[0].id,
            });

            // team A
            of1[0].teamA = tournament[0].boardGroups[0][0].team;
            of2[0].teamA = tournament[0].boardGroups[4][0].team;
            of3[0].teamA = tournament[0].boardGroups[6][0].team;
            of4[0].teamA = tournament[0].boardGroups[1][0].team;
            of5[0].teamA = tournament[0].boardGroups[3][0].team;
            of6[0].teamA = tournament[0].boardGroups[7][0].team;
            of7[0].teamA = tournament[0].boardGroups[5][0].team;
            of8[0].teamA = tournament[0].boardGroups[2][0].team;

            repechaje1[0].teamA = tournament[0].boardGroups[0][2].team;
            repechaje2[0].teamA = tournament[0].boardGroups[1][2].team;
            repechaje3[0].teamA = tournament[0].boardGroups[2][2].team;
            repechaje4[0].teamA = tournament[0].boardGroups[3][2].team;
            repechaje5[0].teamA = tournament[0].boardGroups[4][2].team;
            repechaje6[0].teamA = tournament[0].boardGroups[5][2].team;
            repechaje7[0].teamA = tournament[0].boardGroups[6][2].team;
            repechaje8[0].teamA = tournament[0].boardGroups[7][2].team;

            // team B

            of1[0].teamB = tournament[0].boardGroups[2][1].team;
            of2[0].teamB = tournament[0].boardGroups[7][1].team;
            of3[0].teamB = tournament[0].boardGroups[5][1].team;
            of4[0].teamB = tournament[0].boardGroups[3][1].team;
            of5[0].teamB = tournament[0].boardGroups[1][1].team;
            of6[0].teamB = tournament[0].boardGroups[4][1].team;
            of7[0].teamB = tournament[0].boardGroups[7][1].team;
            of8[0].teamB = tournament[0].boardGroups[0][1].team;
            repechaje1[0].teamB = tournament[0].boardGroups[0][3].team;
            repechaje2[0].teamB = tournament[0].boardGroups[1][3].team;
            repechaje3[0].teamB = tournament[0].boardGroups[2][3].team;
            repechaje4[0].teamB = tournament[0].boardGroups[3][3].team;
            repechaje5[0].teamB = tournament[0].boardGroups[4][3].team;
            repechaje6[0].teamB = tournament[0].boardGroups[5][3].team;
            repechaje7[0].teamB = tournament[0].boardGroups[6][3].team;
            repechaje8[0].teamB = tournament[0].boardGroups[7][3].team;

            await Match.updateOne({ id: of1[0].id }, { $set: of1[0] });
            await Match.updateOne({ id: of2[0].id }, { $set: of2[0] });
            await Match.updateOne({ id: of3[0].id }, { $set: of3[0] });
            await Match.updateOne({ id: of4[0].id }, { $set: of4[0] });
            await Match.updateOne({ id: of5[0].id }, { $set: of5[0] });
            await Match.updateOne({ id: of6[0].id }, { $set: of6[0] });
            await Match.updateOne({ id: of7[0].id }, { $set: of7[0] });
            await Match.updateOne({ id: of8[0].id }, { $set: of8[0] });

            await Match.updateOne(
              { id: repechaje1[0].id },
              { $set: repechaje1[0] },
            );
            await Match.updateOne(
              { id: repechaje2[0].id },
              { $set: repechaje2[0] },
            );
            await Match.updateOne(
              { id: repechaje3[0].id },
              { $set: repechaje3[0] },
            );
            await Match.updateOne(
              { id: repechaje4[0].id },
              { $set: repechaje4[0] },
            );
            await Match.updateOne(
              { id: repechaje5[0].id },
              { $set: repechaje5[0] },
            );
          }
        }
      }
      if (match[0].phase == "Octavos de final") {
        const cf1 = await Match.find({
          phase: "Cuartos de final",
          code: "CF1",
          tournament: tournament[0].id,
        });

        const cf2 = await Match.find({
          phase: "Cuartos de final",
          code: "CF2",
          tournament: tournament[0].id,
        });
        const cf3 = await Match.find({
          phase: "Cuartos de final",
          code: "CF3",
          tournament: tournament[0].id,
        });
        const cf4 = await Match.find({
          phase: "Cuartos de final",
          code: "CF4",
          tournament: tournament[0].id,
        });

        if (match[0].code == "OF1") {
          if (match[0].winner == "A") {
            cf1[0].teamA = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf1[0].teamA = match[0].teamB;
          }
        }

        if (match[0].code == "OF2") {
          if (match[0].winner == "A") {
            cf1[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf1[0].teamB = match[0].teamB;
          }
        }
        if (match[0].code == "OF3") {
          if (match[0].winner == "A") {
            cf2[0].teamA = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf2[0].teamA = match[0].teamB;
          }
        }
        if (match[0].code == "OF4") {
          if (match[0].winner == "A") {
            cf2[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf2[0].teamB = match[0].teamB;
          }
        }
        if (match[0].code == "OF5") {
          if (match[0].winner == "A") {
            cf3[0].teamA = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf3[0].teamA = match[0].teamB;
          }
        }
        if (match[0].code == "OF6") {
          if (match[0].winner == "A") {
            cf3[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf3[0].teamB = match[0].teamB;
          }
        }
        if (match[0].code == "OF7") {
          if (match[0].winner == "A") {
            cf4[0].teamA = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf4[0].teamA = match[0].teamB;
          }
        }
        if (match[0].code == "OF8") {
          if (match[0].winner == "A") {
            cf4[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            cf4[0].teamB = match[0].teamB;
          }
        }
        await Match.updateOne({ id: cf1[0].id }, { $set: cf1[0] });
        await Match.updateOne({ id: cf2[0].id }, { $set: cf2[0] });
        await Match.updateOne({ id: cf3[0].id }, { $set: cf3[0] });
        await Match.updateOne({ id: cf4[0].id }, { $set: cf4[0] });
      }
      if (match[0].phase == "Pre-cuartos") {
        if (
          tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
            20 &&
          tournament[0].numberTeamsPerGroup == 4
        ) {
          const cf4 = await Match.find({
            phase: "Cuartos de final",
            code: "CF4",
            tournament: tournament[0].id,
          });

          if (match[0].code == "PC1") {
            if (match[0].winner == "A") {
              cf4[0].teamA = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf4[0].teamA = match[0].teamB;
            }
          }

          if (match[0].code == "PC2") {
            if (match[0].winner == "A") {
              cf4[0].teamB = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf4[0].teamB = match[0].teamB;
            }
          }

          await Match.updateOne({ id: cf4[0].id }, { $set: cf4[0] });
        }
        if (
          tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
            24 &&
          tournament[0].numberTeamsPerGroup == 4
        ) {
          const cf3 = await Match.find({
            phase: "Cuartos de final",
            code: "CF3",
            tournament: tournament[0].id,
          });
          const cf4 = await Match.find({
            phase: "Cuartos de final",
            code: "CF4",
            tournament: tournament[0].id,
          });

          if (match[0].code == "PC1") {
            if (match[0].winner == "A") {
              cf3[0].teamA = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf3[0].teamA = match[0].teamB;
            }
          }

          if (match[0].code == "PC2") {
            if (match[0].winner == "A") {
              cf3[0].teamB = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf3[0].teamB = match[0].teamB;
            }
          }

          if (match[0].code == "PC3") {
            if (match[0].winner == "A") {
              cf4[0].teamA = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf4[0].teamA = match[0].teamB;
            }
          }

          if (match[0].code == "PC4") {
            if (match[0].winner == "A") {
              cf4[0].teamB = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf4[0].teamB = match[0].teamB;
            }
          }

          await Match.updateOne({ id: cf3[0].id }, { $set: cf3[0] });
          await Match.updateOne({ id: cf4[0].id }, { $set: cf4[0] });
        }

        if (
          tournament[0].numberTeamsPerGroup * tournament[0].numberGroups ==
            28 &&
          tournament[0].numberTeamsPerGroup == 4
        ) {
          const cf2 = await Match.find({
            phase: "Cuartos de final",
            code: "CF2",
            tournament: tournament[0].id,
          });
          const cf3 = await Match.find({
            phase: "Cuartos de final",
            code: "CF3",
            tournament: tournament[0].id,
          });
          const cf4 = await Match.find({
            phase: "Cuartos de final",
            code: "CF4",
            tournament: tournament[0].id,
          });

          if (match[0].code == "PC1") {
            if (match[0].winner == "A") {
              cf2[0].teamA = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf2[0].teamA = match[0].teamB;
            }
          }

          if (match[0].code == "PC2") {
            if (match[0].winner == "A") {
              cf2[0].teamB = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf2[0].teamB = match[0].teamB;
            }
          }

          if (match[0].code == "PC3") {
            if (match[0].winner == "A") {
              cf3[0].teamA = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf3[0].teamA = match[0].teamB;
            }
          }

          if (match[0].code == "PC4") {
            if (match[0].winner == "A") {
              cf3[0].teamB = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf3[0].teamB = match[0].teamB;
            }
          }

          if (match[0].code == "PC5") {
            if (match[0].winner == "A") {
              cf4[0].teamA = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf4[0].teamA = match[0].teamB;
            }
          }

          if (match[0].code == "PC6") {
            if (match[0].winner == "A") {
              cf4[0].teamB = match[0].teamA;
            } else if (match[0].winner == "B") {
              cf4[0].teamB = match[0].teamB;
            }
          }

          await Match.updateOne({ id: cf2[0].id }, { $set: cf2[0] });
          await Match.updateOne({ id: cf3[0].id }, { $set: cf3[0] });
          await Match.updateOne({ id: cf4[0].id }, { $set: cf4[0] });
        }
      }
      if (match[0].phase == "Cuartos de final") {
        const sf1 = await Match.find({
          phase: "Semifinal",
          code: "SF1",
          tournament: tournament[0].id,
        });
        const sf2 = await Match.find({
          phase: "Semifinal",
          code: "SF2",
          tournament: tournament[0].id,
        });
        if (match[0].code == "CF1") {
          if (match[0].winner == "A") {
            sf1[0].teamA = match[0].teamA;
          } else if (match[0].winner == "B") {
            sf1[0].teamA = match[0].teamB;
          }
        }

        if (match[0].code == "CF2") {
          if (match[0].winner == "A") {
            sf1[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            sf1[0].teamB = match[0].teamB;
          }
        }

        if (match[0].code == "CF3") {
          if (match[0].winner == "A") {
            sf2[0].teamA = match[0].teamA;
          } else if (match[0].winner == "B") {
            sf2[0].teamA = match[0].teamB;
          }
        }
        if (match[0].code == "CF4") {
          if (match[0].winner == "A") {
            sf2[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            sf2[0].teamB = match[0].teamB;
          }
        }

        await Match.updateOne({ id: sf1[0].id }, { $set: sf1[0] });
        await Match.updateOne({ id: sf2[0].id }, { $set: sf2[0] });
      }
      if (match[0].phase == "Pre-semifinal") {
        const sf1 = await Match.find({
          phase: "Semifinal",
          code: "SF1",
          tournament: tournament[0].id,
        });
        const sf2 = await Match.find({
          phase: "Semifinal",
          code: "SF2",
          tournament: tournament[0].id,
        });

        if (match[0].code == "PS1") {
          if (match[0].winner == "A") {
            sf1[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            sf1[0].teamB = match[0].teamB;
          }
        }

        if (match[0].code == "PS2") {
          if (match[0].winner == "A") {
            sf2[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            sf2[0].teamB = match[0].teamB;
          }
        }
        await Match.updateOne({ id: sf1[0].id }, { $set: sf1[0] });
        await Match.updateOne({ id: sf2[0].id }, { $set: sf2[0] });
      }
      if (match[0].phase == "Semifinal") {
        const final = await Match.find({
          phase: "Final",
          tournament: tournament[0].id,
        });

        if (match[0].code == "SF1") {
          if (match[0].winner == "A") {
            final[0].teamA = match[0].teamA;
          } else if (match[0].winner == "B") {
            final[0].teamA = match[0].teamB;
          }
        }

        if (match[0].code == "SF2") {
          if (match[0].winner == "A") {
            final[0].teamB = match[0].teamA;
          } else if (match[0].winner == "B") {
            final[0].teamB = match[0].teamB;
          }
        }
        await Match.updateOne({ id: final[0].id }, { $set: final[0] });
      }

      break;
    default:
      return { error: "That action type doesn't exist" };
  }
  if (typo.startsWith("Goal")) {
    match[0].result = match[0].scorersA.length + "-" + match[0].scorersB.length;
  }

  const updated = await Match.updateOne({ id }, { $set: match[0] });
  const updated2 = await Player.updateOne({ id: player }, { $set: playerR[0] });
  let updated3;
  tournament[0].markModified("boardGroups");
  const updated4 = await Tournament.updateOne(
    { id: match[0].tournament },
    { $set: tournament[0] },
  );
  if (player2) {
    updated3 = await Player.updateOne({ id: player2 }, { $set: playerR2[0] });
  }

  if (updated && updated2 && updated4) {
    return { success: "Changes registered successfully" };
  } else {
    return { error: "Failed to register the changes" };
  }
};

export const addReferee = async (matchID: string, referee: refereeInfo) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
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
    do {
      penalty.id = matchID + "-" + String(createID());
    } while (match[0].penalties!.find((penal: any) => penal.id == penalty.id));

    // adding the penalty
    if (match[0].penalties) {
      match[0].penalties.push(penalty);
    }

    // putting the penaltyID in penalty takers array

    if (penalty.team == "A") {
      const indexPT = match[0].penaltyTakersA!.findIndex(
        (taker: any) => taker.player == penalty.player && taker.penalty == null,
      );
      if (indexPT !== -1) {
        match[0].penaltyTakersA![indexPT].penalty = penalty.id;
      }
    }

    if (penalty.team == "B") {
      const indexPT = match[0].penaltyTakersB!.findIndex(
        (taker: any) => taker.player == penalty.player && taker.penalty == null,
      );
      if (indexPT !== -1) {
        match[0].penaltyTakersB![indexPT].penalty = penalty.id;
      }
    }

    // adding effects of penalty
    if (penalty.result == "Goal" && penalty.team == "A") {
      match[0].penaltieResult =
        Number(Number(match[0].penaltieResult!.split("-")[0]) + 1) +
        "-" +
        match[0].penaltieResult!.split("-")[1];
    } else if (penalty.result == "Goal" && penalty.team == "B") {
      match[0].penaltieResult =
        match[0].penaltieResult!.split("-")[0] +
        "-" +
        Number(Number(match[0].penaltieResult?.split("-")[1]) + 1);
    }

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "penalty added successfully" };
    } else {
      return { error: "Penalty didn't add" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};

export const editPenalty = async (
  matchID: string,
  penalty: penalty,
  penaltyID: string,
) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    const penaltyIndex = match[0].penalties!.findIndex(
      (penal) => penal.id == penaltyID,
    );
    if (penalty.goalkeeper) {
      match[0].penalties![penaltyIndex].goalkeeper = penalty.goalkeeper;
    }

    if (penalty.player) {
      match[0].penalties![penaltyIndex].player = penalty.player;
    }

    if (penalty.result) {
      if (
        (match[0].penalties![penaltyIndex].result == "Goal" &&
          penalty.result == "Fail" &&
          match[0].penalties![penaltyIndex].team == "A") ||
        (match[0].penalties![penaltyIndex].result == "Goal" &&
          penalty.result == "Saved" &&
          match[0].penalties![penaltyIndex].team == "A")
      ) {
        match[0].penaltieResult =
          Number(Number(match[0].penaltieResult!.split("-")[0]) -
          1) +
          "-" +
          match[0].penaltieResult!.split("-")[1];
      }

      if (
        (match[0].penalties![penaltyIndex].result == "Saved" &&
          penalty.result == "Goal" &&
          match[0].penalties![penaltyIndex].team == "A") ||
        (match[0].penalties![penaltyIndex].result == "Fail" &&
          penalty.result == "Goal" &&
          match[0].penalties![penaltyIndex].team == "A")
      ) {
        match[0].penaltieResult =
          Number(Number(match[0].penaltieResult!.split("-")[0]) +
          1) +
          "-" +
          match[0].penaltieResult!.split("-")[1];
      }

      if (
        (match[0].penalties![penaltyIndex].result == "Goal" &&
          penalty.result == "Fail" &&
          match[0].penalties![penaltyIndex].team == "B") ||
        (match[0].penalties![penaltyIndex].result == "Goal" &&
          penalty.result == "Saved" &&
          match[0].penalties![penaltyIndex].team == "B")
      ) {
        match[0].penaltieResult =
          match[0].penaltieResult!.split("-")[0] +
          "-" +
          Number(Number(match[0].penaltieResult?.split("-")[1]) - 1);
      }

      if (
        (match[0].penalties![penaltyIndex].result == "Saved" &&
          penalty.result == "Goal" &&
          match[0].penalties![penaltyIndex].team == "B") ||
        (match[0].penalties![penaltyIndex].result == "Fail" &&
          penalty.result == "Goal" &&
          match[0].penalties![penaltyIndex].team == "B")
      ) {
        match[0].penaltieResult =
          match[0].penaltieResult!.split("-")[0] +
          "-" +
          Number(Number(match[0].penaltieResult?.split("-")[1]) + 1);
      }

      match[0].penalties![penaltyIndex].result = penalty.result;
    }

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "penalty edited successfully" };
    } else {
      return { error: "Penalty didn't edit" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};

export const deletePenalty = async (matchID: string, penaltyID: string) => {
  const match = await Match.find({ id: matchID });
  if (match.length > 0) {
    // extract the info from the penalties
    const penal = match[0].penalties!.find(
      (penal: any) => penal.id == penaltyID,
    );
    // filter and get the new penalties array
    const penalties = match[0].penalties!.filter((penal) => {
      return penal.id !== penaltyID;
    });
    // delete in penalty takers
    let penaltyTakers;
    if (penal?.team == "A") {
      penaltyTakers = match[0].penaltyTakersA;
      const newPenaltyTakers = penaltyTakers?.filter(
        (pt: any) => pt.penalty == penal?.id,
      );
      match[0].penaltyTakersA = newPenaltyTakers;
    }
    if (penal?.team == "B") {
      penaltyTakers = match[0].penaltyTakersB;
      const newPenaltyTakers = penaltyTakers?.filter(
        (pt: any) => pt.penalty == penal?.id,
      );
      match[0].penaltyTakersB = newPenaltyTakers;
    }

    // apply the effects of deleting a penal on the result
    if (penal?.result == "Goal" && penal?.team == "A") {
      Number(Number(match[0].penaltieResult!.split("-")[0]) - 1) +
        "-" +
        match[0].penaltieResult!.split("-")[1];
    }

    if (penal?.result == "Goal" && penal?.team == "B") {
      match[0].penaltieResult =
        match[0].penaltieResult!.split("-")[0] +
        "-" +
        Number(Number(match[0].penaltieResult?.split("-")[1]) - 1);
    }

    match[0].penalties = penalties;

    const updated = await Match.findOneAndUpdate(
      { id: matchID },
      { $set: match[0] },
    );

    if (updated) {
      return { success: "penalty deleted successfully" };
    } else {
      return { error: "Penalty didn't delete" };
    }
  } else {
    return { error: "That match doesn't exist" };
  }
};
