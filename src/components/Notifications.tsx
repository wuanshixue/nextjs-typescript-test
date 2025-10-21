"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNotifications, readConversation } from "@/lib/actions";
import { User, Message, Conversation } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";

type NotificationWithSender = Message & {
  sender: User;
  conversation: Conversation;
};

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationWithSender[]>(
    []
  );
  const { userId } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
          const notifs = await getNotifications(userId ?? null);
          setNotifications(notifs);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (userId) {
      fetchNotifications();
      // Optional: Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const handleRead = async (notification: NotificationWithSender) => {
    try {
      await readConversation(notification.conversationId);
      setNotifications((prev) =>
        prev.filter((n) => n.conversationId !== notification.conversationId)
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
    setIsOpen(false);
  };

  const uniqueNotifications = notifications.reduce((acc, current) => {
    if (!acc.find((item) => item.sender.id === current.sender.id)) {
      acc.push(current);
    }
    return acc;
  }, [] as NotificationWithSender[]);

  return (
    <div className="relative">
      <div
        className="cursor-pointer relative"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Image src="/notifications.png" alt="" width={20} height={20} />
        {uniqueNotifications.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {uniqueNotifications.length}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute p-4 bg-white rounded-lg shadow-lg flex flex-col gap-2 z-20 w-80 -right-4 top-8">
          <div className="font-semibold text-gray-600">通知</div>
          {uniqueNotifications.length > 0 ? (
            uniqueNotifications.map((notif) => (
              <Link
                href={`/messages/${notif.sender.id}`}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
                key={notif.id}
                onClick={() => handleRead(notif)}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={notif.sender.avatar || "/noAvatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {notif.sender.username}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-40">
                      {notif.text}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-400 text-sm p-4">
              没有新通知
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
