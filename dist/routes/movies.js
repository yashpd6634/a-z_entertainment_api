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
const Video_model_1 = __importDefault(require("../models/Video.model"));
const verifyToken_1 = require("../verifyToken");
exports.router = express_1.default.Router();
//CREATE
exports.router.post("/", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin) {
        const newVideo = new Video_model_1.default(req.body);
        try {
            const savedMovie = yield newVideo.save();
            res.status(201).json(savedMovie);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed!");
    }
}));
//UPDATE
exports.router.put("/:id", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin) {
        try {
            const updatedVideo = yield Video_model_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {
                new: true,
            });
            res.status(201).json(updatedVideo);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed!");
    }
}));
//DELETE
exports.router.delete("/:id", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.isAdmin) {
        try {
            yield Video_model_1.default.findByIdAndDelete(req.params.id);
            res.status(201).json("Video has been deleted");
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can delete only your account!");
    }
}));
//GET
exports.router.get("/find/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const video = yield Video_model_1.default.findById(req.params.id).lean();
        if (!video)
            res.status(404).json("User Id does not exist");
        else {
            res.status(200).json(video);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET RANDOM
exports.router.get("/find/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.query.type;
    let video;
    try {
        if (type === "series") {
            video = yield Video_model_1.default.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } },
            ]);
        }
        else {
            video = yield Video_model_1.default.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } },
            ]);
        }
        res.status(200).json(video);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET ALL
exports.router.get("/", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.new;
    if (req.user.isAdmin) {
        try {
            const users = query
                ? yield User.find().sort({ _id: -1 }).limit(2)
                : yield User.find();
            res.status(200).json(users);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You are not allowed to get All users data");
    }
}));
//GET USER STATS
exports.router.get("/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    try {
        const data = yield User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
