import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPEN_WEATHER_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // OpenWeatherMap 5 day / 3 hour forecast API
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 60, // 1분 캐시
        },
      }
    );

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      return NextResponse.json(
        {
          error: `Forecast API error: ${forecastResponse.status} - ${errorText}`,
        },
        { status: forecastResponse.status }
      );
    }

    const forecastData = await forecastResponse.json();

    return NextResponse.json(forecastData);
  } catch (error) {
    console.error("Forecast API error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch forecast: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch forecast: Unknown error" },
      { status: 500 }
    );
  }
}
