import mongoose from "mongoose";

export type teamInGroup = {
  team: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesDraw: number;
  gamesLost: number;
  points: number;
  goalsP: number;
  goalsC: number;
  goalDifference: number;
  yellowCards: number;
  redCards: number;
};
export type playersInTournament = {
  team: string;
  numberPlayers: number;
  players: string[];
};
const playersInTournamentSchema = new mongoose.Schema<playersInTournament>({
  team: { type: String, required: true },
  numberPlayers: { type: Number, default: 0 },
  players: { type: [String], default: [] },
});
export type goalScorers = {
  player: string;
  team: string;
  goals: number;
}
const goalsScorersSchema = new mongoose.Schema<goalScorers>({
  player: { type: String, required: true },
  team: { type: String, required: true },
  goals: { type: Number, default: 0 },
});
export type assisters= {
  player: string;
  team: string;
  assists: number;
}
const assistersSchema = new mongoose.Schema<assisters>({
  player: { type: String, required: true },
  team: { type: String, required: true },
  assists: { type: Number, default: 0 },
});
export type playerWithYellowCards= {
  player: string;
  team: string;
  yellowCards: number;
}
const playerWithYellowCardsSchema = new mongoose.Schema<playerWithYellowCards>({
  player: { type: String, required: true },
  team: { type: String, required: true },
  yellowCards: { type: Number, default: 0 },
});
export type tournamentType = {
  id?: string;
  name: string;
  startDate: Date;
  parent: string;
  isParent: boolean;
  children: string[];
  endDate: Date;
  matches: string[];
  numberTeamsPerGroup: number;
  numberGroups: number;
  boardGroups: teamInGroup[][];
  category: string;
  city: string;
  department: string;
  numberPlayers: number;
  matchDuration: number;
  edition: string;
  teams: string[];
  goalscorers: goalScorers[];
  assisters: assisters[];
  playerWithMostYellowCards: playerWithYellowCards[];
  playersInTournament: playersInTournament[];
};

const tournamentSchema = new mongoose.Schema<tournamentType>({
  id: { type: String, unique: true, required: true },
  name: { type: String },
  isParent: { type: Boolean, default: true },
  parent: { type: String, default: null },
  children: [{ type: String, default: [] }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  matches: [{ type: String, default: [] }],
  numberTeamsPerGroup: { type: Number },
  boardGroups: [
    [
      {
        team: { type: String, ref: "Team" },
        gamesPlayed: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        gamesDraw: { type: Number, default: 0 },
        gamesLost: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        goalsP: { type: Number, default: 0 },
        goalsC: { type: Number, default: 0 },
        goalDifference: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
      },
    ],
  ],
  category: { type: String, required: true },
  city: { type: String, required: true },
  department: { type: String, required: true },
  edition: { type: String, required: true },
  numberGroups: { type: Number },
  numberPlayers: { type: Number },
  matchDuration: { type: Number },
  teams: [{ type: String }],
  goalscorers: [goalsScorersSchema],
  assisters: [assistersSchema],
  playerWithMostYellowCards: [playerWithYellowCardsSchema],
  playersInTournament: [playersInTournamentSchema],
});

const Tournament = mongoose.model<tournamentType>(
  "Tournament",
  tournamentSchema,
);

export default Tournament;
