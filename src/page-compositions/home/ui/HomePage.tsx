'use client'

import { Header } from '@/widgets/header'
import { WeatherCard } from '@/widgets/weather-card'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-xl mb-4">현재 날씨</h2>
        <WeatherCard city="Seoul" />
      </main>
    </div>
  )
}
