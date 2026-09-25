import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
  /** Where to go; falls back to browser history when omitted */
  to?: string;
  label?: string;
}

export function BackButton({ to, label = "Quay lại" }: BackButtonProps) {
  const [, navigate] = useLocation();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => (to ? navigate(to) : window.history.back())}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
