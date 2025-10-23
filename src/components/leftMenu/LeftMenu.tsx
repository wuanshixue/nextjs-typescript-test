import ProfileCard from "@/components/leftMenu/ProfileCard";
import Link from "next/link";
import Image from "next/image";
import Ad from "@/components/Ad";

type MenuItem = { href: string; label: string; icon: string };

const personal: MenuItem[] = [
    { href: "/public", label: "My Posts", icon: "/posts.png" },
    { href: "/public", label: "Activity", icon: "/activity.png" },
];

const explore: MenuItem[] = [
    { href: "/public", label: "Marketplace", icon: "/market.png" },
    { href: "/public", label: "Events", icon: "/events.png" },
    { href: "/public", label: "Albums", icon: "/albums.png" },
    { href: "/public", label: "Videos", icon: "/videos.png" },
    { href: "/public", label: "News", icon: "/news.png" },
    { href: "/public", label: "Courses", icon: "/courses.png" },
    { href: "/public", label: "Lists", icon: "/lists.png" },
];

const Section = ({ title, items }: { title: string; items: MenuItem[] }) => (
    <div className="flex flex-col gap-1">
        <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {title}
        </div>
        <nav aria-label={title} className="flex flex-col">
            {items.map((it) => (
                <Link
                    key={it.label}
                    href={it.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                >
                    <Image src={it.icon} alt="" width={18} height={18} className="opacity-80" />
                    <span className="text-sm">{it.label}</span>
                </Link>
            ))}
        </nav>
    </div>
);

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
    return (
        <div className="flex flex-col gap-6">
            {type === "home" && <ProfileCard />}

            <aside className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 p-3 shadow-sm">
                <div className="flex flex-col gap-4">
                    <Section title="个人" items={personal} />
                    <div className="h-px bg-slate-100 mx-2" />
                    <Section title="发现" items={explore} />
                </div>
            </aside>

            <Ad size="sm" />
        </div>
    );
};

export default LeftMenu
