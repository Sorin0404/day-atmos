"use client";

import { Card } from "@/shared/ui/card";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { getWeatherIcon } from "@/shared/lib/getWeatherIcon";
import { useForecastQuery } from "@/entities/weather/api/queries";
import { useLocationStore } from "@/shared/store";
import { format, isToday, isTomorrow } from "date-fns";

export function HourlyForecast() {
  const { latitude, longitude } = useLocationStore();

  const {
    data: forecast,
    isLoading,
    error,
  } = useForecastQuery(latitude ?? 37.5665, longitude ?? 126.978);

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

  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return (
      <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-lg font-semibold text-white">
          향후 24시간 예보 (3시간 간격)
        </h3>
        <p className="text-sm text-white/70">예보 데이터가 없습니다.</p>
      </Card>
    );
  }

  // 최대 8개 항목 (24시간)만 표시
  const hourlyData = forecast.list.slice(0, 8).map((item, index) => {
    const date = new Date(item.dt * 1000);

    let timeLabel: string;
    if (index === 0) {
      timeLabel = "지금";
    } else if (isToday(date)) {
      timeLabel = format(date, "H시"); // 15시, 18시 등
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
  });

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
