'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card'
import { useWeatherQuery } from '@/entities/weather'

interface WeatherCardProps {
  city: string
}

export function WeatherCard({ city }: WeatherCardProps) {
  const { data: weather, isLoading } = useWeatherQuery(city)

  if (isLoading) return <Card><CardContent>Loading...</CardContent></Card>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{weather?.city}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>온도: {weather?.temp}°C</p>
        <p>상태: {weather?.condition}</p>
        <p>습도: {weather?.humidity}%</p>
      </CardContent>
    </Card>
  )
}
