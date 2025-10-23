import prisma from "@/lib/client";
import CommentList from "@/components/feed/CommentList";
import { serializeForClient } from "@/lib/serializeForClient";

const Comments = async ({postId}:{postId:number})=>{

    const comments = await prisma.comment.findMany({
        where: {
            postId,
        },
        include: {
            user: true,
            likes: {
                select: { userId: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    const safeComments = serializeForClient(comments);
    return (
    <div className="">
        {/* @ts-expect-error - data serialized for client */}
        <CommentList comments={safeComments} postId={postId}/>
    </div>
    )
}

export default Comments
