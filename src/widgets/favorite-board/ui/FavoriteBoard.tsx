"use client";

import { Trash2, Edit2, MapPin } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { InputDialog } from "@/shared/ui/input-dialog";
import { getWeatherIcon } from "@/shared/lib/getWeatherIcon";
import { useFavoriteStore } from "@/shared/store/favoriteStore";
import { useWeatherQuery } from "@/entities/weather";

function FavoriteCard({
  id,
  name,
  lat,
  lon,
}: {
  id: string;
  name: string;
  lat: number;
  lon: number;
}) {
  const router = useRouter();
  const { removeFavorite, updateFavoriteName } = useFavoriteStore();
  const { data: weather } = useWeatherQuery(lat, lon);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleClick = () => {
    router.push(`/detail/${lat}/${lon}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = () => {
    removeFavorite(id);
    setIsConfirmingDelete(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateFavoriteName(id, editedName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <>
      <div className="relative min-w-[180px] shrink-0 rounded-2xl bg-white/5 transition-all hover:bg-white/15">
        {/* 수정/삭제 버튼 - 절대 위치 */}
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEditClick}
            className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20"
            title="이름 수정"
          >
            <Edit2 className="h-3.5 w-3.5 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="h-7 w-7 rounded-full bg-white/10 hover:bg-red-500/50"
            title="삭제"
          >
            <Trash2 className="h-3.5 w-3.5 text-white" />
          </Button>
        </div>

        {/* 클릭 가능한 카드 영역 */}
        <button
          type="button"
          onClick={handleClick}
          className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-white/50 rounded-2xl"
        >
          {/* 헤더: 아이콘 */}
          <div className="mb-3">
            {getWeatherIcon(weather?.weather[0]?.icon, "h-8 w-8 text-white/70")}
          </div>

          {/* 장소명 */}
          <h4 className="mb-2 text-sm font-medium text-white/80 truncate">
            {name}
          </h4>

          {/* 온도 정보 */}
          <p className="mb-2 text-3xl font-bold text-white">
            {weather?.main?.temp?.toFixed(0) ?? "-"}°
          </p>

          {/* 최고/최저 */}
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>최고 {weather?.main?.temp_max?.toFixed(0) ?? "-"}°</span>
            <span>최저 {weather?.main?.temp_min?.toFixed(0) ?? "-"}°</span>
          </div>
        </button>
      </div>

      {/* 이름 수정 Dialog */}
      <InputDialog
        open={isEditingName}
        onOpenChange={setIsEditingName}
        title="즐겨찾기 이름 수정"
        description="즐겨찾기의 별칭을 수정할 수 있습니다."
        value={editedName}
        onValueChange={setEditedName}
        placeholder="별칭 입력"
        onConfirm={handleSaveName}
        onCancel={() => setEditedName(name)}
      />

      {/* 삭제 확인 Dialog */}
      <ConfirmDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title="즐겨찾기 삭제"
        description={
          <>
            &quot;{name}&quot;을(를) 즐겨찾기에서 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </>
        }
        confirmLabel="삭제"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function FavoriteBoard() {
  const { favorites } = useFavoriteStore();

  return (
    <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-lg font-semibold text-white">
        즐겨찾기 ({favorites.length}/6)
      </h3>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="mb-3 h-12 w-12 text-white/30" />
          <p className="text-sm text-white/50">
            즐겨찾기에 추가된 장소가 없습니다.
          </p>
          <p className="mt-1 text-xs text-white/40">
            날씨 카드의 별 아이콘을 눌러 추가하세요.
          </p>
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {favorites.map((favorite) => (
              <FavoriteCard
                key={favorite.id}
                id={favorite.id}
                name={favorite.name}
                lat={favorite.lat}
                lon={favorite.lon}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-white/10" />
        </ScrollArea>
      )}
    </Card>
  );
}
