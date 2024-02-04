"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
const VideoSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Video", VideoSchema);
