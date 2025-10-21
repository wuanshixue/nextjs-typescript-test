"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { getConversation, sendMessage, readConversation } from "@/lib/actions";
import { User } from "@prisma/client";

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const Chat = ({ receiver }: { receiver: User }) => {
  const { userId: currentUserId } = useAuth();
  const [conversation, setConversation] = useState<any>(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!currentUserId) return;
      try {
        const conv = await getConversation(receiver.id);
        setConversation(conv);
        if (conv) {
          await readConversation(conv.id);
        }
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversation();
  }, [receiver.id, currentUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentUserId) return;

    try {
      const newMessage = await sendMessage(receiver.id, text);
      setConversation((prev: any) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (isLoading || !currentUserId) {
    return (
      <div className="flex flex-col h-[calc(100vh-150px)] items-center justify-center bg-slate-100 rounded-2xl">
        <div className="text-gray-500">正在加载聊天...</div>
      </div>
    );
  }

  const telegramBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d7e3f2' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundColor: "#e5eef8",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-white rounded-2xl shadow-lg border">
      {/* TOP */}
      <div className="flex items-center gap-4 p-3 border-b bg-white rounded-t-2xl z-10 shadow-sm">
        <Image
          src={receiver.avatar || "/noAvatar.png"}
          alt={receiver.username}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="font-bold text-lg text-gray-800">
          {receiver.username}
        </span>
      </div>
      {/* MESSAGES */}
      <div
        className="flex-1 p-4 md:p-6 overflow-y-auto"
        style={telegramBg}
      >
        {conversation?.messages?.map((message: any) => (
          <div
            className={`flex items-end gap-2 my-2 ${
              message.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
            key={message.id}
          >
            {message.senderId !== currentUserId && (
              <Image
                src={receiver.avatar || "/noAvatar.png"}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover self-end mb-1"
              />
            )}
            <div
              className={`p-2 rounded-2xl max-w-sm md:max-w-md ${
                message.senderId === currentUserId
                  ? "bg-sky-500 text-white rounded-br-lg"
                  : "bg-white text-gray-800 rounded-bl-lg shadow-sm"
              }`}
            >
              <div className="relative">
                <p className="text-sm break-words pr-12 pb-2.5">{message.text}</p>
                <span className="text-xs absolute bottom-0 right-0 opacity-60">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      {/* BOTTOM */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t flex gap-3 items-center bg-white rounded-b-2xl z-10"
      >
        <input
          type="text"
          placeholder="输入消息..."
          className="flex-1 p-3 border-none rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-shadow"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-sky-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 disabled:bg-sky-300 disabled:cursor-not-allowed"
          disabled={!text.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-send -ml-0.5"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
