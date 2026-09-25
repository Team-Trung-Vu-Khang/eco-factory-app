import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePersonnelSearch, type Personnel } from "@/features/personnel";

interface PersonnelPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string;
  onSelect: (person: Personnel) => void;
  title?: string;
}

export function PersonnelPickerDialog({
  open,
  onOpenChange,
  selectedId,
  onSelect,
  title = "Chọn người phụ trách",
}: PersonnelPickerDialogProps) {
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(keyword), 300);
    return () => window.clearTimeout(t);
  }, [keyword]);

  const { data = [], isFetching } = usePersonnelSearch(debounced, open);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setKeyword("");
      }}
    >
      <DialogContent className="max-w-md gap-3">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Tìm theo tên, chức vụ hoặc số điện thoại</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input autoFocus value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm nhân sự..." className="pl-9 pr-9" />
          {isFetching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />}
        </div>

        <ul className="max-h-80 space-y-1 overflow-y-auto">
          {data.length === 0 && !isFetching && (
            <li className="py-6 text-center text-sm text-slate-500">Không tìm thấy nhân sự.</li>
          )}
          {data.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(p);
                  onOpenChange(false);
                  setKeyword("");
                }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-slate-100 ${p.id === selectedId ? "bg-emerald-50" : ""}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {p.fullName.split(" ").pop()?.[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{p.fullName}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {[p.position, p.phone ?? "Chưa có SĐT"].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {p.id === selectedId && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
