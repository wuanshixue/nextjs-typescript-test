"use client";

import Image from "next/image";
import { Comment, User } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { addComment, switchCommentLike } from "@/lib/actions";
import CommentInfo from "@/components/feed/CommentInfo";

// 扩展类型：包含关联的用户与点赞用户ID列表
type CommentWithUser = Comment & { user: User; likes: { userId: string }[] };

const CommentList = ({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: number;
}) => {
  const { user } = useUser();
  const [commentState, setCommentState] = useState<CommentWithUser[]>(comments);
  const [desc, setDesc] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null); // 被回复的用户名
  const [replyParentId, setReplyParentId] = useState<number | null>(null); // 被回复的评论ID
  const inputRef = useRef<HTMLInputElement | null>(null);

  const add = async () => {
    if (!user || !desc.trim()) return;

    // 生成临时ID用于乐观UI
    const tempId = -Math.floor(Math.random() * 1e9);

    // 确保带上 @mention 前缀
    const textToSend = replyTo && !desc.startsWith(`@${replyTo} `)
      ? `@${replyTo} ${desc}`
      : desc;

    // 乐观评论
    const optimisticNew: CommentWithUser = {
      id: tempId,
      desc: textToSend,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId,
      parentCommentId: replyParentId ?? null,
      user: {
        id: user.id,
        username: user.username || user.primaryEmailAddress?.emailAddress || "user",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: user.firstName || "",
        surname: user.lastName || "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(),
      },
      likes: [],
    } as CommentWithUser;

    setCommentState((prev) => [optimisticNew, ...prev]);

    try {
      const createdComment = await addComment(postId, textToSend);
      type CreatedComment = Comment & { user: User };
      const normalized: CommentWithUser = { ...(createdComment as CreatedComment), likes: [] };
      // 用真实评论替换乐观评论
      setCommentState((prev) => [normalized, ...prev.filter((c) => c.id !== tempId)]);
      setDesc("");
      setReplyTo(null);
      setReplyParentId(null);
    } catch (err) {
      console.error(err);
      // 失败时移除乐观评论
      setCommentState((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  const isLikedByMe = (c: CommentWithUser) => {
    if (!user) return false;
    return c.likes?.some((l) => l.userId === user.id) || false;
  };

  const likeCount = (c: CommentWithUser) => c.likes?.length || 0;

  const toggleLike = async (commentId: number) => {
    if (!user) return;

    // 乐观更新本地 likes
    setCommentState((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const liked = c.likes?.some((l) => l.userId === user.id);
        if (liked) {
          return { ...c, likes: c.likes.filter((l) => l.userId !== user.id) };
        } else {
          return { ...c, likes: [...(c.likes || []), { userId: user.id }] };
        }
      })
    );

    try {
      await switchCommentLike(commentId);
    } catch {
      // 回滚
      setCommentState((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const liked = c.likes?.some((l) => l.userId === user.id);
          if (liked) {
            return { ...c, likes: c.likes.filter((l) => l.userId !== user.id) };
          } else {
            return { ...c, likes: [...(c.likes || []), { userId: user.id }] };
          }
        })
      );
    }
  };

  const handleReply = (replyUsername: string, parentId: number) => {
    setReplyTo(replyUsername);
    setReplyParentId(parentId);
    const atPrefix = `@${replyUsername} `;
    // 如果已经以该 @ 前缀开头，就不重复添加
    setDesc((prev) => (prev.startsWith(atPrefix) ? prev : atPrefix + prev.replace(/^@\S+\s+/, "")));
    // 聚焦输入框
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyTo(null);
    setReplyParentId(null);
    setDesc((prev) => prev.replace(/^@\S+\s+/, ""));
  };

  return (
    <>
      {/* 评论输入框 */}
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user?.imageUrl || "/noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            action={add}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <div className="flex-1 flex items-center gap-2">
              {replyTo && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  回复 @{replyTo}
                  <button type="button" className="ml-1 text-gray-500" onClick={cancelReply}>
                    ×
                  </button>
                </span>
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder={replyTo ? `回复 @${replyTo}` : "写评论..."}
                className="bg-transparent outline-none flex-1"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <Image src="/emoji.png" alt="" width={16} height={16} className="cursor-pointer" />
          </form>
        </div>
      )}

      {/* 评论列表 */}
      <div>
        {commentState.map((comment) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            {/* 头像 */}
            <Image
              src={comment.user.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />

            {/* 评论内容 */}
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">
                {comment.user.name && comment.user.surname
                  ? `${comment.user.name} ${comment.user.surname}`
                  : comment.user.username}
              </span>
              <p>{comment.desc}</p>

              <div className="flex items-center gap-8 text-xs text-gray-500">
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className="flex items-center gap-2"
                    type="button"
                    aria-label={isLikedByMe(comment) ? "取消点赞" : "点赞"}
                  >
                    <Image
                      src={isLikedByMe(comment) ? "/liked.png" : "/like.png"}
                      alt=""
                      width={16}
                      height={16}
                      className="cursor-pointer w-4 h-4"
                    />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">{likeCount(comment)} Likes</span>
                  </button>
                </div>
                <button
                  className="flex items-center gap-4 mt-2"
                  type="button"
                  onClick={() => handleReply(comment.user.username, comment.id)}
                >
                  Reply
                </button>
              </div>
            </div>

            {/* 删除按钮 */}
            {user?.id === comment.userId && (
              <CommentInfo
                commentId={comment.id}
                onDelete={() => {
                  setCommentState((prev) => prev.filter((c) => c.id !== comment.id));
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentList;
