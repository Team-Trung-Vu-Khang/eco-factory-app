import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Camera, FileText, ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { uploadFile } from "@/features/storage";
import { getApiErrorMessage } from "@/lib/api-error";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PDF_TYPE = "application/pdf";

const isPdf = (url: string) => /\.pdf($|\?)/i.test(url) || url.startsWith("pdf:");
const MAX_SIZE_MB = 5;

interface ImageDropzoneProps {
  value: string[];
  onChange: (urls: string[]) => void;
  /** 1 = single image (replaces the current one) */
  maxFiles?: number;
  folder?: string;
  disabled?: boolean;
  /** Notifies the form while uploads are running */
  onUploadingChange?: (uploading: boolean) => void;
  /** "avatar" = compact square box for a single logo/photo */
  variant?: "default" | "avatar";
  /** Also accept PDF files (certificates, documents) */
  allowPdf?: boolean;
}

export function ImageDropzone({
  value,
  onChange,
  maxFiles = 10,
  folder,
  disabled,
  onUploadingChange,
  variant = "default",
  allowPdf = false,
}: ImageDropzoneProps) {
  const ACCEPT = allowPdf ? [...IMAGE_TYPES, PDF_TYPE] : IMAGE_TYPES;
  const acceptLabel = allowPdf ? "JPG, PNG, WEBP, PDF" : "JPG, PNG, WEBP";
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState<string[]>([]); // local previews while uploading

  const single = maxFiles === 1;
  const remaining = single ? 1 : maxFiles - value.length;
  const canAdd = !disabled && remaining > 0 && pending.length === 0;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length || disabled) return;

    const files = Array.from(fileList);
    const invalid = files.filter(
      (f) => !ACCEPT.includes(f.type) || f.size > MAX_SIZE_MB * 1024 * 1024,
    );
    if (invalid.length) {
      toast({
        title: "Ảnh không hợp lệ",
        description: `Chỉ nhận ${acceptLabel} tối đa ${MAX_SIZE_MB}MB: ${invalid.map((f) => f.name).join(", ")}`,
        variant: "destructive",
      });
    }

    const accepted = files.filter((f) => !invalid.includes(f)).slice(0, remaining);
    if (files.length - invalid.length > remaining) {
      toast({ title: `Chỉ được tải tối đa ${maxFiles} ảnh.` });
    }
    if (!accepted.length) return;

    const previews = accepted.map((f) => (f.type === PDF_TYPE ? `pdf:${f.name}` : URL.createObjectURL(f)));
    setPending(previews);
    onUploadingChange?.(true);

    const results = await Promise.allSettled(accepted.map((f) => uploadFile(f, folder)));
    previews.filter((u) => u.startsWith("blob:")).forEach(URL.revokeObjectURL);
    setPending([]);
    onUploadingChange?.(false);

    const uploaded = results.flatMap((r) => (r.status === "fulfilled" ? [r.value.fileUrl] : []));
    const failed = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
    if (failed) {
      toast({ title: "Tải ảnh thất bại", description: getApiErrorMessage(failed.reason), variant: "destructive" });
    }
    if (uploaded.length) onChange(single ? uploaded.slice(0, 1) : [...value, ...uploaded]);
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT.join(",")}
      multiple={!single}
      hidden
      onChange={(e) => {
        handleFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );

  const dropHandlers = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      if (!disabled && pending.length === 0) setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (!disabled && pending.length === 0) handleFiles(e.dataTransfer.files);
    },
  };

  if (variant === "avatar") {
    const src = pending[0] ?? value[0];
    const busy = pending.length > 0;
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className="group relative">
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => inputRef.current?.click()}
            {...dropHandlers}
            className={`flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
              dragging ? "border-emerald-500 bg-emerald-50" : src ? "border-transparent" : "border-slate-200 bg-slate-50 hover:border-emerald-400"
            }`}
            aria-label={src ? "Đổi ảnh" : "Tải ảnh lên"}
          >
            {src ? (
              <>
                <img src={src} alt="" className={`h-full w-full object-cover ${busy ? "opacity-50" : ""}`} />
                {!busy && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
                    <Camera className="h-5 w-5" />
                  </span>
                )}
              </>
            ) : (
              <span className="flex flex-col items-center gap-1 px-2 text-center text-xs text-slate-500">
                <ImagePlus className="h-6 w-6 text-emerald-600" />
                Kéo thả hoặc chọn ảnh
              </span>
            )}
            {busy && <Loader2 className="absolute h-5 w-5 animate-spin text-emerald-700" />}
          </button>
          {value[0] && !busy && !disabled && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-slate-600 shadow ring-1 ring-slate-200 hover:text-rose-600"
              aria-label="Xóa ảnh"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400">JPG, PNG · ≤ {MAX_SIZE_MB}MB</p>
        {fileInput}
      </div>
    );
  }

  const tiles = [...value.map((url) => ({ url, uploading: false })), ...pending.map((url) => ({ url, uploading: true }))];
  const showDropArea = single ? tiles.length === 0 : canAdd || pending.length > 0 || value.length === 0;

  return (
    <div className="space-y-3">
      {tiles.length > 0 && (
        <div className={single ? "w-32" : "grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6"}>
          {tiles.map(({ url, uploading }, i) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {isPdf(url) ? (
                <a
                  href={uploading ? undefined : url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center ${uploading ? "opacity-50" : "hover:bg-slate-100"}`}
                >
                  <FileText className="h-7 w-7 text-rose-500" />
                  <span className="line-clamp-2 break-all text-[10px] text-slate-600">
                    {decodeURIComponent(url.replace(/^pdf:/, "").split("/").pop()?.split("?")[0] ?? "PDF")}
                  </span>
                </a>
              ) : (
                <img src={url} alt="" className={`h-full w-full object-cover ${uploading ? "opacity-50" : ""}`} />
              )}
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
                </div>
              ) : (
                !disabled && (
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Xóa ảnh"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {single && tiles.length > 0 && !disabled && pending.length === 0 && (
        <button type="button" onClick={() => inputRef.current?.click()} className="text-sm font-medium text-emerald-700 hover:underline">
          Đổi ảnh
        </button>
      )}

      {showDropArea && (
        <div
          role="button"
          tabIndex={canAdd ? 0 : -1}
          aria-disabled={!canAdd}
          onClick={() => canAdd && inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && canAdd && inputRef.current?.click()}
          {...dropHandlers}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
            dragging ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50/50"
          } ${canAdd ? "cursor-pointer hover:border-emerald-400" : "cursor-not-allowed opacity-60"}`}
        >
          <ImagePlus className="h-6 w-6 text-emerald-600" />
          <p className="text-sm text-slate-700">
            <span className="font-medium text-emerald-700">Chọn ảnh</span> hoặc kéo thả vào đây
          </p>
          <p className="text-xs text-slate-500">
            {acceptLabel} · tối đa {MAX_SIZE_MB}MB{single ? "" : ` · ${value.length}/${maxFiles} tệp`}
          </p>
        </div>
      )}

      {fileInput}
    </div>
  );
}
