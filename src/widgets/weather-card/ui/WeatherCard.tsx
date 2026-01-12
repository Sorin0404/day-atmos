"use client";

import { Star, Sun } from "lucide-react";
import { useState } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { cn } from "@/shared/lib/utils";
import { getWeatherIcon } from "@/shared/lib/getWeatherIcon";
import { useWeatherQuery } from "@/entities/weather";
import { useLocationStore } from "@/shared/store";
import { useFavoriteStore } from "@/shared/store/favoriteStore";

interface WeatherCardProps {
  displayName?: string;
}

export function WeatherCard({ displayName }: WeatherCardProps = {}) {
  const { latitude, longitude } = useLocationStore();
  const { addFavorite, isFavorite, favorites } = useFavoriteStore();
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const lat = latitude ?? 37.5665;
  const lon = longitude ?? 126.978;

  const { data: weather, isLoading } = useWeatherQuery(lat, lon);

  const handleAddFavorite = () => {
    if (!weather) return;

    // 이미 즐겨찾기에 있는지 확인
    if (isFavorite(lat, lon)) {
      return;
    }

    // 6개 제한 체크
    if (favorites.length >= 6) {
      setShowLimitDialog(true);
      return;
    }

    // 즐겨찾기 추가
    const success = addFavorite({
      name: weather.name,
      address: weather.name,
      lat,
      lon,
    });

    if (!success) {
      setShowLimitDialog(true);
    }
  };

  const isAlreadyFavorite = isFavorite(lat, lon);

  return (
    <>
      <Card className="relative overflow-hidden rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md sm:p-8">
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
            {/* 즐겨찾기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddFavorite}
              disabled={isAlreadyFavorite}
              className="absolute right-4 top-4 rounded-full hover:bg-white/20"
              title={
                isAlreadyFavorite ? "이미 즐겨찾기에 추가됨" : "즐겨찾기에 추가"
              }
            >
              <Star
                className={cn("h-6 w-6", {
                  "fill-yellow-400 text-yellow-400": isAlreadyFavorite,
                  "text-white": !isAlreadyFavorite,
                })}
              />
            </Button>

            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-yellow-300 to-orange-400 shadow-lg shadow-orange-500/30 sm:mb-0 sm:mr-6">
                {getWeatherIcon(weather?.weather[0]?.icon, "h-14 w-14 text-white")}
              </div>
              <div className="flex-1">
                <div className="mb-1">
                  {displayName ? (
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-bold text-white">
                        {displayName}
                      </h2>
                      <p className="text-sm font-medium text-white/60">
                        {weather?.name}
                      </p>
                    </div>
                  ) : (
                    <h2 className="text-lg font-medium text-white/80">
                      {weather?.name || "서울시 중구"}
                    </h2>
                  )}
                </div>
                <p className="text-6xl font-bold text-white sm:text-7xl">
                  {Math.round(weather?.main?.temp ?? 0)}°
                </p>
                <p className="mt-1 text-lg text-white/70">
                  {weather?.weather[0]?.description || "맑음"}
                </p>
                <div className="mt-3 flex items-center justify-center gap-4 sm:justify-start">
                  <span className="text-sm text-white/60">
                    최고온도:{" "}
                    <span className="font-medium text-white">
                      {Math.round(weather?.main?.temp_max ?? 0)}°
                    </span>
                  </span>
                  <span className="text-sm text-white/60">
                    최저온도:{" "}
                    <span className="font-medium text-white">
                      {Math.round(weather?.main?.temp_min ?? 0)}°
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="text-center">
                <p className="text-sm text-white/60">습도</p>
                <p className="text-lg font-semibold text-white">
                  {weather?.main?.humidity ?? "-"}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/60">풍속</p>
                <p className="text-lg font-semibold text-white">
                  {Number.parseFloat(
                    (weather?.wind?.speed ?? 0).toString()
                  ).toFixed(1) ?? "-"}{" "}
                  m/s
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/60">체감온도</p>
                <p className="text-lg font-semibold text-white">
                  {Math.round(weather?.main?.feels_like ?? 0)}°
                </p>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* 6개 제한 Dialog */}
      <ConfirmDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
        title="즐겨찾기 제한"
        description={
          <>
            즐겨찾기는 최대 6개까지만 추가할 수 있습니다.
            <br />
            다른 장소를 추가하려면 기존 즐겨찾기를 삭제해주세요.
          </>
        }
        confirmLabel="확인"
        onConfirm={() => {}}
      />
    </>
  );
}
