/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "./ui/card";
import AudioPlayer from "./AudioPlayer";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const TweetCard = ({ tweet }: any) => {
  const { user } = useAuth();
  const [tweetstate, settweetstate] = useState(tweet);

  const likeTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/like/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const retweetTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/retweet/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  const isLiked = tweetstate.likedBy?.includes(user?._id);
  const isRetweet = tweetstate.retweetedBy?.includes(user?._id);

  return (
    <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none hover:bg-gray-950/50 transition-colors">
      <CardContent className="p-3 sm:p-4">
        <div className="flex space-x-2 sm:space-x-3">
          {/* AVATAR */}
          <Avatar className="h-9 w-9 sm:h-11 sm:w-11">
            <AvatarImage
              src={tweetstate.author.avatar}
              alt={tweetstate.author.displayName}
            />
            <AvatarFallback>
              {(tweetstate.author.displayName?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* HEADER */}
            <div className="flex items-start sm:items-center space-x-2 mb-1 sm:mb-2">
              <span className="font-bold text-white text-sm sm:text-base truncate">
                {tweetstate.author.displayName}
              </span>
    
              <span className="text-gray-500 text-xs sm:text-sm truncate">
                @{tweetstate.author.username}
              </span>

              <span className="text-gray-500 hidden sm:inline">·</span>

              {/* SHORT DATE ON MOBILE */}
              <span className="text-gray-500 text-xs sm:text-sm">
                {new Date(tweetstate.timestamp).toLocaleDateString("en-us", {
                  month: "short",
                  year: "numeric",
                })}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="ml-auto p-1 rounded-full hover:bg-gray-900"
              >
                <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </Button>
            </div>

            {/* CONTENT */}
            {tweetstate.content && (
              <p className="text-white mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">
                {tweetstate.content}
              </p>
            )}

            {/* IMAGE */}
            {tweetstate.image && (
              <div className="mb-2 sm:mb-3 rounded-2xl overflow-hidden w-full">
                <img
                  src={tweetstate.image}
                  alt="Tweet image"
                  className="w-full h-auto object-cover max-h-100"
                />
              </div>
            )}

            {/* AUDIO */}
            {tweetstate.audio && (
              <div className="mb-2 sm:mb-3">
                <AudioPlayer
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${tweetstate.audio.replace(/\\/g, "/")}`}
                />
              </div>
            )}

            {/* ACTION BAR */}
            <div className="flex items-center justify-between text-gray-500 text-xs sm:text-sm w-full">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 sm:gap-2"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{formatNumber(tweetstate.comments)}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 sm:gap-2 ${
                  isRetweet ? "text-green-400" : ""
                }`}
                onClick={() => retweetTweet(tweetstate._id)}
              >
                <Repeat2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{formatNumber(tweetstate.retweets)}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 sm:gap-2 ${
                  isLiked ? "text-red-500" : ""
                }`}
                onClick={() => likeTweet(tweetstate._id)}
              >
                <Heart
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? "fill-current" : ""}`}
                />
                <span>{formatNumber(tweetstate.likes)}</span>
              </Button>

              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetCard;
