import mongoose from "mongoose";

export type PlayerType = {
  name: string;
  id: string;
  dorsal: number;
  nation:string;
  position: string;
  team: string;
  teamName: string;
  image: string;
  image_id?:string;
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
};

const playerSchema = new mongoose.Schema<PlayerType>({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  nation: { type: String, required: true },
  dorsal: { type: Number, required: true },
  position: { type: String, required: true },
  team: { type: String, ref: "Team", required: true },
  teamName: { type: String, required: true },
  image: { type: String, default: " " },
  image_id: {type: String},
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
});

const Player = mongoose.model<PlayerType>("Player", playerSchema);

export default Player;
