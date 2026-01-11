import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "address parameter is required" },
        { status: 400 }
      );
    }

    const kakaoApiKey = process.env.KAKAO_API_KEY;
    if (!kakaoApiKey) {
      return NextResponse.json(
        { error: "KAKAO_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Kakao Local API - 주소 검색
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        address
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${kakaoApiKey}`,
        },
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Kakao Geocoding Error:", errorData);
      return NextResponse.json(
        { error: "Failed to geocode address", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.documents || data.documents.length === 0) {
      return NextResponse.json(
        { error: "해당 장소의 정보가 제공되지 않습니다." },
        { status: 404 }
      );
    }

    // 첫 번째 결과의 좌표 반환
    const location = data.documents[0];
    return NextResponse.json({
      address: location.address_name,
      lat: Number.parseFloat(location.y),
      lon: Number.parseFloat(location.x),
    });
  } catch (error) {
    console.error("Geocoding API error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to geocode: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to geocode: Unknown error" },
      { status: 500 }
    );
  }
}
