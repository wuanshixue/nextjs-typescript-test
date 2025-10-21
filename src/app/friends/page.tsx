import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const FriendsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const followings = await prisma.follower.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: true,
    },
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg text-sm">
      <h1 className="font-bold text-2xl text-gray-800 mb-6 border-b pb-4">
        我的好友
      </h1>
      {followings.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          您还没有关注任何人。
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {followings.map((follow) => (
            <div
              className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              key={follow.following.id}
            >
              <Link href={`/profile/${follow.following.username}`}>
                <Image
                  src={follow.following.avatar || "/noAvatar.png"}
                  alt={follow.following.username}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md"
                />
              </Link>
              <Link
                href={`/profile/${follow.following.username}`}
                className="w-full"
              >
                <span className="font-semibold text-gray-900 block truncate">
                  {follow.following.name && follow.following.surname
                    ? `${follow.following.name} ${follow.following.surname}`
                    : follow.following.username}
                </span>
              </Link>
              <Link
                href={`/messages/${follow.following.id}`}
                className="mt-4 bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                发消息
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
