import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Follower, User } from "@prisma/client";

type FollowingWithUser = Follower & {
  following: User;
};

const Friends = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const followings: FollowingWithUser[] = await prisma.follower.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: true,
    },
  });

  if (followings.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-sm flex flex-col gap-4">
      <span className="text-gray-500">Following</span>
      <div className="flex flex-col gap-4">
        {followings.map((follow) => (
          <div className="flex items-center justify-between" key={follow.following.id}>
            <Link
              href={`/profile/${follow.following.username}`}
              className="flex items-center gap-4"
            >
              <Image
                src={follow.following.avatar || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">
                {(follow.following.name && follow.following.surname)
                  ? follow.following.name + " " + follow.following.surname
                  : follow.following.username}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
