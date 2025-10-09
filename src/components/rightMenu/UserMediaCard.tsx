import Link from "next/link";
import Image from "next/image";
import {User} from "@prisma/client";

const UserMediaCard=({user}:{user?:User})=>{
    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            {/*TOP*/}
            <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">User Media</span>
                <Link href="/public" className="text-blue-500 text-sm">
                    See all
                </Link>
            </div>
            {/*BOTTOM*/}
            <div className="flex gap-4 justify-between flex-wrap">
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/33558172/pexels-photo-33558172.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/31901163/pexels-photo-31901163.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/33705333/pexels-photo-33705333.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/13635192/pexels-photo-13635192.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/33528679/pexels-photo-33528679.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/33591236/pexels-photo-33591236.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/10396212/pexels-photo-10396212.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="relative w-1/5 h-24">
                    <Image
                        src="https://images.pexels.com/photos/30100793/pexels-photo-30100793.jpeg"
                        alt=""
                        fill
                        className="object-cover rounded-md"
                    />
                </div>
            </div>
        </div>
    )
}
export default UserMediaCard;
