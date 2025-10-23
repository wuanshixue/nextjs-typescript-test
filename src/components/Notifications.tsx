"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNotifications, readConversation } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";

// 为了兼容服务端序列化（如 Date -> string），定义一个用于客户端展示的最小通知类型
type NotificationItem = {
  id: number;
  text: string;
  senderId: string;
  conversationId: number;
  sender: { id: string; username?: string | null; avatar?: string | null };
  conversation: { id: number };
};

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    []
  );
  const { userId } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await getNotifications(userId ?? null);
        if (Array.isArray(notifs)) {
          const toNumber = (v: unknown) =>
            typeof v === "number" ? v : Number(v ?? 0);
          const toString = (v: unknown) =>
            typeof v === "string" ? v : String(v ?? "");

          const mapped: NotificationItem[] = notifs.map((n: unknown) => {
            const obj = (n ?? {}) as Record<string, unknown>;
            const senderObj = (obj.sender ?? {}) as Record<string, unknown>;
            const convObj = (obj.conversation ?? {}) as Record<string, unknown>;
            const conversationId =
              toNumber(obj.conversationId ?? convObj.id ?? 0);

            return {
              id: toNumber(obj.id),
              text: toString(obj.text),
              senderId: toString(obj.senderId),
              conversationId,
              sender: {
                id: toString(senderObj.id),
                username:
                  typeof senderObj.username === "string"
                    ? senderObj.username
                    : null,
                avatar:
                  typeof senderObj.avatar === "string"
                    ? senderObj.avatar
                    : null,
              },
              conversation: { id: conversationId },
            };
          });
          setNotifications(mapped);
        } else {
          setNotifications([]);
        }
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

  const handleRead = async (notification: NotificationItem) => {
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
  }, [] as NotificationItem[]);

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
