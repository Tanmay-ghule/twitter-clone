"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Link as LinkIcon,
  MoreHorizontal,
  Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TweetCard from "./TweetCard";
import { Card, CardContent } from "./ui/card";
import Editprofile from "./Editprofile";
import axiosInstance from "@/lib/axiosInstance";

interface Tweet {
  _id: string;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  comments: number;
  liked?: boolean;
  retweeted?: boolean;
  image?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post");
      setTweets(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchTweets();
  }, []);

  const userTweets = tweets.filter((tweet) => tweet.author._id === user._id);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center px-3 sm:px-4 py-3 space-x-4 sm:space-x-8">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-gray-900"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-white">
              {user.displayName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              {userTweets.length} posts
            </p>
          </div>
        </div>
      </div>

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-28 sm:h-36 md:h-48 bg-linear-to-r from-blue-600 to-purple-600 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70"
          >
            <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>
        </div>

        <div className="absolute -bottom-10 sm:-bottom-12 md:-bottom-16 left-3 sm:left-4">
          <div className="relative">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-4 border-black">
              <AvatarImage src={user.avatar} alt={user.displayName} />
              <AvatarFallback className="text-xl sm:text-2xl">
                {user.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-1 p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-black/90"
            >
              <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </Button>
          </div>
        </div>

        <div className="flex justify-end p-3 sm:p-4">
          <Button
            variant="outline"
            className="border-gray-600 text-white bg-gray-950 font-semibold rounded-full px-4 sm:px-6 text-sm sm:text-base"
            onClick={() => setShowEditModal(true)}
          >
            Edit profile
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-3 sm:px-4 pb-4 mt-12 sm:mt-14 md:mt-20">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">
              {user.displayName}
            </h1>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-gray-900"
          >
            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </Button>
        </div>

        {user.bio && (
          <p className="text-white mb-3 leading-relaxed text-sm sm:text-base">
            {user.bio}
          </p>
        )}
        {user.phone && (
          <p className="text-gray-400 text-xs sm:text-sm mb-2">
            📞 {user.phone}
          </p>
        )}

        {/* Meta info — wraps on mobile */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-400 text-xs sm:text-sm mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{user.location ?? "Earth"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-blue-400 truncate max-w-30 sm:max-w-none">
              {user.website ?? "example.com"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>
              Joined{" "}
              {user.joinedDate &&
                new Date(user.joinedDate).toLocaleDateString("en-us", {
                  month: "long",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs — scrollable on mobile */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-transparent border-b border-gray-800 rounded-none h-auto">
          {["posts", "replies", "highlights", "articles", "media"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="
                data-[state=active]:bg-transparent
                data-[state=active]:text-white
                data-[state=active]:border-b-2
                data-[state=active]:border-blue-500
                data-[state=active]:rounded-none
                text-gray-400 hover:bg-gray-900/50
                py-3 sm:py-4
                text-xs sm:text-sm
                font-semibold px-1
              "
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <div className="divide-y divide-gray-800">
            {loading ? (
              <Card className="bg-black border-none">
                <CardContent className="py-12 text-center text-gray-400">
                  Loading posts...
                </CardContent>
              </Card>
            ) : userTweets.length === 0 ? (
              <Card className="bg-black border-none">
                <CardContent className="py-12 text-center text-gray-400">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    You have not posted yet
                  </h3>
                  <p className="text-sm sm:text-base">
                    When you post, it will show up here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              userTweets.map((tweet) => (
                <TweetCard key={tweet._id} tweet={tweet} />
              ))
            )}
          </div>
        </TabsContent>

        {["replies", "highlights", "articles", "media"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <Card className="bg-black border-none">
              <CardContent className="py-12 text-center text-gray-400">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  Nothing here yet
                </h3>
                <p className="text-sm sm:text-base">
                  Content for this section will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Editprofile
        isopen={showEditModal}
        onclose={() => setShowEditModal(false)}
      />
    </div>
  );
}
