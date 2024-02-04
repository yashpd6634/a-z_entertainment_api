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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const User_model_1 = __importDefault(require("../models/User.model"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const verifyToken_1 = require("../verifyToken");
exports.router = express_1.default.Router();
//UPDATE
exports.router.put("/:id", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = crypto_js_1.default.AES.encrypt(req.body.password, `${process.env.SECRET_KEY}`).toString();
        }
        try {
            const updatedUser = yield User_model_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {
                new: true,
            });
            res.status(201).json(updatedUser);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can update only your account!");
    }
}));
//DELETE
exports.router.delete("/:id", verifyToken_1.verify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            yield User_model_1.default.findByIdAndDelete(req.params.id);
            res.status(201).json("User has been deleted");
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
        const user = yield User_model_1.default.findById(req.params.id).lean();
        if (!user)
            res.status(404).json("User Id does not exist");
        else {
            const { password } = user, info = __rest(user, ["password"]);
            res.status(200).json(info);
        }
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
                ? yield User_model_1.default.find().sort({ _id: -1 }).limit(2)
                : yield User_model_1.default.find();
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
        const data = yield User_model_1.default.aggregate([
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
