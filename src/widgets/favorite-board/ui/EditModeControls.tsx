"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib";

interface EditModeControlsProps {
  isEditMode: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export function EditModeControls({
  isEditMode,
  onStartEdit,
  onCancel,
  onComplete,
}: EditModeControlsProps) {
  if (isEditMode) {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className={cn(
            "h-8 rounded-full px-3 text-xs",
            "bg-white/10 text-white",
            "hover:bg-white/20 hover:text-white"
          )}
        >
          취소
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onComplete}
          className={cn(
            "h-8 rounded-full px-3 text-xs",
            "bg-blue-600 text-white",
            "hover:bg-blue-700 hover:text-white"
          )}
        >
          완료
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onStartEdit}
      className={cn(
        "h-8 rounded-full px-3 text-xs",
        "bg-white/10 text-white",
        "hover:bg-white/20 hover:text-white"
      )}
    >
      편집
    </Button>
  );
}
