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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.router = express_1.default.Router();
//REGISTER
exports.router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new User_model_1.default({
        username: req.body.username,
        email: req.body.email,
        password: crypto_js_1.default.AES.encrypt(req.body.password, `${process.env.SECRET_KEY}`).toString(),
    });
    try {
        const user = yield newUser.save();
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findOne({
            email: req.body.email,
        }).lean();
        if (!user)
            res.status(401).json("Wrong password or username");
        else {
            const bytes = crypto_js_1.default.AES.decrypt(user.password, `${process.env.SECRET_KEY}`);
            const originalPassword = bytes.toString(crypto_js_1.default.enc.Utf8);
            originalPassword !== req.body.password &&
                res.status(401).json("Wrong password or username");
            const accessToken = jsonwebtoken_1.default.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            }, `${process.env.SECRET_KEY}`, {
                expiresIn: "5d",
            });
            const { password } = user, info = __rest(user, ["password"]);
            res.status(200).json(Object.assign(Object.assign({}, info), { accessToken }));
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
