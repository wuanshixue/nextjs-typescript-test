import BaziCalculator from "@/components/BaziCalculator";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";

export default function BaziPage() {
    return (
        <div className="flex gap-6 pt-6">
            <div className="hidden xl:block w-[20%]">
                <LeftMenu type="home" />
            </div>
            <div className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm font-medium text-gray-500">
                        首页 {'>'} 工具 {'>'} 生辰八字计算
                    </div>
                    <BaziCalculator />
                </div>
            </div>
            <div className="hidden lg:block w-[30%]">
                <RightMenu />
            </div>
        </div>
    );
}
