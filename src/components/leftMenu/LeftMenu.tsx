import ProfileCard from "@/components/leftMenu/ProfileCard";
import Link from "next/link";
import Image from "next/image";
import Ad from "@/components/Ad";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

type MenuItem = { href: string; label: string; icon: string };

const explore: MenuItem[] = [
    { href: "https://www.bilibili.com/", label: "Videos", icon: "/videos.png" },
    { href: "https://y.music.163.com/m/user?id=539575920", label: "Music", icon: "/lists.png" },
    { href: "https://www.msn.cn/zh-cn/channel/topic", label: "News", icon: "/news.png" },
    { href: "https://www.msn.cn/zh-cn/weather/forecast", label: "Weather", icon: "/courses.png" },
    ];

const Section = ({ title, items }: { title: string; items: MenuItem[] }) => (
    <div className="flex flex-col gap-1">
        <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {title}
        </div>
        <nav aria-label={title} className="flex flex-col">
            {items.map((it) => {
                const isExternal = /^https?:\/\//i.test(it.href);
                const commonClass =
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors";
                const content = (
                    <>
                        <Image src={it.icon} alt="" width={18} height={18} className="opacity-80" />
                        <span className="text-sm">{it.label}</span>
                    </>
                );
                return isExternal ? (
                    <a
                        key={it.label}
                        href={it.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={commonClass}
                    >
                        {content}
                    </a>
                ) : (
                    <Link key={it.label} href={it.href} className={commonClass}>
                        {content}
                    </Link>
                );
            })}
        </nav>
    </div>
);

const LeftMenu = async ({ type }: { type: "home" | "profile" }) => {
    // 动态生成“我的帖子”链接：已登录 -> /profile/[username]；未登录 -> /sign-in
    const { userId } = await auth();
    let myPostsHref = "/sign-in";
    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        });
        if (user?.username) myPostsHref = `/profile/${user.username}`;
    }

    const personalItems: MenuItem[] = [
        { href: myPostsHref, label: "My Posts", icon: "/posts.png" },
        { href: "/public", label: "Activity", icon: "/activity.png" },
    ];
    return (
        <div className="flex flex-col gap-6">
            {type === "home" && <ProfileCard />}

            <aside className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 p-3 shadow-sm">
                <div className="flex flex-col gap-4">
                    <Section title="个人" items={personalItems} />
                    <div className="h-px bg-slate-100 mx-2" />
                    <Section title="发现" items={explore} />
                </div>
            </aside>

            <Ad size="sm" />
        </div>
    );
};

export default LeftMenu
