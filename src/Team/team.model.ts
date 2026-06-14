import mongoose from "mongoose";

export type coachInfo = {
  name: string;
  id: string;
  rol?: string;
  image?: string | null;
  image_id?: string | null;
};

export type teamType = {
  id?: string;
  name: string;
  edition: string;
  flag?: string | null;
  id_flag?: string | null;
  country: string;
  founded: Date;
  coach?: coachInfo[];
  players?: number[];
  category: string;
  editedBy: string | null;
  editedAt: Date | null;
};

const teamSchema = new mongoose.Schema<teamType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  edition: { type: String, required: true },
  flag: { type: String, default: null },
  id_flag: { type: String },
  country: { type: String, default: "Colombia" },
  founded: { type: Date, required: true },
  coach: [
    {
      name: { type: String, required: true },
      id: { type: String, required: true },
      rol: { type: String, default: "Entrenador" },
      image: { type: String, default: null },
      image_id: { type: String, default: null },
    },
  ],
  players: [{ type: Number, default: [] }],
  category: { type: String, required: true },
  editedBy: { type: String },
  editedAt: { type: Date },
});

const Team = mongoose.model<teamType>("Team", teamSchema);

export default Team;
