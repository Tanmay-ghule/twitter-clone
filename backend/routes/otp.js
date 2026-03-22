import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const router = express.Router();

const otpStore = new Map();

router.post("/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "Your OTP Code",
  text: `Your OTP is ${otp}`,
}).catch((err) => console.error("EMAIL ERROR:", err));

  res.json({ message: "OTP sent" });
});

router.post("/verify", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore.get(email) === otp) {
    otpStore.delete(email);
    return res.json({ verified: true });
  }

  return res.status(400).json({ verified: false });
});

export default router;
