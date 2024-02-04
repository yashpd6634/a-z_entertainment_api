import mongoose from "mongoose";

export interface VideoInput {
  title: string;
  desc: string;
  imgFeatured: string;
  imgTitle: string;
  imgThumbnail: string;
  trailer: string;
  video: string;
  year: string;
  limit: number;
  genre: string;
  isSeries: boolean;
}

export interface VideoOutput extends VideoInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    imgFeatured: { type: String },
    imgTitle: { type: String },
    imgThumbnail: { type: String },
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    limit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model<VideoInput>("Video", VideoSchema);
