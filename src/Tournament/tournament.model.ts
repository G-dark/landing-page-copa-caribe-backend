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

export type tournamentType = {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  matches: string[];
  numberTeamsPerGroup: number;
  numberGroups: number;
  boardGroups: teamInGroup[][];
  category: string;
  city: string;
  edition: string;
};

const tournamentSchema = new mongoose.Schema<tournamentType>({
  id: { type: String, unique: true, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  matches: [{ type: String, default: [] }],
  numberTeamsPerGroup: { type: Number },
  boardGroups: [[
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
  ]],
  category: { type: String, required: true },
  city: { type: String, required: true },
  edition: { type: String, required: true },
  numberGroups: {type:Number}
});

const Tournament = mongoose.model<tournamentType>(
  "Tournament",
  tournamentSchema,
);

export default Tournament;
