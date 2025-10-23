import Post from "./Post";
import prisma from "@/lib/client";
import { Post as PostType, User } from "@prisma/client";

type PostWithExtras = PostType & {
  user: User;
  likes: { userId: string }[];
  _count: {
    comments: number;
  };
};

const Feed = async ({
  username,
  currentUserId,
  mode = "feed",
}: {
  username?: string;
  currentUserId: string | null;
  mode?: "feed" | "recommend";
}) => {
  let posts: PostWithExtras[] = [];

  if (username) {
    posts = await prisma.post.findMany({
      where: {
        user: {
          username: username,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  if (!username && mode === "feed" && currentUserId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });
    const followingIds = following.map((f) => f.followingId);
    const ids = [currentUserId, ...followingIds];

    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // 推荐：取每个用户点赞量最高的那篇 post
  if (!username && mode === "recommend") {
    // 取有发过帖的部分用户，限制数量避免一次性查太多
    const usersWithPosts = await prisma.user.findMany({
      where: { posts: { some: {} } },
      select: { id: true },
      take: 60,
      orderBy: { createdAt: "desc" },
    });
    const topPosts = await Promise.all(
      usersWithPosts.map(async (u) => {
        const p = await prisma.post.findFirst({
          where: { userId: u.id },
          include: {
            user: true,
            likes: { select: { userId: true } },
            _count: { select: { comments: true } },
          },
          orderBy: [
            { likes: { _count: "desc" } },
            { createdAt: "desc" },
          ],
        });
        return p as PostWithExtras | null;
      })
    );
    posts = topPosts.filter(Boolean) as PostWithExtras[];
    // 按点赞数降序排序
    posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  }

  return (
    <div className="p-4 bg-white shadow-md border-lg flex flex-col gap-12">
      {posts.length
        ? posts.map((post) => <Post key={post.id} post={post} />)
        : "No posts found!"}
    </div>
  );
};
export default Feed;
