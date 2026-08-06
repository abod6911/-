import React, { useEffect, useState } from "react";
import { CloudSun, Sun, Thermometer, Waves, Wind } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LiveWeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  conditionAr: string;
  conditionEn: string;
  suitabilityScore: string;
  recommendationAr: string;
  recommendationEn: string;
  isRealLive: boolean;
}

export function JeddahWeatherWidget() {
  const { isRtl } = useLanguage();
  const [weather, setWeather] = useState<LiveWeatherData>({
    temp: 29,
    humidity: 62,
    windSpeed: 14,
    conditionAr: "معتدل ولطيف على الكورنيش 🌊",
    conditionEn: "Pleasant & Breezy by Corniche 🌊",
    suitabilityScore: "9.5/10",
    recommendationAr: "أجواء رائعة لطلعات الكورنيش والمنتجعات والجلسات الخارجية!",
    recommendationEn: "Ideal weather for Corniche strolls, beach resorts & outdoor seating!",
    isRealLive: false,
  });

  useEffect(() => {
    let isMounted = true;
    // Fetch live meteorological weather data for Jeddah (Lat: 21.5433, Lon: 39.1728) from Open-Meteo API
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=21.5433&longitude=39.1728&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted || !data?.current) return;
        const current = data.current;
        const temp = Math.round(current.temperature_2m ?? 29);
        const humidity = Math.round(current.relative_humidity_2m ?? 62);
        const windSpeed = Math.round(current.wind_speed_10m ?? 14);
        const code = current.weather_code ?? 0;

        let condAr = "صافي ولطيف على البحر 🌊";
        let condEn = "Clear & Pleasant by Sea 🌊";

        if (code === 0 || code === 1) {
          condAr = temp > 35 ? "مشمس وحار نسبياً ☀️" : "مشمس ومعتدل الكورنيش 🌊";
          condEn = temp > 35 ? "Sunny & Warm ☀️" : "Sunny & Breezy 🌊";
        } else if (code === 2 || code === 3) {
          condAr = "غائم جزئياً وأجواء عليلة ☁️";
          condEn = "Partly Cloudy & Pleasant ☁️";
        } else if (code >= 51 && code <= 65) {
          condAr = "زخات مطر خفيفة ورائعة 🌧️";
          condEn = "Light Rain Showers 🌧️";
        }

        // Calculate dynamic Outing Suitability Score (1-10)
        let scoreVal = 9.5;
        if (temp > 38) scoreVal -= 2.0;
        else if (temp > 33) scoreVal -= 1.0;
        if (humidity > 75) scoreVal -= 0.8;
        const suitabilityScore = `${Math.max(6.5, scoreVal).toFixed(1)}/10`;

        let recAr = "أجواء رائعة لطلعات الكورنيش والمنتجعات والجلسات الخارجية!";
        let recEn = "Ideal weather for Corniche strolls, beach resorts & outdoor seating!";
        if (temp > 35 || humidity > 75) {
          recAr = "ينصح بالأماكن المكيفة والمطاعم والكافيهات مع جلسات مسائية!";
          recEn = "Recommended indoor dining, malls & evening outdoor seating!";
        }

        setWeather({
          temp,
          humidity,
          windSpeed,
          conditionAr: condAr,
          conditionEn: condEn,
          suitabilityScore,
          recommendationAr: recAr,
          recommendationEn: recEn,
          isRealLive: true,
        });
      })
      .catch((err) => {
        console.warn("Weather API fallback active:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
            <span className="rounded-full bg-[#C96745] px-2 py-0.5 text-[10px] font-extrabold text-white animate-pulse">
              🔴 {isRtl ? "طقس جدة مباشر" : "Live Jeddah Weather"}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-white/80 mt-0.5">
            {isRtl ? weather.recommendationAr : weather.recommendationEn}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/90 bg-black/20 px-3.5 py-1.5 rounded-xl border border-white/10">
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
