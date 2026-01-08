"use client";

import { Sun, Cloud, CloudSun, Moon, CloudMoon } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";

const hourlyData = [
  { time: "Now", temp: 0, icon: Sun },
  { time: "1 PM", temp: 1, icon: Sun },
  { time: "2 PM", temp: 2, icon: Sun },
  { time: "3 PM", temp: 2, icon: CloudSun },
  { time: "4 PM", temp: 3, icon: CloudSun },
  { time: "5 PM", temp: 3, icon: Cloud },
  { time: "6 PM", temp: 2, icon: CloudSun },
  { time: "7 PM", temp: 1, icon: CloudMoon },
  { time: "8 PM", temp: 0, icon: Moon },
  { time: "9 PM", temp: -1, icon: Moon },
  { time: "10 PM", temp: -2, icon: Moon },
  { time: "11 PM", temp: -3, icon: Moon },
];

export function HourlyForecast() {
  return (
    <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-lg font-semibold text-white">시간별 예보</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {hourlyData.map((hour, index) => {
            const Icon = hour.icon;
            return (
              <div
                key={hour.time}
                className={`flex min-w-[70px] flex-col items-center rounded-2xl p-3 transition-all ${
                  index === 0 ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="text-sm text-white/70">{hour.time}</span>
                <Icon className="my-2 h-6 w-6 text-white" />
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
