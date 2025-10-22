"use client";

import Image from "next/image";
import { Comment, User, Like } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useOptimistic, useState } from "react";
import { addComment } from "@/lib/actions";
import CommentInfo from "@/components/feed/CommentInfo"; // ✅ 新增导入

type CommentWithUser = Comment & {
    user: User;
    likes?: Like[];
    _count?: { likes: number };
};

const CommentList = ({
                         comments,
                         postId,
                     }: {
    comments: CommentWithUser[];
    postId: number;
}) => {
    const { user } = useUser();
    const [commentState, setCommentState] = useState(comments);
    const [desc, setDesc] = useState("");

    const add = async () => {
        if (!user || !desc) return;

        addOptimisticComment({
            id: Math.random(),
            desc,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user.id,
            postId,
            user: {
                id: user.id,
                username: "Sending Please Wait...",
                avatar: user.imageUrl || "/noAvatar.png",
                cover: "",
                description: "",
                name: "",
                surname: "",
                city: "",
                work: "",
                school: "",
                website: "",
                createdAt: new Date(),
            },
            likes: [],
            _count: {
                likes: 0,
            },
        });

        try {
            const createdComment = await addComment(postId, desc);
            setCommentState((prev) => [createdComment, ...prev]);
            setDesc(""); // ✅ 清空输入框
        } catch (err) {
            console.error(err);
        }
    };

    const [optimisticComment, addOptimisticComment] = useOptimistic(
        commentState,
        (state, value: CommentWithUser) => [value, ...state]
    );

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
                        <input
                            type="text"
                            placeholder="写评论..."
                            className="bg-transparent outline-none flex-1"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                        <Image
                            src="/emoji.png"
                            alt=""
                            width={16}
                            height={16}
                            className="cursor-pointer"
                        />
                    </form>
                </div>
            )}

            {/* 评论列表 */}
            <div>
                {optimisticComment.map((comment) => (
                    <div
                        className="flex gap-4 justify-between mt-6"
                        key={comment.id}
                    >
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
                                    <Image
                                        src="/like.png"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="cursor-pointer w-4 h-4"
                                    />
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500">{comment._count?.likes || 0} Likes</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    Reply
                                </div>
                            </div>
                        </div>

                        {/* 删除按钮（ */}
                        {user?.id === comment.userId && (
                            <CommentInfo
                                commentId={comment.id}
                                onDelete={() => {
                                    setCommentState((prev) =>
                                        prev.filter((c) => c.id !== comment.id)
                                    );
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
