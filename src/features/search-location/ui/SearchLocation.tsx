"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import {
  formatDistrictName,
  searchDistricts,
} from "@/shared/lib/searchDistricts";
import { geocodeAddress } from "../api/geocodingApi";
import { useLocationStore } from "@/shared/store";

export function SearchLocation() {
  const [districts, setDistricts] = useState<string[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { setLocation } = useLocationStore();

  // 클라이언트 마운트 체크
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // korea_districts.json 로드
  useEffect(() => {
    fetch("/korea_districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Failed to load districts:", err));
  }, []);

  // 검색어가 변경될 때 필터링 (성능 최적화: 최대 20개만)
  useEffect(() => {
    if (searchQuery.trim().length > 0 && districts.length > 0) {
      const results = searchDistricts(districts, searchQuery, 20);
      setFilteredDistricts(results);
    } else {
      setFilteredDistricts([]);
    }
  }, [searchQuery, districts]);

  // 장소 선택 핸들러
  const handleSelectLocation = async (district: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 주소를 좌표로 변환
      const result = await geocodeAddress(formatDistrictName(district));

      // 좌표를 전역 상태에 저장
      setLocation(result.lat, result.lon);

      // 검색어 초기화
      setSearchQuery("");
      setFilteredDistricts([]);
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("해당 장소의 정보가 제공되지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 서버 사이드 렌더링 시 플레이스홀더 표시
  if (!isMounted) {
    return (
      <div className="relative w-full">
        <div className="rounded-2xl border-0 bg-white/10 backdrop-blur-md p-3">
          <div className="h-10 flex items-center text-white/50 text-sm px-3">
            지역을 검색하세요 (예: 서울특별시, 종로구, 청운동)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Command
        className="rounded-2xl border-0 bg-white/10 backdrop-blur-md"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="지역을 검색하세요 (예: 서울특별시, 종로구, 청운동)"
          className="text-white placeholder:text-white/50"
          disabled={isLoading}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        {searchQuery.trim().length > 0 && (
          <CommandList className="max-h-[300px]">
            {filteredDistricts.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-sm text-white/70">
                검색 결과가 없습니다.
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredDistricts.map((district) => (
                  <CommandItem
                    key={district}
                    value={district}
                    onSelect={() => handleSelectLocation(district)}
                    className="flex items-center gap-3 rounded-xl text-white hover:bg-white/20 data-selected:bg-white/20 cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="text-sm">
                      {formatDistrictName(district)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-2 rounded-xl bg-red-500/20 p-3 text-sm text-white backdrop-blur-md">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="mt-2 rounded-xl bg-white/10 p-3 text-center text-sm text-white backdrop-blur-md">
          위치 정보를 가져오는 중...
        </div>
      )}
    </div>
  );
}
