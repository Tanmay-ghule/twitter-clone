/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { BarChart3, Smile, Calendar, MapPin, Image, X } from "lucide-react";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";

const TweetComposer = ({
  onTweetPosted,
}: {
  onTweetPosted: (tweet: any) => void;
}) => {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageurl, setImageurl] = useState<string | null>(null);

  const [audio, setAudio] = useState<File | null>(null);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [duration, setDuration] = useState(0);

  const maxLength = 200;

  if (!user || !user.username) return null;

  const sendOtp = async () => {
    try {
      await axiosInstance.post("/otp/send", { email: user.email });
      alert("OTP sent to your email");
    } catch {
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axiosInstance.post("/otp/verify", {
        email: user.email,
        otp,
      });

      if (res.data.verified) {
        setOtpVerified(true);
        alert("OTP Verified");
      } else {
        alert("Invalid OTP");
      }
    } catch {
      alert("OTP Error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !audio && !imageurl) return;

    try {
      setIsLoading(true);

      if (audio) {
        if (!otpVerified) {
          alert("Verify OTP first");
          return;
        }

        const formData = new FormData();
        formData.append("audio", audio);
        formData.append("author", user._id);
        formData.append("email", user.email);
        formData.append("otp", otp);
        formData.append("duration", duration.toString());

        const res = await axiosInstance.post("/audio-tweet", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        onTweetPosted(res.data);
        setAudio(null);
        setOtpVerified(false);
        setOtp("");
        return;
      }

      const res = await axiosInstance.post("/post", {
        author: user._id,
        content,
        image: imageurl,
      });

      onTweetPosted(res.data);
      setContent("");
      setImageurl(null);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to post");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const image = e.target.files[0];
    const formDataImg = new FormData();
    formDataImg.append("image", image);

    try {
      setIsLoading(true);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        formDataImg,
      );
      setImageurl(res.data.data.display_url);
    } finally {
      setIsLoading(false);
    }
  };

  const isOverLimit = content.length > maxLength;

  return (
    <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none">
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
            <AvatarImage src={user.avatar || "/avatar.png"} />
            <AvatarFallback>
              {(user.displayName?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-transparent border-none text-base sm:text-xl text-white resize-none min-h-20 p-0 focus-visible:ring-0"
              />

              {/* Image Preview */}
              {imageurl && (
                <div className="relative mt-2 rounded-2xl overflow-hidden max-w-full">
                  <img
                    src={imageurl}
                    alt="preview"
                    className="w-full h-auto max-h-64 object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImageurl(null)}
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-black"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              {/* Audio file name preview */}
              {audio && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <span>🎵 {audio.name}</span>
                  <button
                    type="button"
                    onClick={() => setAudio(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* OTP Section */}
              {!otpVerified && (
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP for audio tweet"
                    className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={sendOtp}
                      className="bg-gray-700 hover:bg-gray-600 text-sm flex-1 sm:flex-none"
                    >
                      Send OTP
                    </Button>
                    <Button
                      type="button"
                      onClick={verifyOtp}
                      className="bg-blue-500 hover:bg-blue-600 text-sm flex-1 sm:flex-none"
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              {/* Audio Upload — only after OTP verified */}
              {otpVerified && (
                <div className="mt-3">
                  <label className="text-sm text-green-400 mb-1 block">
                    ✅ OTP Verified — Upload Audio
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    className="text-white text-sm w-full"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 100 * 1024 * 1024) {
                        alert("Audio must be below 100MB");
                        return;
                      }

                      const audioEl = new Audio(URL.createObjectURL(file));
                      audioEl.onloadedmetadata = () => {
                        if (audioEl.duration > 300) {
                          alert("Audio must be under 5 minutes");
                          return;
                        }
                        setDuration(audioEl.duration);
                        setAudio(file);
                      };
                    }}
                  />
                </div>
              )}

              {/* Hidden image input */}
              <input
                type="file"
                id="tweetImage"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />

              {/* Char count + actions */}
              <div className="flex flex-wrap justify-between items-center gap-2 mt-3">
                <div className="flex items-center space-x-3 text-blue-400">
                  <Image
                    className="h-5 w-5 cursor-pointer hover:text-blue-300"
                    onClick={() =>
                      document.getElementById("tweetImage")?.click()
                    }
                  />
                  <BarChart3 className="h-5 w-5" />
                  <Smile className="h-5 w-5" />
                  <Calendar className="h-5 w-5" />
                  <MapPin className="h-5 w-5" />
                </div>

                <div className="flex items-center gap-3">
                  {content.length > 0 && (
                    <span
                      className={`text-sm ${
                        isOverLimit ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      {maxLength - content.length}
                    </span>
                  )}
                  <Button
                    type="submit"
                    disabled={
                      (!content.trim() && !audio && !imageurl) ||
                      isOverLimit ||
                      isLoading
                    }
                    className="bg-blue-500 hover:bg-blue-600 rounded-full px-5 sm:px-6 text-sm sm:text-base"
                  >
                    {isLoading ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetComposer;
