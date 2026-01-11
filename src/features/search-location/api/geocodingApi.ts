export interface GeocodeResult {
  address: string;
  lat: number;
  lon: number;
}

/**
 * 주소를 좌표로 변환
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodeResult> {
  try {
    const response = await fetch(
      `/api/geocode?address=${encodeURIComponent(address)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Geocoding error: ${response.status}`
      );
    }

    const data: GeocodeResult = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to geocode address: ${error.message}`);
    }
    throw new Error("Failed to geocode address: Unknown error");
  }
}
