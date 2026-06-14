import mongoose from "mongoose";

export type SignedPeopleType = {
  name: string;
  id: string;
  lastName: string;
  email: string;
  tel: string;
  teamName: string;
  multiplesCat: boolean;
  oneCat: boolean;
  date: Date;
  cargo: string;
  fase?: "Inscrito" | "Contactado" | "Pendiente a pago" | "Aceptado";
};

const SignedPeopleSchema = new mongoose.Schema<SignedPeopleType>({
  name: { type: String, require: true },
  id: { type: String, unique: true, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true },
  tel: { type: String, require: true },
  teamName: { type: String },
  multiplesCat: { type: Boolean },
  oneCat: { type: Boolean },
  date: { type: Date },
  fase: {
    type: String,
    enum: ["Inscrito", "Contactado", "Pendiente a pago", "Aceptado"],
    default: "Inscrito",
  },
  cargo: {type: String}
});

export const SignedPeople = mongoose.model<SignedPeopleType>(
  "SignedPeople",
  SignedPeopleSchema,
);
