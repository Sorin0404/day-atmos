"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { WeatherCard } from "@/widgets/weather-card";
import { HourlyForecast } from "@/widgets/hourly-forecast";
import { useLocationStore } from "@/shared/store";
import { useFavoriteStore, useFavoriteStoreHydration } from "@/shared/store/favoriteStore";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { InputDialog } from "@/shared/ui/input-dialog";

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setLocation } = useLocationStore();
  const {
    addFavorite,
    isFavorite,
    favorites,
    getFavoriteByCoords,
    updateFavoriteName,
    removeFavorite,
  } = useFavoriteStore();
  const hasHydrated = useFavoriteStoreHydration();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editedName, setEditedName] = useState("");

  const lat = Number.parseFloat(params.lat as string);
  const lon = Number.parseFloat(params.lon as string);

  const currentFavorite = getFavoriteByCoords(lat, lon);

  // 페이지 로드 시 해당 좌표로 위치 설정
  useEffect(() => {
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      setLocation(lat, lon);
    }
  }, [lat, lon, setLocation]);

  const handleBack = () => {
    router.back();
  };

  const handleAddFavorite = () => {
    // 이미 즐겨찾기에 있는지 확인
    if (isFavorite(lat, lon)) {
      return;
    }

    // 6개 제한 체크
    if (favorites.length >= 6) {
      setShowLimitDialog(true);
      return;
    }

    // 즐겨찾기 추가 (주소는 WeatherCard에서 가져올 수 없으므로 임시로 좌표 사용)
    const success = addFavorite({
      name: `위치 ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      lat,
      lon,
    });

    if (!success) {
      setShowLimitDialog(true);
    }
  };

  const handleEditClick = () => {
    if (currentFavorite) {
      setEditedName(currentFavorite.name);
      setIsEditingName(true);
    }
  };

  const handleSaveName = () => {
    if (currentFavorite && editedName.trim()) {
      updateFavoriteName(currentFavorite.id, editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = () => {
    if (currentFavorite) {
      removeFavorite(currentFavorite.id);
      setIsConfirmingDelete(false);
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-500 via-blue-600 to-blue-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 rounded-full bg-white/10 px-4 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>뒤로가기</span>
          </Button>

          <div className="flex items-center gap-2">
            {!hasHydrated ? (
              /* 서버 사이드 렌더링 시 플레이스홀더 */
              <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
            ) : currentFavorite ? (
              <>
                {/* 즐겨찾기인 경우: 수정/삭제 버튼 */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditClick}
                  className="rounded-full bg-white/10 hover:bg-white/20"
                  title="이름 수정"
                >
                  <Edit2 className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteClick}
                  className="rounded-full bg-white/10 hover:bg-red-500/50"
                  title="즐겨찾기에서 삭제"
                >
                  <Trash2 className="h-5 w-5 text-white" />
                </Button>
              </>
            ) : (
              /* 즐겨찾기가 아닌 경우: 추가 버튼 */
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddFavorite}
                className="rounded-full bg-white/10 hover:bg-white/20"
                title="즐겨찾기에 추가"
              >
                <Star className="h-6 w-6 text-white" />
              </Button>
            )}
          </div>
        </header>

        {/* 상세 날씨 정보 */}
        <div className="space-y-6">
          <WeatherCard displayName={hasHydrated ? currentFavorite?.name : undefined} />
          <HourlyForecast />
        </div>
      </div>

      {/* 6개 제한 Dialog */}
      <ConfirmDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
        title="즐겨찾기 제한"
        description={
          <>
            즐겨찾기는 최대 6개까지만 추가할 수 있습니다.
            <br />
            다른 장소를 추가하려면 기존 즐겨찾기를 삭제해주세요.
          </>
        }
        confirmLabel="확인"
        onConfirm={() => {}}
      />

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
        onCancel={() => setEditedName(currentFavorite?.name || "")}
      />

      {/* 삭제 확인 Dialog */}
      <ConfirmDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title="즐겨찾기 삭제"
        description={
          <>
            &quot;{currentFavorite?.name}&quot;을(를) 즐겨찾기에서
            삭제하시겠습니까?
            <br />
            삭제 후 메인 페이지로 돌아갑니다.
          </>
        }
        confirmLabel="삭제"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
