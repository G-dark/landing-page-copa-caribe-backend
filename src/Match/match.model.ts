import mongoose from "mongoose";
export type penaltyTaker = {
  player: string;
  penalty: string | null;
};
export type penalty = {
  id: string;
  player: string;
  goalkeeper: string;
  team: "A" | "B";
  result: "Goal" | "Fail" | "Saved";
};
export type formacion = {
  starters: string[];
  subPlayers: string[];
  distribution: string;
};
export type evento = {
  id: string;
  description: string;
  tipo:
    | "Goal"
    | "Penalty Goal"
    | "Penalty Missed"
    | "Yellow"
    | "Red"
    | "Assist"
    | "Comment"
    | "Anulation"
    | "Substituition"
    | "Corner"
    | "Final"
    | "Start"
    | "Positions"
    | "Fault"
    | "RestTime"
    | "Penales";
  team: "A" | "B" | "NA";
  playersRelated: string[];
  minute: string;
};
export type refereeInfo = {
  id: string;
  name: string;
  lastName: string;
  position: "Central" | "Linea" | "Cuarto";
};
export type rules = {
  players: number;
  minutesPerTime: number;
};
export type matchType = {
  id?: string;
  teamA: string;
  teamB: string;
  date: Date;
  location?: string;
  edition: string;
  result?: string;
  scorersA: string[];
  scorersB: string[];
  assistersA: string[];
  assistersB: string[];
  cornersA: number;
  cornersB: number;
  faultsA: number;
  faultsB: number;
  yellowPlayersA: string[];
  redPlayersA: string[];
  yellowPlayersB: string[];
  redPlayersB: string[];
  referee: refereeInfo[];
  formacionA?: formacion;
  formacionB?: formacion;
  finalFormacionA?: formacion;
  finalFormacionB?: formacion;
  yellowCards: number;
  redCards: number;
  eventos: evento[];
  rules: rules;
  status?: "Programado" | "En vivo" | "Finalizado" | "Entretiempo" | "Penales";
  extraTime?: number;
  extraTime2?: number;
  penaltyTakersA?: penaltyTaker[];
  penaltyTakersB?: penaltyTaker[];
  penaltyStarter?: "A" | "B" | "NA";
  penalties?: penalty[];
  penaltieResult?: string;
  tournament: string;
  phase:
    | "Grupos"
    | "Repechaje"
    | "Octavos de final"
    | "Cuartos de final"
    | "Semifinal"
    | "Final";
  order: string;
  nextRound: string;
};
const matchSchema = new mongoose.Schema<matchType>({
  id: { type: String, required: true, unique: true },
  teamA: { type: String, ref: "TeamA", required: true },
  teamB: { type: String, ref: "TeamB", required: true },
  date: { type: Date, required: true },
  location: { type: String, default: "" },
  edition: { type: String, required: true },
  result: { type: String, default: "0-0" },
  scorersA: [{ type: String, default: [] }],
  scorersB: [{ type: String, default: [] }],
  assistersA: [{ type: String, default: [] }],
  assistersB: [{ type: String, default: [] }],
  yellowPlayersA: [{ type: String, default: [] }],
  redPlayersA: [{ type: String, default: [] }],
  yellowPlayersB: [{ type: String, default: [] }],
  redPlayersB: [{ type: String, default: [] }],
  formacionA: {
    starters: [{ type: String, default: [] }],
    subPlayers: [{ type: String, default: [] }],
    distribution: { type: String, default: "4-3-3" },
  },
  formacionB: {
    starters: [{ type: String, default: [] }],
    subPlayers: [{ type: String, default: [] }],
    distribution: { type: String, default: "4-3-3" },
  },
  finalFormacionA: {
    starters: [{ type: String, default: [] }],
    subPlayers: [{ type: String, default: [] }],
    distribution: { type: String, default: "4-3-3" },
  },
  finalFormacionB: {
    starters: [{ type: String, default: [] }],
    subPlayers: [{ type: String, default: [] }],
    distribution: { type: String, default: "4-3-3" },
  },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  referee: [
    {
      id: { type: String },
      name: { type: String },
      lastName: { type: String },
      position: { type: String, enum: ["Central", "Linea", "Cuarto"] },
    },
  ],
  eventos: [
    {
      id: { type: String },
      description: { type: String },
      team: { type: String, enum: ["A", "B", "NA"] },
      tipo: {
        type: String,
        enum: [
          "Goal",
          "Penalty Goal",
          "Penalty Missed",
          "Assist",
          "Red",
          "Yellow",
          "Comment",
          "Anulation",
          "Substitution",
          "Corner",
          "Final",
          "Start",
          "Start2",
          "Positions",
          "Fault",
          "RestTime",
          "Penales",
        ],
        require: true,
      },
      playersRelated: [{ type: String, default: [] }],
      minute: { type: String, require: true },
    },
  ],
  rules: {
    players: { type: Number, require: true },
    minutesPerTime: { type: Number, require: true },
  },
  status: {
    type: String,
    enum: ["Programado", "En vivo", "Finalizado", "Entretiempo", "Penales"],
    default: "Programado",
  },
  extraTime: { type: Number, default: 0 },
  extraTime2: { type: Number, default: 0 },
  penaltyTakersA: [{ player: { type: String }, penalty: { type: String, default: null } }],
  penaltyTakersB: [{ player: { type: String }, penalty: { type: String, default: null } }],
  penaltyStarter: { type: String, enum: ["A", "B", "NA"], default: "NA" },
  penalties: [
    {
      id: { type: String },
      player: { type: String },
      goalkeeper: { type: String },
      result: { type: String, enum: ["Goal", "Fail", "Saved"] },
      team: { type: String, enum: ["A", "B"] },
    },
  ],
  penaltieResult: { type: String, default: "0-0" },
  tournament: { type: String, ref: "Tournament" },
  phase: {
    type: String,
    enum: [
      "Grupos",
      "Repechaje",
      "Octavos de final",
      "Cuartos de final",
      "Semifinal",
      "Final",
    ],
  },
  order: { type: String },
  nextRound: { type: String },
  cornersA: { type: Number, default: 0 },
  cornersB: { type: Number, default: 0 },
  faultsA: { type: Number, default: 0 },
  faultsB: { type: Number, default: 0 },
});

const Match = mongoose.model<matchType>("Match", matchSchema);

export default Match;
