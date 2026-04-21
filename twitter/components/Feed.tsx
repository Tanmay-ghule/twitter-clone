import { useEffect, useState } from "react";
import { Tabs, TabsTrigger, TabsList } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import TweetCard from "./TweetCard";
import LoadingSpinner from "./loading-spinner";
import TweetComposer from "./TweetComposer";
import axiosInstance from "@/lib/axiosInstance";

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified?: boolean;
}

interface Tweet {
  _id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  comments: number;
  liked?: boolean;
  retweeted?: boolean;
  image?: string;
}

const Feed = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  const fetchTweets = async () => {
    try {
      setloading(true);
      const res = await axiosInstance.get<Tweet[]>("/post");
      setTweets(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handlenewtweet = (newtweet: Tweet) => {
    setTweets((prev) => [newtweet, ...prev]);
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-white">Home</h1>
        </div>

        <Tabs defaultValue="foryou" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-800 rounded-none h-auto">
            <TabsTrigger
              value="foryou"
              className="
                py-4 font-semibold rounded-none
                text-gray-400
                bg-transparent
                hover:bg-gray-900
                hover:text-white
                active:bg-gray-800
                data-[state=active]:bg-transparent
                data-[state=active]:text-white
                data-[state=active]:border-b-2
                data-[state=active]:border-white
                transition-colors duration-150
              "
            >
              For you
            </TabsTrigger>

            <TabsTrigger
              value="following"
              className="
                py-4 font-semibold rounded-none
                text-gray-400
                bg-transparent
                hover:bg-gray-900
                hover:text-white
                active:bg-gray-800
                data-[state=active]:bg-transparent
                data-[state=active]:text-white
                data-[state=active]:border-b-2
                data-[state=active]:border-white
                transition-colors duration-150
              "
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TweetComposer onTweetPosted={handlenewtweet} />

      <div className="divide-y divide-gray-800">
        {loading ? (
          <Card className="bg-black border-none">
            <CardContent className="py-12 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-400">Loading tweets...</p>
            </CardContent>
          </Card>
        ) : (
          tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        )}
      </div>
    </div>
  );
};

export default Feed;