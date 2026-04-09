"use client";

import { useState } from "react";
import { Solar, Lunar } from "lunar-javascript";

const BaziCalculator = () => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [result, setResult] = useState<{
        year: string;
        month: string;
        day: string;
        hour: string;
        wuxing: string;
        nayin: string;
        info: string;
    } | null>(null);

    const calculateBazi = () => {
        if (!date) {
            alert("请选择出生日期");
            return;
        }

        try {
            const [year, month, day] = date.split("-").map(Number);
            
            // 如果没有填写时间，默认中午12点
            let h = 12;
            let m = 0;
            if (time) {
                [h, m] = time.split(":").map(Number);
            }

            const solar = Solar.fromYmdHms(year, month, day, h, m, 0);
            const lunar = solar.getLunar();
            const bazi = lunar.getEightChar();

            setResult({
                year: `${bazi.getYear()} (${bazi.getYearWuXing()})`,
                month: `${bazi.getMonth()} (${bazi.getMonthWuXing()})`,
                day: `${bazi.getDay()} (${bazi.getDayWuXing()})`,
                hour: `${bazi.getTime()} (${bazi.getTimeWuXing()})`,
                wuxing: `${bazi.getYearWuXing()} ${bazi.getMonthWuXing()} ${bazi.getDayWuXing()} ${bazi.getTimeWuXing()}`,
                nayin: `${bazi.getYearNaYin()} ${bazi.getMonthNaYin()} ${bazi.getDayNaYin()} ${bazi.getTimeNaYin()}`,
                info: `农历: ${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()} ${lunar.getTimeZhi()}时`,
            });
        } catch (error) {
            alert("计算失败，请检查输入格式");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">宝宝生辰八字计算器</h2>
            
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">出生日期 (公历/阳历)</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">出生时间 (选填，精确到时辰)</label>
                    <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button 
                    onClick={calculateBazi}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
                >
                    开始计算排盘
                </button>
            </div>

            {result && (
                <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-lg font-bold text-amber-900 mb-4 text-center border-b border-amber-200 pb-2">排盘结果</h3>
                    
                    <div className="text-center text-sm text-gray-600 mb-4">
                        {result.info}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center mb-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-gray-500">年柱</span>
                            <span className="text-xl font-bold text-gray-800">{result.year.split(' ')[0]}</span>
                            <span className="text-sm text-amber-700">{result.year.split(' ')[1].replace(/[()]/g, '')}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-gray-500">月柱</span>
                            <span className="text-xl font-bold text-gray-800">{result.month.split(' ')[0]}</span>
                            <span className="text-sm text-amber-700">{result.month.split(' ')[1].replace(/[()]/g, '')}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-gray-500">日柱(日主)</span>
                            <span className="text-xl font-bold text-gray-800">{result.day.split(' ')[0]}</span>
                            <span className="text-sm text-amber-700">{result.day.split(' ')[1].replace(/[()]/g, '')}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-gray-500">时柱</span>
                            <span className="text-xl font-bold text-gray-800">{result.hour.split(' ')[0]}</span>
                            <span className="text-sm text-amber-700">{result.hour.split(' ')[1].replace(/[()]/g, '')}</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-medium text-gray-900">八字五行：</span>{result.wuxing}</p>
                        <p><span className="font-medium text-gray-900">八字纳音：</span>{result.nayin}</p>
                    </div>
                    
                    <p className="mt-4 text-xs text-gray-400 text-center">
                        注：本工具采用真太阳时排盘，结果仅供起名、娱乐参考。
                    </p>
                </div>
            )}
        </div>
    );
};

export default BaziCalculator;
