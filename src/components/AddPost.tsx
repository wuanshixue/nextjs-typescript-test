"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import AddPostButton from "@/components/AddPostButton";
import { addPost } from "@/lib/actions";

interface MediaInfo {
  secure_url: string;
  resource_type: string;
}

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState<{ img: string; video: string }>({
    img: "",
    video: "",
  });

  if (!isLoaded) {
    return "加载中...";
  }

  const handleSuccess = (result: any, widget: any) => {
    const info = result.info as MediaInfo;
    if (info.resource_type === "video") {
      setMedia((prev) => ({ ...prev, video: info.secure_url }));
    } else {
      setMedia((prev) => ({ ...prev, img: info.secure_url }));
    }
    widget.close();
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form
          action={(formData) => addPost(formData, media)}
          className="flex gap-4"
        >
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <div className="">
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={handleSuccess}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addimage.png" alt="" width={20} height={20} />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget>
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={handleSuccess}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addVideo.png" alt="" width={20} height={20} />
                  Video
                </div>
              );
            }}
          </CldUploadWidget>
        </div>
      </div>
    </div>
  );
};
export default AddPost;

