import express, { Express } from "express";
import User, { UserInput, UserOutput } from "../models/User.model";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      `${process.env.SECRET_KEY}`
    ).toString(),
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user: UserOutput | null = await User.findOne({
      email: req.body.email,
    }).lean();

    if (!user) res.status(401).json("Wrong password or username");
    else {
      const bytes = CryptoJS.AES.decrypt(
        user.password,
        `${process.env.SECRET_KEY}`
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      originalPassword !== req.body.password &&
        res.status(401).json("Wrong password or username");

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        `${process.env.SECRET_KEY}`,
        {
          expiresIn: "5d",
        }
      );

      const { password, ...info } = user;

      res.status(200).json({...info, accessToken});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
