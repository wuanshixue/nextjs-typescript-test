"use client"

import { useState } from "react";
import Image from "next/image";
import {updateProfile} from "@/lib/actions";
import { CldUploadWidget } from "next-cloudinary";
import {useRouter} from "next/navigation";
import UpdateButton from "@/components/rightMenu/UpdateButton";

type UpdateUserShape = {
    cover?: string | null;
    name?: string | null;
    surname?: string | null;
    description?: string | null;
    city?: string | null;
    school?: string | null;
    work?: string | null;
    website?: string | null;
};

const UpdateUser=({user}:{user?:UpdateUserShape})=>{

    const [open, setOpen] = useState(false);
    const [cover, setCover] = useState<{ secure_url?: string } | null>(null);

    const router = useRouter()

    const handleClose = () => {
        setOpen(false);
        router.refresh();

    };

    return(
        <div className="">
            <span
                className="text-blue-500 text-sm cursor-pointer"
                onClick={()=>setOpen(true)}
            >
                Update
            </span>
            {open && (
                <div className="absolute w-screen h-screen top-0 left-0 bg-black/65 flex items-center justify-center z-50">
                    <form
                        action={(formData)=>updateProfile(formData,cover?.secure_url || "")}
                        className="relative p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3"
                    >
                        {/* TITTLE */}
                        <h1>Update Profile</h1>
                        <div className="mt-4 text-xs text-gray-500">
                            Use the navbar profile...
                        </div>
                        {/* COVER PICTURE */}
                        <CldUploadWidget
                            uploadPreset="social"
                            // Cloudinary types can vary; we only read info.secure_url
                            // @ts-expect-error - runtime provides info
                            onSuccess={(result) => setCover(result.info)}
                        >
                            {({ open }) => {
                                return (
                                    <div className="flex flex-col gap-4 my-4" onClick={()=>open()}>
                                        <label htmlFor="">Cover Picture</label>
                                        <div className="flex items-cenyer gap-2 cursor-pointer">
                                            <Image
                                                src={user?.cover || "/noCover.png"}
                                                alt=""
                                                width={48}
                                                height={32}
                                                className="w-12 h-8 rounded-md object-cover"/>
                                            <span className="text-xs underline text-gray-600">Change</span>
                                        </div>
                                    </div>
                                );
                            }}
                        </CldUploadWidget>

                        {/* WRAPPER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* INPUT */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">First Name</label>
                                <input
                                    type="text"
                                    placeholder={user?.name || "John"}
                                    className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                                    name="name"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Surname</label>
                                <input
                                    type="text"
                                    placeholder={user?.surname || "Doe"}
                                    className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                                    name="surname"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Description</label>
                                <input
                                    type="text"
                                    placeholder={user?.description || "Life is beautiful..."}
                                    className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                                    name="desc"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">City</label>
                                <input
                                    type="text"
                                    placeholder={user?.city || "New York"}
                                    className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                                    name="city"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">School</label>
                                <input
                                    type="text"
                                    placeholder={user?.school || "MIT"}
                                    className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                                    name="school"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Work</label>
                                <input
                                    type="text"
                                    placeholder={user?.work || "Apple Inc."}
                                    className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                                    name="work"
                                />
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-xs text-gray-500">Website</label>
                                <input
                                    type="text"
                                    placeholder={user?.website || "lama.dev"}
                                    className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                                    name="website"

                                />
                            </div>
                        </div>
                        <UpdateButton/>
                        <div
                            className="absolute text-xl right-4 top-3 cursor-pointer"
                            onClick={handleClose}
                        >
                            X
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
export default UpdateUser;
