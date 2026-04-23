import mongoose from "mongoose";

export type coachInfo = {
  name: string;
  id: string;
  rol?: string;
  image?: string;
  image_id?: string;
};

export type teamType = {
  id?: string;
  name: string;
  edition: string;
  flag?: string;
  id_flag?: string;
  country: string;
  founded: Date;
  coach?: coachInfo[];
  players?: number[];
  category: string;
};

const teamSchema = new mongoose.Schema<teamType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  edition: { type: String, required: true },
  flag: { type: String, default: " " },
  id_flag: { type: String },
  country: { type: String, default: "Colombia" },
  founded: { type: Date, required: true },
  coach: [
    {
      name: { type: String, required: true },
      id: { type: String, required: true },
      rol: { type: String, default: "Entrenador" },
      image: { type: String, default: " " },
      image_id: { type: String },
    },
  ],
  players: [{ type: Number, default: [] }],
  category: { type: String, required: true },
});

const Team = mongoose.model<teamType>("Team", teamSchema);

export default Team;
