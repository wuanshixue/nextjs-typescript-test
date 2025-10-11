import Image from "next/image";
import prisma from "@/lib/client";
import CommentList from "@/components/feed/CommentList";

const Comments = async ({postId}:{postId:number})=>{

    const comments = await prisma.comment.findMany({
        where: {
            postId,
        },
        include: {
            user: true,
        },
    });
    return (
    <div className="">
        <CommentList comments={comments} postId={postId}/>
    </div>
    )
}

export default Comments
