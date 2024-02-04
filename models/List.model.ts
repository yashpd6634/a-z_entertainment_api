import mongoose from "mongoose";

export interface ListInput {
  title: string;
  type: string;
  genre: string;
  content: Array<string>;
}

export interface ListOutput extends ListInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const ListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    type: { type: String },
    genre: { type: String },
    content: { type: Array }
  },
  { timestamps: true }
);

export default mongoose.model<ListInput>("List", ListSchema);
