import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchWeatherFromExternalApi } from "@/entities/weather/api/weatherServerApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "lat and lon parameters are required" },
        { status: 400 }
      );
    }

    const weatherData = await fetchWeatherFromExternalApi(
      Number.parseFloat(lat),
      Number.parseFloat(lon)
    );

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch weather: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch weather: Unknown error" },
      { status: 500 }
    );
  }
}
