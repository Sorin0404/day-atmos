"use client";

import { Card } from "@/shared/ui/card";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { getWeatherIcon } from "@/shared/lib/getWeatherIcon";
import { useForecastQuery, useWeatherQuery } from "@/entities/weather/api/queries";
import { useLocationStore } from "@/shared/store";
import { format, isToday, isTomorrow } from "date-fns";

export function HourlyForecast() {
  const { latitude, longitude } = useLocationStore();

  const lat = latitude ?? 37.5665;
  const lon = longitude ?? 126.978;

  const { data: weather, isLoading: isWeatherLoading } = useWeatherQuery(lat, lon);
  const {
    data: forecast,
    isLoading: isForecastLoading,
    error,
  } = useForecastQuery(lat, lon);

  const isLoading = isWeatherLoading || isForecastLoading;

  // 로딩 상태
  if (isLoading) {
    return (
      <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-lg font-semibold text-white">
          향후 24시간 예보 (3시간 간격)
        </h3>
        <div className="flex gap-3">
          {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
            <Skeleton
              key={key}
              className="h-24 min-w-[70px] rounded-2xl bg-white/20"
            />
          ))}
        </div>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-lg font-semibold text-white">
          향후 24시간 예보 (3시간 간격)
        </h3>
        <p className="text-sm text-white/70">
          예보 데이터를 불러올 수 없습니다.
        </p>
      </Card>
    );
  }

  if (!forecast || !forecast.list || forecast.list.length === 0 || !weather) {
    return (
      <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-lg font-semibold text-white">
          향후 24시간 예보 (3시간 간격)
        </h3>
        <p className="text-sm text-white/70">예보 데이터가 없습니다.</p>
      </Card>
    );
  }

  // 다음 예보 시간과 현재 시간의 차이 계산
  const now = new Date();
  const nextForecastTime = new Date(forecast.list[0].dt * 1000);
  const diffMinutes = (nextForecastTime.getTime() - now.getTime()) / 1000 / 60;

  // 60분 이하면 다음 예보를 "지금"으로 표시
  const showNextAsNow = diffMinutes <= 60 && diffMinutes > 0;

  // 현재 날씨 + 향후 예보
  const hourlyData = [
    // 60분 초과일 때만 현재 날씨 추가
    ...(showNextAsNow ? [] : [{
      time: "지금",
      temp: Math.round(weather.main.temp),
      iconCode: weather.weather[0].icon,
      dt: weather.dt,
    }]),
    // 향후 예보 (첫 번째가 60분 이하면 "지금"으로 표시)
    ...forecast.list.slice(0, showNextAsNow ? 8 : 7).map((item, index) => {
      const date = new Date(item.dt * 1000);

      let timeLabel: string;
      // 첫 번째 예보가 60분 이하면 "지금"으로 표시
      if (index === 0 && showNextAsNow) {
        timeLabel = "지금";
      } else if (isToday(date)) {
        timeLabel = format(date, "H시"); // 21시, 23시 등
      } else if (isTomorrow(date)) {
        timeLabel = `내일 ${format(date, "H시")}`; // 내일 0시, 내일 3시 등
      } else {
        timeLabel = format(date, "M/d H시"); // 1/15 6시 등
      }

      return {
        time: timeLabel,
        temp: Math.round(item.main.temp),
        iconCode: item.weather[0].icon,
        dt: item.dt,
      };
    }),
  ];

  return (
    <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-lg font-semibold text-white">
        향후 24시간 예보 (3시간 간격)
      </h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {hourlyData.map((hour, index) => {
            return (
              <div
                key={hour.dt}
                className={cn(
                  "flex min-w-[70px] flex-col items-center rounded-2xl p-3 transition-all",
                  {
                    "bg-white/20": index === 0,
                    "bg-white/5 hover:bg-white/10": index !== 0,
                  }
                )}
              >
                <span className="text-sm text-white/70 whitespace-nowrap">
                  {hour.time}
                </span>
                <div className="my-2">
                  {getWeatherIcon(hour.iconCode, "h-6 w-6 text-white")}
                </div>
                <span className="text-lg font-semibold text-white">
                  {hour.temp}°
                </span>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="bg-white/10" />
      </ScrollArea>
    </Card>
  );
}
