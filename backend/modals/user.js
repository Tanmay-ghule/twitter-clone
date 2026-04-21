import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: String,
  displayName: String,
  avatar: String,
  coverImage: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,

  bio: String,
  location: String,
  website: String,
  joinedDate: { type: Date, default: Date.now },
  otpHash: String,
  otpExpiry: Date,
  otpAttempts: { type: Number, default: 0 },
  resetToken: String,
  resetTokenExpiry: Date,
  lastPasswordResetRequest: Date,
});

export default mongoose.model("User", UserSchema);
