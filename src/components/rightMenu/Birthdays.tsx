import Link from "next/link";
import Image from "next/image";

const Birthdays=()=>{
    return(
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            {/*TOP*/}
            <div className="flex items-center justify-between font-medium">
                <span className="text-gray-500">Birthdays</span>
            </div>
            {/*用户*/}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src="https://images.pexels.com/photos/33397973/pexels-photo-33397973.jpeg"
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold">wuanshixue</span>
                </div>
                <div className="flex gap-3 justify-end">
                    <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">庆祝</button>
                </div>
            </div>
            {/*UPCOMING*/}
            <div className="p-4 bg-salte-100 rounded-lg flex items-center gap-4">
                <Image
                    src="/gift.png"
                    alt=""
                    width={24}
                    height={24}
                />
                <Link href="/public" className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-500 font-semibold">Upcoming</span>
                    <span className="text-gray-500">10th of July</span>
                </Link>
            </div>
        </div>
    )
}
export default Birthdays
