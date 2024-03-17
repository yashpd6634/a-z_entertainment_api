"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const auth_1 = require("./routes/auth");
const users_1 = require("./routes/users");
const videos_1 = require("./routes/videos");
const lists_1 = require("./routes/lists");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8000;
dotenv.config();
mongoose_1.default
    .connect(`${process.env.MONGO_URL}`, {
    useUnifiedTopology: true
})
    .then(() => console.log("connected to the database"))
    .catch((err) => console.log(err));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/auth", auth_1.router);
app.use("/api/users", users_1.router);
app.use("/api/videos", videos_1.router);
app.use("/api/lists", lists_1.router);
app.listen(port, () => {
    console.log(`now backend server is running on port ${port}`);
});
