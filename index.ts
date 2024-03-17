import express, { Express, Request, Response } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import * as dotenv from "dotenv";
import { router as authRoutes } from "./routes/auth";
import { router as userRoutes } from "./routes/users";
import { router as videoRoutes } from "./routes/videos";
import { router as listsRoutes } from "./routes/lists";
import cors from 'cors';

const app = express();
const port = 8000;
dotenv.config();

mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useUnifiedTopology: true
  } as ConnectOptions)
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/lists", listsRoutes);

app.listen(port, () => {
  console.log(`now backend server is running on port ${port}`);
});
