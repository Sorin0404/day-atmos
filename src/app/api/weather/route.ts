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

    const kakaoApiKey = process.env.KAKAO_API_KEY;
    if (!kakaoApiKey) {
      return NextResponse.json(
        { error: "KAKAO_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // 날씨 정보와 한국 주소를 병렬로 가져오기
    const [weatherResponse, kakaoResponse] = await Promise.all([
      fetch(
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
      ),
      fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`,
        {
          method: "GET",
          headers: {
            Authorization: `KakaoAK ${kakaoApiKey}`,
          },
          next: {
            revalidate: 60,
          },
        }
      ),
    ]);

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      return NextResponse.json(
        {
          error: `Weather API error: ${weatherResponse.status} - ${errorText}`,
        },
        { status: weatherResponse.status }
      );
    }

    const weatherData = await weatherResponse.json();

    // Kakao API에서 한국 주소 추출
    if (kakaoResponse.ok) {
      const kakaoData = await kakaoResponse.json();

      if (kakaoData.documents && kakaoData.documents.length > 0) {
        const address = kakaoData.documents[0].address;
        if (address) {
          weatherData.koreanAddress = {
            full: `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`,
            region1: address.region_1depth_name,
            region2: address.region_2depth_name,
            region3: address.region_3depth_name,
          };
          // name을 한국 주소로 업데이트
          weatherData.name = weatherData.koreanAddress.full;
        }
      }
    } else {
      const kakaoError = await kakaoResponse.json();
      console.error("❌ Kakao API Error:", kakaoError);
    }

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
