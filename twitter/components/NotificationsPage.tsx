"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface Sender {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface TweetData {
  _id: string;
  content?: string;
  audio?: string;
  image?: string;
}

interface NotificationType {
  _id: string;
  sender: Sender;
  tweet: TweetData;
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get<NotificationType[]>(
        `/notifications/${user._id}`
      );
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async () => {
    if (!user) return;
    await axiosInstance.patch(`/notifications/read/${user._id}`);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 border-b border-gray-800 flex justify-between">
        <h1 className="text-xl font-bold">Notifications</h1>
        <Button size="sm" className="bg-blue-500" onClick={markAsRead}>
          Mark all as read
        </Button>
      </div>

      {loading ? (
        <p className="p-4 text-gray-400">Loading...</p>
      ) : (
        notifications.map((notif) => (
          <Card
            key={notif._id}
            className={`border-b border-gray-800 rounded-none ${
              !notif.isRead ? "bg-gray-900/40" : "bg-black"
            }`}
          >
            <CardContent className="p-4 flex gap-3">
              <Avatar>
                <AvatarImage src={notif.sender?.avatar} />
                <AvatarFallback>
                  {notif.sender?.displayName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p>
                  <span className="font-semibold">
                    {notif.sender?.displayName}
                  </span>{" "}
                  posted a new tweet
                </p>

                {notif.tweet?.content && (
                  <p className="text-gray-400 mt-1 text-sm">
                    &quot;{notif.tweet.content}&quot;
                  </p>
                )}

                {notif.tweet?.audio && (
                  <p className="text-blue-400 text-sm mt-1">
                    🎵 Audio Tweet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
