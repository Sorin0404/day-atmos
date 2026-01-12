import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function InputDialog({
  open,
  onOpenChange,
  title,
  description,
  value,
  onValueChange,
  placeholder = "입력하세요",
  confirmLabel = "저장",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: InputDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark bg-indigo-950/95 backdrop-blur-md border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-white/70">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
