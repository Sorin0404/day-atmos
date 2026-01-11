"use client";

import { Cloud, CloudRain, Sun, CloudSun, Snowflake } from "lucide-react";
import { Card } from "@/shared/ui/card";

const favorites = [
  { city: "서울", nickname: "SEL", temp: 0, icon: CloudSun },
  { city: "부산", nickname: "PUS", temp: 5, icon: CloudSun },
  { city: "인천", nickname: "ICN", temp: -2, icon: CloudSun },
];

export function FavoriteBoard() {
  return (
    <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-lg font-semibold text-white">즐겨찾기</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {favorites.map((location) => {
          const Icon = location.icon;
          return (
            <div
              key={location.city}
              className="group cursor-pointer rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/15"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">
                  {location.nickname}
                </span>
                <Icon className="h-5 w-5 text-white/70" />
              </div>
              <p className="text-2xl font-bold text-white">{location.temp}°</p>
              <p className="text-xs text-white/50">{location.city}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
