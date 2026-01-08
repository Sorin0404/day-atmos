import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from './weatherApi'

export const weatherKeys = {
  all: ['weather'] as const,
  detail: (city: string) => [...weatherKeys.all, city] as const,
}

export function useWeatherQuery(city: string) {
  return useQuery({
    queryKey: weatherKeys.detail(city),
    queryFn: () => fetchWeather(city),
  })
}
