"use client";

import { Sun, CloudRain, CloudSun, Snowflake } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { useWeatherQuery } from "@/entities/weather";

function renderWeatherIcon(condition: string | undefined) {
  if (!condition) return <Sun className="h-14 w-14 text-white" />;

  const normalizedCondition = condition.toLowerCase();
  if (normalizedCondition.includes("rain")) {
    return <CloudRain className="h-14 w-14 text-white" />;
  }
  if (normalizedCondition.includes("snow")) {
    return <Snowflake className="h-14 w-14 text-white" />;
  }
  if (normalizedCondition.includes("cloud")) {
    return <CloudSun className="h-14 w-14 text-white" />;
  }
  return <Sun className="h-14 w-14 text-white" />;
}

export function WeatherCard() {
  const { data: weather, isLoading } = useWeatherQuery(37.5665, 126.978);

  console.log("weather : ", weather);
  console.log("isLoading : ", isLoading);

  // SSR과 CSR 간 일관성을 위해 항상 같은 구조 유지
  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md sm:p-8">
      {isLoading ? (
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-yellow-300 to-orange-400 shadow-lg shadow-orange-500/30 sm:mb-0 sm:mr-6">
            <Sun className="h-14 w-14 text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-2" />
            <div className="h-16 w-24 bg-white/20 rounded animate-pulse mb-2" />
            <div className="h-5 w-20 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-yellow-300 to-orange-400 shadow-lg shadow-orange-500/30 sm:mb-0 sm:mr-6">
              {renderWeatherIcon(weather?.condition)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-white/80">
                {weather?.city || "서울시 관악구"}
              </h2>
              <p className="text-6xl font-bold text-white sm:text-7xl">
                {weather?.temp ?? 0}°
              </p>
              <p className="mt-1 text-lg text-white/70">
                {weather?.condition || "Sunny"}
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 sm:justify-start">
                <span className="text-sm text-white/60">
                  H: <span className="font-medium text-white">1°</span>
                </span>
                <span className="text-sm text-white/60">
                  L: <span className="font-medium text-white">-9°</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div className="text-center">
              <p className="text-sm text-white/60">습도</p>
              <p className="text-lg font-semibold text-white">
                {weather?.humidity ?? 0}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">풍속</p>
              <p className="text-lg font-semibold text-white">1 m/s</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">자외선</p>
              <p className="text-lg font-semibold text-white">1</p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
