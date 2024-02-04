import express, { Express } from "express";
import Video, { VideoOutput } from "../models/Video.model";
import CryptoJS from "crypto-js";
import { verify } from "../verifyToken";

export const router = express.Router();

//CREATE
router.post("/", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    const newVideo = new Video(req.body);

    try {
      const savedMovie = await newVideo.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//UPDATE
router.put("/:id", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(201).json(updatedVideo);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//DELETE
router.delete("/:id", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    try {
      await Video.findByIdAndDelete(req.params.id);
      res.status(201).json("Video has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your account!");
  }
});

//GET RANDOM
router.get("/random", async (req: any, res) => {
  const type = req.query.type;
  let video;
  try {
    if (type === "series") {
      video = await Video.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      video = await Video.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }

    res.status(200).json(video);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
router.get("/:id", async (req: any, res) => {
  try {
    const video: VideoOutput | null = await Video.findById(
      req.params.id
    ).lean();

    if (!video) res.status(404).json("User Id does not exist");
    else {
      res.status(200).json(video);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", verify, async (req: any, res) => {
  if (req.user.isAdmin) {
    try {
      const videos = await Video.find();
      res.status(200).json(videos.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to get All videos data");
  }
});

// //GET USER STATS
// router.get("/stats", async (req, res) => {
//   const today = new Date();
//   const lastYear = new Date(today);
//   lastYear.setFullYear(today.getFullYear() - 1);

//   const monthsArray = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   try {
//     const data = await User.aggregate([
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
