import Image from "next/image";
import prisma from "@/lib/client";
import {auth} from "@clerk/nextjs/server";
import Link from "next/link";
const ProfileCard = async ()=>{
    const {userId} = auth();

    if(!userId) return null;

    const user = await prisma.user.findFirst({
        where:{
            id : userId,
        },
        include:{
            _count:{
                select:{
                    followers:true,
                }
            }
        }
    });
    console.log(user)

    if(!user) return null;

    return(
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
            <div className="h-20 relative">
                <Image
                    src={user.cover || "/noCover.png"}
                    alt=""
                    fill
                    className="rounded-md object-cover"
                />
                <Image
                    src={user.avatar || "/noAvatar.png"}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
                />
            </div>
            <div className="h-20 flex flex-col gap-2 items-center">
                <span className="font-semibold">
                    {(user.name && user.surname)
                    ? user.name + " " + user.surname
                    : user.username}
                </span>
                <div className="flex items-center gap-4">
                    <div className="flex">
                        <Image
                            src="https://images.pexels.com/photos/27848279/pexels-photo-27848279.jpeg"
                            alt=""
                            width={12}
                            height={12}
                            className="rounded-full object-cover w-3 h-3"
                        />
                        <Image
                            src="https://images.pexels.com/photos/33045172/pexels-photo-33045172.jpeg"
                            alt=""
                            width={12}
                            height={12}
                            className="rounded-full object-cover w-3 h-3"
                        />
                        <Image
                            src="https://images.pexels.com/photos/10396212/pexels-photo-10396212.jpeg"
                            alt=""
                            width={12}
                            height={12}
                            className="rounded-full object-cover w-3 h-3"
                        />
                    </div>
                    <span className="text-xs text-gray-500">{user._count.followers}</span>
                </div>
                <Link
                    href={`/profile/${
                        user?.name && user?.surname
                            ? `${user.name} ${user.surname}`
                            : user?.username
                    }`}
                    className="bg-blue-500 text-white text-xs p-2 rounded-md text-center"
                >
                    个人页面
                </Link>

            </div>
        </div>
    )
}
export default ProfileCard
