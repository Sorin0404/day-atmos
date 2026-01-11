/**
 * korea_districts.json에서 검색어에 매칭되는 장소를 찾는 함수
 * @param districts - 한국 행정구역 배열
 * @param query - 검색어
 * @param limit - 최대 결과 개수
 * @returns 매칭되는 장소 배열
 */
export function searchDistricts(
  districts: string[],
  query: string,
  limit = 10
): string[] {
  if (!query.trim()) return [];

  // 검색어 정규화: 공백과 하이픈을 통일
  const normalizedQuery = query.trim().toLowerCase().replace(/\s+/g, "");

  // 검색어와 매칭되는 항목 필터링
  const matches = districts.filter((district) => {
    const normalizedDistrict = district.toLowerCase().replace(/-/g, "");

    // 공백과 하이픈 제거 후 비교
    if (normalizedDistrict.includes(normalizedQuery)) {
      return true;
    }

    // "-"로 분리된 각 부분에서도 검색
    const parts = district.split("-");
    return parts.some((part) =>
      part.toLowerCase().includes(query.trim().toLowerCase())
    );
  });

  // 정확도 순으로 정렬
  const sorted = matches.sort((a, b) => {
    const aLower = a.toLowerCase().replace(/-/g, "");
    const bLower = b.toLowerCase().replace(/-/g, "");

    // 정확히 일치하는 경우 우선순위 높음
    if (aLower === normalizedQuery) return -1;
    if (bLower === normalizedQuery) return 1;

    // 시작하는 경우 우선순위 높음
    if (aLower.startsWith(normalizedQuery)) return -1;
    if (bLower.startsWith(normalizedQuery)) return 1;

    // 분리된 부분이 시작하는 경우
    const aParts = a.split("-");
    const bParts = b.split("-");
    const queryTrimmed = query.trim().toLowerCase();
    const aStartsInPart = aParts.some((part) =>
      part.toLowerCase().startsWith(queryTrimmed)
    );
    const bStartsInPart = bParts.some((part) =>
      part.toLowerCase().startsWith(queryTrimmed)
    );

    if (aStartsInPart && !bStartsInPart) return -1;
    if (!aStartsInPart && bStartsInPart) return 1;

    // 길이가 짧은 것 우선 (더 구체적인 결과)
    return a.length - b.length;
  });

  return sorted.slice(0, limit);
}

/**
 * 주소를 표시용 포맷으로 변환
 * "서울특별시-종로구-청운동" -> "서울특별시 종로구 청운동"
 */
export function formatDistrictName(district: string): string {
  return district.replace(/-/g, " ");
}

/**
 * 주소를 간단한 형태로 변환 (마지막 2개 요소만)
 * "서울특별시-종로구-청운동" -> "종로구 청운동"
 */
export function formatDistrictShort(district: string): string {
  const parts = district.split("-");
  if (parts.length > 2) {
    return parts.slice(-2).join(" ");
  }
  return formatDistrictName(district);
}
