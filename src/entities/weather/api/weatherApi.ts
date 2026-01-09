import { Weather } from "../model/types";

export async function fetchWeather(city: string): Promise<Weather> {
  // TODO: 실제 API 연동
  return {
    temp: 22,
    condition: "Sunny",
    humidity: 60,
    city,
  };
}
