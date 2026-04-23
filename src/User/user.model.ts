import mongoose from "mongoose";

export type UserType = {
  username: string;
  email?: string;
  password: string;
  tel:string;
  rol: "Admin" | "User";
  team?: string[];
};

const userSchema = new mongoose.Schema<UserType>({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  tel: {type:String},
  rol: { type: String, enum: ["Admin", "User"], default: "User" },
  team: [{ type: String, default: [] }]
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
