import Link from "next/link";
import Image from "next/image";
import {User} from "@prisma/client";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import UserInfoCardInteraction from "@/components/rightMenu/UserInfoCardInteraction";
import UpdateUser from "@/components/rightMenu/updateUser";


const UserInfoCard = async ({user}:{user?:User})=>{

    if (!user) return null;
    const createdAtDate = new Date(user.createdAt)

    const formattedDate = createdAtDate.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    let isUserBlocked = false
    let isFollowing = false
    let isFollowingSent = false

    const {userId:currentUserId} = auth();

    if(currentUserId){
        const blockRes = await prisma.block.findFirst({
            where:{
                blockerId:currentUserId,
                blockedId:user.id,
            }
        })

    isUserBlocked = !!blockRes;
        const followRes = await prisma.follower.findFirst({
            where:{
                followerId:currentUserId,
                followingId:user.id,
            }
        })

    isFollowing = !!followRes;
        const followReqRes = await prisma.followRequest.findFirst({
            where:{
                senderId:currentUserId,
                receiverId:user.id,
            }
        })
    isFollowingSent = !!followReqRes;
    }

    return(
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            {/*TOP*/}
            <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">User Info</span>
                {currentUserId === user.id ? (
                    <UpdateUser user={{
                        cover: user.cover ?? null,
                        name: user.name ?? null,
                        surname: user.surname ?? null,
                        description: user.description ?? null,
                        city: user.city ?? null,
                        school: user.school ?? null,
                        work: user.work ?? null,
                        website: user.website ?? null,
                    }}/>
                ) :(
                    <Link href="/public" className="text-blue-500 text-sm">
                    See all
                </Link>)}
            </div>
            {/*BOTTOM*/}
            <div className="flex flex-col gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-black">
                        {user?.name && user?.surname
                            ? `${user.name} ${user.surname}`
                            : user?.username}
                    </span>
                    <span className="text-sm">@{user?.username ?? "unknown"}</span>

                </div>
                {user?.description && <p className="">
                    {user?.description}
                </p>}
                { user?.city && <div className="flex items-center gap-2">
                    <Image src="/map.png" alt="" width={16} height={16}/>
                    <span className="">
                        Living in <b>{user?.city}</b>
                    </span>
                </div>}
                {user?.school && <div className="flex items-center gap-2">
                    <Image src="/school.png" alt="" width={16} height={16}/>
                    <span className="">
                        在读<b>{user?.school}</b>
                    </span>
                </div>}
                {user?.work && <div className="flex items-center gap-2">
                    <Image src="/work.png" alt="" width={16} height={16}/>
                    <span className="">
                        Works at <b>{user?.work}</b>
                    </span>
                </div>}
                <div className="flex items-center justify-between">
                    {user?.website && <div className="flex gap-1 items-center">
                        <Image src="/link.png" alt="" width={16} height={16}/>
                        <Link href={user?.website} className="text-blue-500 font-medium">
                            {user?.website}
                        </Link>
                    </div>}
                    <div className="flex gap-1 items-center">
                        <Image src="/date.png" alt="" width={16} height={16}/>
                        <span className="">Joined {formattedDate}</span>
                    </div>
                </div>
                {currentUserId && currentUserId !== user.id && (
                    <UserInfoCardInteraction
                        userId={user.id}
                        isUserBlocked={isUserBlocked}
                        isFollowing={isFollowing}
                        isFollowingSent={isFollowingSent}
                />
                )}
            </div>
        </div>
    )
}
export default UserInfoCard;
