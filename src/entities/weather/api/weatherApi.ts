import type { Weather } from "../model/types";

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  try {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Weather API error: ${response.status}`
      );
    }

    const data: Weather = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch weather: ${error.message}`);
    }
    throw new Error("Failed to fetch weather: Unknown error");
  }
}
