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
          <div className="sticky top-0 z-10">
            <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50 p-1 shadow-sm">
              <Link
                href="/?tab=feed"
                prefetch={false}
                className={`px-4 py-2 rounded-xl text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  tab === "feed"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                动态
              </Link>
              <Link
                href="/?tab=recommend"
                prefetch={false}
                className={`px-4 py-2 rounded-xl text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  tab === "recommend"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                推荐
              </Link>
            </div>
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
