import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./modals/user.js";
import Tweet from "./modals/tweet.js";
import forgotPasswordRoutes from "./routes/forgotPassword.js";
import otpRoutes from "./routes/otp.js";
import audioRoutes from "./routes/audioTweet.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://YOUR-VERCEL-APP.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/otp", otpRoutes);
app.use("/audio-tweet", audioRoutes);
app.use("/forgot-password", forgotPasswordRoutes);

app.get("/", (req, res) => {
  res.send("Twitter backend is running successfully 🚀");
});

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(port, () => console.log(`🚀 Server running on ${port}`));
});

app.post("/register", async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.json(existing);

    const user = new User({
      username: req.body.username,
      displayName: req.body.displayName,
      email: req.body.email,
      avatar:
        req.body.avatar ||
        "https://ui-avatars.com/api/?name=" + req.body.displayName,
      phone: req.body.phone || "",
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Register failed" });
  }
});

app.get("/loggedinuser", async (req, res) => {
  const user = await User.findOne({ email: req.query.email });
  res.json(user);
});

app.post("/post", async (req, res) => {
  const tweet = new Tweet(req.body);
  await tweet.save();

  const populatedTweet = await tweet.populate("author");

  if (populatedTweet.content) {
    const users = await User.find({
      keywords: { $exists: true, $not: { $size: 0 } },
    });

    for (const user of users) {
      for (const keyword of user.keywords) {
        if (
          populatedTweet.content.toLowerCase().includes(keyword.toLowerCase())
        ) {
          await Notification.create({
            user: user._id,
            tweet: populatedTweet._id,
            keywordMatched: keyword,
          });
          break;
        }
      }
    }
  }

  res.json(populatedTweet);
});

app.get("/post", async (req, res) => {
  const tweets = await Tweet.find().populate("author").sort({ timestamp: -1 });
  res.json(tweets);
});

app.post("/like/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    const { userId } = req.body;

    const alreadyLiked = tweet.likedBy.includes(userId);

    if (alreadyLiked) {
      tweet.likedBy.pull(userId);
      tweet.likes -= 1;
    } else {
      tweet.likedBy.push(userId);
      tweet.likes += 1;
    }

    await tweet.save();
    res.json(await tweet.populate("author"));
  } catch (err) {
    res.status(500).json({ error: "Like failed" });
  }
});

app.post("/retweet/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    const { userId } = req.body;

    const alreadyRetweeted = tweet.retweetedBy.includes(userId);

    if (alreadyRetweeted) {
      tweet.retweetedBy.pull(userId);
      tweet.retweets -= 1;
    } else {
      tweet.retweetedBy.push(userId);
      tweet.retweets += 1;
    }

    await tweet.save();
    res.json(await tweet.populate("author"));
  } catch (err) {
    res.status(500).json({ error: "Retweet failed" });
  }
});

app.patch("/userupdate/:email", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});