import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import AddPost from "@/components/AddPost";
import Feed from "@/components/feed/Feed";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const HomePage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { userId } = auth();
  const tabParam = (searchParams?.tab as string) || "feed";
  const tab: "feed" | "recommend" =
    tabParam === "recommend" ? "recommend" : "feed";
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <AddPost />
          {/* Tabs */}
          <div className="sticky top-0 z-10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/30 rounded-lg border p-1 flex w-fit gap-1">
            <Link
              href="/?tab=feed"
              className={`px-3 py-1.5 rounded-md text-sm ${
                tab === "feed" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-slate-100"
              }`}
              prefetch={false}
            >
              动态
            </Link>
            <Link
              href="/?tab=recommend"
              className={`px-3 py-1.5 rounded-md text-sm ${
                tab === "recommend" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-slate-100"
              }`}
              prefetch={false}
            >
              推荐
            </Link>
          </div>
          <Feed currentUserId={userId} mode={tab} />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};
export default HomePage;
