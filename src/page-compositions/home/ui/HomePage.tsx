"use client";

import { FavoriteBoard } from "@/widgets/favorite-board";
import { Header } from "@/widgets/header";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { SearchBar } from "@/widgets/search-bar";
import { WeatherCard } from "@/widgets/weather-card";
import { Suspense, useEffect } from "react";
import { useGeolocation } from "@/shared/lib";
import { useLocationStore } from "@/shared/store";

export function HomePage() {
  const { latitude, longitude, error, loading } = useGeolocation();
  const { setLocation } = useLocationStore();

  // 위치를 가져오면 store에 저장
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setLocation(latitude, longitude);
    }
  }, [latitude, longitude, setLocation]);

  // 에러 발생 시 기본 위치 (서울)로 설정
  useEffect(() => {
    if (error && !loading) {
      console.warn("위치 감지 실패:", error);
      // 기본 위치: 서울시청
      setLocation(37.5665, 126.978);
    }
  }, [error, loading, setLocation]);

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-500 via-blue-600 to-blue-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 위치 로딩 중 */}
        {loading && (
          <div className="mb-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
            <p className="text-center text-sm text-white/70">
              현재 위치를 감지하고 있습니다...
            </p>
          </div>
        )}

        {/* 위치 권한 거부 메시지 */}
        {error && !loading && (
          <div className="mb-4 rounded-2xl bg-yellow-500/20 p-4 backdrop-blur-md border border-yellow-500/30">
            <p className="text-center text-sm text-white">
              {error}
            </p>
            <p className="mt-1 text-center text-xs text-white/70">
              기본 위치(서울)의 날씨를 표시합니다.
            </p>
          </div>
        )}

        <Suspense fallback={null}>
          <Header />
          <div className="mt-6">
            <SearchBar />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <WeatherCard />
            <FavoriteBoard />
          </div>
          <div className="mt-6">
            <HourlyForecast />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
