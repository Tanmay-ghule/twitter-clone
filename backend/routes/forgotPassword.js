import dotenv from "dotenv";
dotenv.config();

import express from "express";
import User from "../modals/user.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { generatePassword } from "../utils/passwordGenerator.js";
import admin from "../firebaseAdmin.js";
import twilio from "twilio";

const router = express.Router();

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/* EMAIL TRANSPORTER */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= REQUEST OTP ================= */
router.post("/request", async (req, res) => {
  try {
    const { email, phone, mode } = req.body;

    console.log("REQUEST BODY:", req.body);
    console.log("PHONE:", phone);
    console.log("MODE:", mode);

    const user = await User.findOne({
      $or: [
        { email },
        { phone: phone },
        { phone: `+91${phone}` },
        { phone: phone?.replace("+91", "") },
      ],
    });

    console.log("USER FOUND:", user);

    if (!user) return res.status(404).json({ error: "User not found" });

    /* ===== ONCE PER DAY LIMIT ===== */
    if (
      user.lastPasswordResetRequest &&
      Date.now() - new Date(user.lastPasswordResetRequest).getTime() <
        24 * 60 * 60 * 1000
    ) {
      return res.status(429).json({
        error: "You can use this option only once per day.",
      });
    }

    if (mode === "email") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const hashedOtp = await bcrypt.hash(otp, 10);

      user.otpHash = hashedOtp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
      user.otpAttempts = 0;
      user.lastPasswordResetRequest = new Date();

      await user.save();

      console.log("EMAIL OTP:", otp);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your OTP is ${otp}. Valid for 10 minutes.`,
      });
    }

    if (mode === "phone") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      user.otpHash = hashedOtp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;
      user.otpAttempts = 0;
      user.lastPasswordResetRequest = new Date();

      await user.save();

      const formattedPhone = user.phone.startsWith("+")
        ? user.phone
        : `+91${user.phone}`;

      await twilioClient.messages.create({
        body: `Your OTP is ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE,
        to: formattedPhone,
      });
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("Forgot Password REQUEST Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify", async (req, res) => {
  try {
    const { email, phone, otp, mode } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (mode === "email") {
      if (!user.otpHash || !user.otpExpiry) {
        return res.status(400).json({ error: "OTP expired" });
      }

      if (user.otpAttempts >= 3) {
        return res.status(403).json({ error: "Too many OTP attempts" });
      }

      if (user.otpExpiry < Date.now()) {
        return res.status(401).json({ error: "OTP expired" });
      }

      const valid = await bcrypt.compare(otp, user.otpHash);

      if (!valid) {
        user.otpAttempts += 1;
        await user.save();
        return res.status(401).json({ error: "Invalid OTP" });
      }
    }

    if (mode === "phone") {
      if (!user.otpHash || !user.otpExpiry) {
        return res.status(400).json({ error: "OTP expired" });
      }

      if (user.otpAttempts >= 3) {
        return res.status(403).json({ error: "Too many OTP attempts" });
      }

      if (user.otpExpiry < Date.now()) {
        return res.status(401).json({ error: "OTP expired" });
      }

      const valid = await bcrypt.compare(otp, user.otpHash);

      if (!valid) {
        user.otpAttempts += 1;
        await user.save();
        return res.status(401).json({ error: "Invalid OTP" });
      }
    }

    /* ===== GENERATE NEW PASSWORD ===== */
    const newPass = generatePassword();
    const hashedPassword = await bcrypt.hash(newPass, 10);

    user.password = hashedPassword;
    user.otpHash = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;

    await user.save();

    /* ===== SYNC FIREBASE PASSWORD ===== */
    const fbUser = await admin.auth().getUserByEmail(user.email);

    await admin.auth().updateUser(fbUser.uid, {
      password: newPass,
    });

    console.log("NEW PASSWORD for", user.email, ":", newPass);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your New Password",
      text: `Your new password is: ${newPass}`,
    });

    res.json({ message: "New password sent to email" });
  } catch (err) {
    console.error("Forgot Password VERIFY Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
