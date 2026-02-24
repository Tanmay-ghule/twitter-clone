import express from "express";
import multer from "multer";
import Tweet from "../modals/tweet.js";
import User from "../modals/user.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/audio/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("audio/")) {
      cb(new Error("Only audio files are allowed"));
    } else {
      cb(null, true);
    }
  },
});

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const { author, email, duration } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const nowUTC = new Date();
    const istMinutes =
      (nowUTC.getUTCHours() * 60 + nowUTC.getUTCMinutes() + 330) % 1440;
    const istHour = Math.floor(istMinutes / 60);

    if (istHour < 14 || istHour >= 19) {
      return res.status(403).json({
        error: "Audio tweets are only allowed between 2:00 PM and 7:00 PM IST",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    const parsedDuration = parseInt(duration || "0");
    if (parsedDuration > 300) {
      return res.status(400).json({ error: "Audio must be under 5 minutes" });
    }

    const tweet = new Tweet({
      author,
      audio: req.file.path,
    });

    await tweet.save();

    res.json(await tweet.populate("author"));
  } catch (err) {
    console.error("Audio Upload Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;