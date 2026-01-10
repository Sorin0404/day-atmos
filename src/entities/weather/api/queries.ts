import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "./weatherApi";

export const weatherKeys = {
  all: ["weather"] as const,
  detail: (lat: number, lon: number) => [...weatherKeys.all, lat, lon] as const,
};

export function useWeatherQuery(lat: number, lon: number) {
  return useQuery({
    queryKey: weatherKeys.detail(lat, lon),
    queryFn: () => fetchWeather(lat, lon),
  });
}
