import Image from "next/image";

const Comments=()=>{
    return (
    <div className="">
        {/*写WRITE*/}
        <div className="flex items-center gap-4">
            <Image src="https://images.pexels.com/photos/33570548/pexels-photo-33570548.jpeg"
                   alt=""
                   width={32}
                   height={32}
                   className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
                <input type="text"
                       placeholder="写评论..."
                       className="bg-transparent outline-none flex-1"
                />
                <Image src="/emoji.png"
                       alt=""
                       width={16}
                       height={16}
                       className="cursor-pointer"
                />
            </div>
        </div>
        {/*评论*/}
        <div className="">
            {/*评论*/}
            <div className="flex gap-4 justify-between mt-6">
                {/*头像*/}
                <Image src="https://images.pexels.com/photos/33570548/pexels-photo-33570548.jpeg"
                       alt=""
                       width={40}
                       height={40}
                       className="w-10 h-10 rounded-full"
                />
                {/*描述*/}
                <div className="flex flex-col gap-2 flex-1">
                    <span className="font-medium">Bob</span>
                    <p>
                        评论评论评论评论评论评论评论评论评论评论评论评论，
                        评论评论评论评论评论评论评论评论评论评论评论评论，
                        评论评论评论评论评论评论评论评论评论评论评论评论。
                    </p>
                    <div className="flex items-center gap-8 text-xs text-gray-500">
                        <div className="flex items-center gap-4 mt-2">
                            <Image src="/like.png"
                                   alt=""
                                   width={16}
                                   height={16}
                                   className="cursor-pointer w-4 h-4"
                            />
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500">123 Likes</span>
                        </div>
                        <div className="">
                            Reply
                        </div>
                    </div>
                </div>
                {/*图标*/}
                <Image src="/more.png"
                       alt=""
                       width={16}
                       height={16}
                       className="cursor-pointer w-4 h-4"
                />
            </div>
        </div>
    </div>
    )
}

export default Comments
