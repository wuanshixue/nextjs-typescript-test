import Image from "next/image";

const Stories= () =>{
    return(
        <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs  ">
            <div className="flex gap-8 w-max">
                {/*  Stories */}
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image src="https://images.pexels.com/photos/33578877/pexels-photo-33578877.jpeg" alt="" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-pink-300"/>
                    <span className="font-medium">Ricky</span>
                </div>
                {/*  Stories */}
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image src="https://images.pexels.com/photos/33578877/pexels-photo-33578877.jpeg" alt="" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-pink-300"/>
                    <span className="font-medium">Ricky</span>
                </div>
                {/*  Stories */}
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image src="https://images.pexels.com/photos/33578877/pexels-photo-33578877.jpeg" alt="" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-pink-300"/>
                    <span className="font-medium">Ricky</span>
                </div>
                {/*  Stories */}
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image src="https://images.pexels.com/photos/33578877/pexels-photo-33578877.jpeg" alt="" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-pink-300"/>
                    <span className="font-medium">Ricky</span>
                </div>
                {/*  Stories */}
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image src="https://images.pexels.com/photos/33578877/pexels-photo-33578877.jpeg" alt="" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-pink-300"/>
                    <span className="font-medium">Ricky</span>
                </div>
                {/*  Stories */}
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image src="https://images.pexels.com/photos/33578877/pexels-photo-33578877.jpeg" alt="" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-pink-300"/>
                    <span className="font-medium">Ricky</span>
                </div>
                {/*  Stories */}
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                    <Image src="https://images.pexels.com/photos/33578877/pexels-photo-33578877.jpeg" alt="" width={80} height={80} className="w-20 h-20 rounded-full ring-2 ring-pink-300"/>
                    <span className="font-medium">Ricky</span>
                </div>
            </div>
        </div>
    )
}
export default Stories;

