"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { Card } from "@/shared/ui/card";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { useFavoriteStore } from "@/shared/store/favoriteStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { FavoriteCard } from "./FavoriteCard";
import { EditModeControls } from "./EditModeControls";

export function FavoriteBoard() {
  const { favorites, reorderFavorites } = useFavoriteStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<typeof favorites>([]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 움직여야 드래그 시작 (클릭과 구분)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // 150ms 이상 눌러야 드래그 시작 (스크롤과 구분)
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = favorites.findIndex((fav) => fav.id === active.id);
      const newIndex = favorites.findIndex((fav) => fav.id === over.id);

      const newOrder = arrayMove(favorites, oldIndex, newIndex);
      reorderFavorites(newOrder);
    }
  };

  const startEditMode = () => {
    // 편집 시작 시 현재 순서 저장
    setOriginalOrder([...favorites]);
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    // 원래 순서로 복원
    reorderFavorites(originalOrder);
    setIsEditMode(false);
    setOriginalOrder([]);
  };

  const completeEditMode = () => {
    // 변경사항 확정 (이미 실시간으로 적용됨)
    setIsEditMode(false);
    setOriginalOrder([]);
  };

  return (
    <Card className="rounded-3xl border-0 bg-white/10 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          즐겨찾기 ({favorites.length}/6)
        </h3>
        {favorites.length > 0 && (
          <EditModeControls
            isEditMode={isEditMode}
            onStartEdit={startEditMode}
            onCancel={cancelEditMode}
            onComplete={completeEditMode}
          />
        )}
      </div>
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          <SortableContext
            items={favorites.map((fav) => fav.id)}
            strategy={horizontalListSortingStrategy}
          >
            <ScrollArea
              className="w-full"
              style={
                isEditMode ? { touchAction: "pan-y pinch-zoom" } : undefined
              }
            >
              <div className="flex gap-3 pb-2">
                {favorites.map((favorite) => (
                  <FavoriteCard
                    key={favorite.id}
                    id={favorite.id}
                    name={favorite.name}
                    lat={favorite.lat}
                    lon={favorite.lon}
                    isEditMode={isEditMode}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-white/10" />
            </ScrollArea>
          </SortableContext>
        </DndContext>
      )}
    </Card>
  );
}
