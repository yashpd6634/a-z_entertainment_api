import mongoose from "mongoose";

export interface UserInput {
  username: string;
  email: string;
  password: string;
  profilePic: string;
  isAdmin: boolean;
}

export interface UserOutput extends UserInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  accessToken: string;
}

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<UserInput>("User", UserSchema);