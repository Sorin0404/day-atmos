import { Cloud, MapPin } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function Header() {
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
