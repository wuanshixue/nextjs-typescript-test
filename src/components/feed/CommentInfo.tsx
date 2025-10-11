"use client";

import { deleteComment } from "@/lib/actions";
import Image from "next/image";
import { useState } from "react";

const CommentInfo = ({
                         commentId,
                         onDelete,
                     }: {
    commentId: number;
    onDelete?: () => void; // ✅ 新增回调
}) => {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteComment(commentId);
            onDelete?.(); // 调用回调删除前端评论
        } catch (err) {
            console.error("删除失败", err);
        }
    };

    return (
        <div className="relative">
            <Image
                src="/more.png"
                width={16}
                height={16}
                alt=""
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer"
            />
            {open && (
                <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-sm shadow-lg z-30">
                    <button
                        onClick={handleDelete}
                        className="text-red-500"
                    >
                        删除
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentInfo;
