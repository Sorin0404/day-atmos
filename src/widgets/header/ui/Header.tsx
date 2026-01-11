"use client";

import { Cloud, MapPin } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useEffect } from "react";
import { useLocationStore } from "@/shared/store";

export function Header() {
  const { setLocation } = useLocationStore();

  useEffect(() => {
    const handleSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setLocation(latitude, longitude);
    };

    const handleError = (err: GeolocationPositionError) => {
      console.error("Geolocation error:", err.message);
    };

    const { geolocation } = navigator;

    if (!geolocation) {
      console.error("Geolocation is not supported.");
      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError);
  }, [setLocation]);

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
          <Cloud className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-semibold text-white">Day Atmos</span>
      </div>
      <Button
        variant="ghost"
        className="gap-2 rounded-full bg-white/10 px-4 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">현재 위치</span>
      </Button>
    </header>
  );
}
