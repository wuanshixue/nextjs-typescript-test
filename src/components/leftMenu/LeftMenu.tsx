import ProfileCard from "@/components/leftMenu/ProfileCard";
import Link from "next/link";
import Image from "next/image";
import Tools from "@/components/Tools";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

type MenuItem = { href: string; label: string; icon: string };

// explore 可保持静态；personal 中的 “My Posts” 需要根据当前用户动态生成链接

const explore: MenuItem[] = [
    { href: "http://www.babylead.com/", label: "中国育婴网", icon: "/videos.png" },
    { href: "http://www.wadl.cn/", label: "孕妇网", icon: "/lists.png" },
    { href: "http://www.mamacn.com/", label: "妈妈网", icon: "/news.png" },
    { href: "http://www.ihuaiyun.com/", label: "中国孕婴网", icon: "/courses.png" },
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
    // 计算当前用户的个人主页链接
    const { userId } = auth();
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
        { href: "https://github.com/wuanshixue/", label: "Activity", icon: "/activity.png" },
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

            <Tools size="sm" />
        </div>
    );
};

export default LeftMenu
