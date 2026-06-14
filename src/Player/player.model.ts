import mongoose from "mongoose";

export type PlayerType = {
  name: string;
  id: string;
  dorsal: number;
  nation: string;
  position: string;
  team: string;
  teamName: string;
  image: string | null;
  image_id?: string | null;
  goals: number;
  assists: number;
  gamesPlayed: number;
  yellowCards: number;
  redCards: number;
  editionPlayed: string;
  minutesPlayed: number;
  starterGames: number;
  subInGames: number;
  age: number;
  birthYear: Date;
  talla: string;
  editedBy: string | null;
  editedAt: Date| null;
};

const playerSchema = new mongoose.Schema<PlayerType>({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  nation: { type: String, required: true },
  dorsal: { type: Number, required: true },
  position: { type: String, required: true },
  team: { type: String, ref: "Team", required: true },
  teamName: { type: String, required: true },
  image: { type: String, default: null },
  image_id: { type: String, default: null },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  editionPlayed: { type: String, required: true },
  minutesPlayed: { type: Number, default: 0 },
  starterGames: { type: Number, default: 0 },
  subInGames: { type: Number, default: 0 },
  age: { type: Number, required: true },
  birthYear: { type: Date, required: true },
  talla: { type: String },
  editedBy: { type: String },
  editedAt: { type: Date },
});

const Player = mongoose.model<PlayerType>("Player", playerSchema);

export default Player;
