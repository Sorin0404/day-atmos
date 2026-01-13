"use client";

import { Trash2, Edit2, GripVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { InputDialog } from "@/shared/ui/input-dialog";
import { getWeatherIcon } from "@/shared/lib/getWeatherIcon";
import { useFavoriteStore } from "@/shared/store/favoriteStore";
import { useWeatherQuery } from "@/entities/weather";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/shared/lib";

interface FavoriteCardProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  isEditMode: boolean;
}

export function FavoriteCard({
  id,
  name,
  lat,
  lon,
  isEditMode,
}: FavoriteCardProps) {
  const router = useRouter();
  const { removeFavorite, updateFavoriteName } = useFavoriteStore();
  const { data: weather } = useWeatherQuery(lat, lon);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editedName, setEditedName] = useState(name);

  // dnd-kit sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    // 편집 모드에서는 클릭 비활성화
    if (isEditMode) return;
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
      <div
        ref={setNodeRef}
        style={style}
        className="relative w-[180px] shrink-0 rounded-2xl bg-white/5 transition-all hover:bg-white/15"
      >
        {/* 편집 모드: 드래그 핸들 (모바일: 큰 핸들, 데스크탑: 작은 아이콘) */}
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className={cn(
              // 기본 스타일 (모바일)
              "absolute right-0 top-0 bottom-0 w-12 rounded-r-2xl",
              "flex items-center justify-center touch-none",
              "cursor-grab active:cursor-grabbing",
              "bg-white/10 hover:bg-white/20 transition-colors",
              // 데스크탑 (md 이상)
              "md:w-auto md:h-8 md:bottom-auto md:right-2 md:top-2 md:rounded-full"
            )}
            style={{ touchAction: "none" }}
            title="드래그하여 순서 변경"
          >
            <GripVertical
              className={cn("h-6 w-6 text-white", "md:h-4 md:w-4")}
            />
          </div>
        )}

        {/* 일반 모드: 수정/삭제 버튼 */}
        {!isEditMode && (
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
        )}

        {/* 클릭 가능한 카드 영역 */}
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "w-full p-4 text-left rounded-2xl",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
            isEditMode && "pr-14 md:pr-4"
          )}
          disabled={isEditMode}
        >
          {/* 헤더: 아이콘 */}
          <div className="mb-3">
            {getWeatherIcon(weather?.weather[0]?.icon, "h-8 w-8 text-white/70")}
          </div>

          {/* 장소명 */}
          <h4
            className="mb-2 text-sm font-medium text-white/80 line-clamp-2 min-h-10 break-keep"
            title={name}
          >
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
