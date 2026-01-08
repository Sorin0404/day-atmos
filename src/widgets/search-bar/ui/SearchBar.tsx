"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
      <Input
        type="text"
        placeholder="도시 검색"
        className="h-14 w-full rounded-2xl border-0 bg-white/10 pl-12 pr-4 text-lg text-white placeholder:text-white/50 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white/30"
      />
    </div>
  );
}
