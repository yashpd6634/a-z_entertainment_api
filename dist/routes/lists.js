"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../verifyToken");
const List_model_1 = __importDefault(require("../models/List.model"));
exports.router = express_1.default.Router();
//CREATE
exports.router.post("/", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin) {
        const newList = new List_model_1.default(req.body);
        try {
            const savedList = yield newList.save();
            res.status(201).json(savedList);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed!");
    }
}));
// //UPDATE
// router.put("/:id", verify, async (req: any, res) => {
//   if (req.user.isAdmin) {
//     try {
//       const updatedVideo = await Video.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         {
//           new: true,
//         }
//       );
//       res.status(201).json(updatedVideo);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json("You are not allowed!");
//   }
// });
//DELETE
exports.router.delete("/:id", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin) {
        try {
            yield List_model_1.default.findByIdAndDelete(req.params.id);
            res.status(201).json("List has been deleted");
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed to delete");
    }
}));
// //GET RANDOM
// router.get("/random", async (req: any, res) => {
//   const type = req.query.type;
//   let video;
//   try {
//     if (type === "series") {
//       video = await Video.aggregate([
//         { $match: { isSeries: true } },
//         { $sample: { size: 1 } },
//       ]);
//     } else {
//       video = await Video.aggregate([
//         { $match: { isSeries: false } },
//         { $sample: { size: 1 } },
//       ]);
//     }
//     res.status(200).json(video);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// //GET
// router.get("/:id", async (req: any, res) => {
//   try {
//     const video: VideoOutput | null = await Video.findById(
//       req.params.id
//     ).lean();
//     if (!video) res.status(404).json("User Id does not exist");
//     else {
//       res.status(200).json(video);
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
//GET ALL
exports.router.get("/", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if (typeQuery) {
            if (genreQuery) {
                list = yield List_model_1.default.aggregate([
                    { $match: { type: typeQuery, genre: genreQuery } },
                    { $sample: { size: 10 } },
                ]);
            }
            else {
                list = yield List_model_1.default.aggregate([
                    { $match: { type: typeQuery } },
                    { $sample: { size: 10 } },
                ]);
            }
        }
        else {
            list = yield List_model_1.default.aggregate([{ $sample: { size: 10 } }]);
        }
        res.status(200).json(list);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
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
