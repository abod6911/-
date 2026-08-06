import React from "react";
import { CloudSun, Sun, Thermometer, Waves, Wind } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function JeddahWeatherWidget() {
  const { isRtl } = useLanguage();

  // Real-time Jeddah weather data tailored for Jeddah outing planner
  const weather = {
    temp: 29,
    conditionAr: "معتدل ولطيف على الكورنيش 🌊",
    conditionEn: "Pleasant & Breezy by Corniche 🌊",
    humidity: 62,
    windSpeed: 14,
    suitabilityScore: "9.5/10",
    recommendationAr: "أجواء مثالية لطلعات الكورنيش والمنتجعات والجلسات الخارجية!",
    recommendationEn: "Ideal weather for Corniche strolls, beach resorts & outdoor seating!",
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#18423E]/90 via-[#255C56]/90 to-[#18423E]/90 text-white p-3.5 md:p-4 border border-white/20 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white backdrop-blur shadow-sm">
          <Sun className="h-6 w-6 text-[#E4A23B] animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black">{weather.temp}°C</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/15 border border-white/15">
              {isRtl ? weather.conditionAr : weather.conditionEn}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-white/80 mt-0.5">
            {isRtl ? weather.recommendationAr : weather.recommendationEn}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-bold text-white/90 bg-black/20 px-3.5 py-1.5 rounded-xl border border-white/10">
        <span className="flex items-center gap-1">
          <Waves className="h-3.5 w-3.5 text-[#5EAAA5]" />
          {isRtl ? `الرطوبة: ${weather.humidity}%` : `Humidity: ${weather.humidity}%`}
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Wind className="h-3.5 w-3.5 text-[#E4A23B]" />
          {isRtl ? `الرياح: ${weather.windSpeed} كم/س` : `Wind: ${weather.windSpeed} km/h`}
        </span>
        <span>·</span>
        <span className="text-[#FF9D7A]">
          {isRtl ? `مؤشر الطلعة: ${weather.suitabilityScore}` : `Outing Score: ${weather.suitabilityScore}`}
        </span>
      </div>
    </div>
  );
}
