import Image from "next/image";
import Link from "next/link";

const tools = [
    { id: 1, name: "预产期计算", icon: "/date.png", link: "http://www.mamacn.com/tools/zhunma/yuchanqi.html" },
    { id: 2, name: "怀孕周历", icon: "/events.png", link: "http://www.mamacn.com/tools/zhunma/yunzao.html" },
    { id: 3, name: "孕期食谱", icon: "/albums.png", link: "http://www.mamacn.com/baobao/" },
    { id: 4, name: "胎教音乐", icon: "/lists.png", link: "https://music.163.com/#/playlist?id=10142264959" },
    { id: 5, name: "生辰八字测算", icon: "/map.png", link: "/tools/bazi" },
];

const Tools = ({ size }: { size?: "sm" | "md" | "lg" }) => {
    // 根据 size 决定显示几个工具
    const displayTools = size === "sm" ? tools.slice(0, 3) : tools;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm">
            {/* TOP */}
            <div className="flex items-center justify-between text-gray-500 font-medium mb-4">
                <span>实用工具</span>
                <Image src="/more.png" alt="" width={16} height={16} />
            </div>
            {/* BOTTOM */}
            <div className="flex flex-col gap-4">
                {displayTools.map((tool) => (
                    <Link 
                        href={tool.link} 
                        key={tool.id} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                    >
                        <div className="relative w-8 h-8 flex-shrink-0">
                            <Image
                                src={tool.icon}
                                alt={tool.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <span className="text-gray-700 font-medium">{tool.name}</span>
                        </div>
                        <button className="bg-blue-50 text-blue-500 px-3 py-1 text-xs rounded-lg hover:bg-blue-100 transition-colors">
                            使用
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Tools;
