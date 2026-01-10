import { weatherSchema } from "../model/schemas";
import type { Weather } from "../model/types";

interface WeatherApiResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain?: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export async function fetchWeatherFromExternalApi(
  lat: number,
  lon: number
): Promise<Weather> {
  const apiKey = process.env.OPEN_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OPEN_WEATHER_API_KEY is not configured");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Weather API error: ${response.status} - ${errorText}`);
  }

  const data: WeatherApiResponse = await response.json();

  //   const weatherData = {
  //     temp: Math.round(data.main.temp),
  //     condition: data.weather[0]?.main || "Unknown",
  //     humidity: data.main.humidity,
  //     city: data.name,
  //   };

  //   // Zod 스키마 검증
  //   const validatedData = weatherSchema.parse(weatherData);

  //   return validatedData;

  return data as unknown as Weather;
}
