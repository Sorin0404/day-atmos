import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";

export interface FavoriteLocation {
  id: string;
  name: string; // 사용자가 수정 가능한 별칭
  address: string; // 원본 주소 (예: "서울특별시 용산구 후암동")
  lat: number;
  lon: number;
  addedAt: number; // 타임스탬프
}

interface FavoriteStore {
  favorites: FavoriteLocation[];
  addFavorite: (location: Omit<FavoriteLocation, "id" | "addedAt">) => boolean;
  removeFavorite: (id: string) => void;
  updateFavoriteName: (id: string, newName: string) => void;
  isFavorite: (lat: number, lon: number) => boolean;
  getFavoriteByCoords: (
    lat: number,
    lon: number
  ) => FavoriteLocation | undefined;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (location) => {
        const { favorites } = get();

        // 6개 제한
        if (favorites.length >= 6) {
          return false;
        }

        // 중복 체크 (같은 좌표)
        const isDuplicate = favorites.some(
          (fav) =>
            Math.abs(fav.lat - location.lat) < 0.001 &&
            Math.abs(fav.lon - location.lon) < 0.001
        );

        if (isDuplicate) {
          return false;
        }

        const newFavorite: FavoriteLocation = {
          ...location,
          id: `fav_${Date.now()}_${Math.random()}`,
          addedAt: Date.now(),
        };

        set({ favorites: [...favorites, newFavorite] });
        return true;
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },

      updateFavoriteName: (id, newName) => {
        set((state) => ({
          favorites: state.favorites.map((fav) =>
            fav.id === id ? { ...fav, name: newName } : fav
          ),
        }));
      },

      isFavorite: (lat, lon) => {
        const { favorites } = get();
        return favorites.some(
          (fav) =>
            Math.abs(fav.lat - lat) < 0.001 && Math.abs(fav.lon - lon) < 0.001
        );
      },

      getFavoriteByCoords: (lat, lon) => {
        const { favorites } = get();
        return favorites.find(
          (fav) =>
            Math.abs(fav.lat - lat) < 0.001 && Math.abs(fav.lon - lon) < 0.001
        );
      },
    }),
    {
      name: "favorite-locations",
    }
  )
);

// Zustand persist의 hydration 상태를 추적하는 커스텀 훅 (useSyncExternalStore 사용)
export const useFavoriteStoreHydration = () => {
  return useSyncExternalStore(
    // subscribe: hydration 완료 이벤트 구독
    useFavoriteStore.persist.onFinishHydration,
    // getSnapshot: 현재 hydration 상태 반환 (클라이언트)
    () => useFavoriteStore.persist.hasHydrated(),
    // getServerSnapshot: 서버에서는 항상 false (hydrated 안 됨)
    () => false
  );
};
