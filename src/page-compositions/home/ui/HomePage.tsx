"use client";

import { FavoriteBoard } from "@/widgets/favorite-board";
import { Header } from "@/widgets/header";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { SearchBar } from "@/widgets/search-bar";
import { WeatherCard } from "@/widgets/weather-card";
import { Suspense } from "react";

export function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-500 via-blue-600 to-blue-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
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
