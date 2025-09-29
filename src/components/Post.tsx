import Image from "next/image";
import Comments from "./Comments";
const Post=()=>{
    return(
        <div className="flex flex-col gap-4">
            {/*用户*/}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image src="https://images.pexels.com/photos/33646928/pexels-photo-33646928.jpeg"
                           alt=""
                           width={40}
                           height={40}
                           className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium">Beach Lucy</span>
                </div>
                <Image src="/more.png" alt="" width={16} height={16}/>
            </div>
            {/*描述*/}
            <div className="flex flex-col gap-4">
                <div className="w-full min-h-96 relative">
                    <Image src="https://images.pexels.com/photos/32859501/pexels-photo-32859501.jpeg"
                           alt=""
                           fill
                           className="object-cover rounded-md"
                    />
                </div>
                <p>句子句子句子句子句子句子句子句子句子句子句子句子句子句子句子句子,
                    句子句子句子句子句子句子句子句子句子句子句子句子句子句子,
                    句子句子句子句子句子句子句子句子句子句子句子句子句子句子句子句子。</p>
            </div>
            {/*交互*/}
            <div className="flex items-center justify-between text-sm my-4">
                <div className="flex gap-8">
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <Image src="/like.png"
                               alt=""
                               width={16}
                               height={16}
                               className="cursor-pointer"
                        />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">
                            123
                            <span className="hidden md:inline"> Likes</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <Image src="/comment.png"
                               alt=""
                               width={16}
                               height={16}
                               className="cursor-pointer"
                        />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">
                            123
                            <span className="hidden md:inline"> Comments</span>
                        </span>
                    </div>
                </div>
                <div className="">
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                        <Image src="/share.png"
                               alt=""
                               width={16}
                               height={16}
                               className="cursor-pointer"
                        />
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">
                            123
                            <span className="hidden md:inline"> Shares</span>
                        </span>
                    </div>
                </div>
            </div>
            {/*评论*/}
            <Comments/>
        </div>
    )
}
export default Post
