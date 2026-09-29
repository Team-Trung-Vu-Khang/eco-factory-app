import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { useWatch } from "react-hook-form";
import { FormSection } from "@/components/form";
import { uploadFile } from "@/features/storage";
import { getApiErrorMessage } from "@/lib/api-error";
import { useFactoryFormContext } from "./useFactoryFormContext";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_FILES = 10;
const FOLDER = "factory";

export function ImagesSection() {
  const { control, setValue } = useFactoryFormContext();
  const images = useWatch({ control, name: "images" }) ?? [];
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState<string[]>([]);

  const remaining = MAX_FILES - images.length;
  const canAdd = remaining > 0 && pending.length === 0;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    const invalid = files.filter(
      (f) =>
        !IMAGE_TYPES.includes(f.type) || f.size > MAX_SIZE_MB * 1024 * 1024,
    );
    if (invalid.length) {
      toast({
        title: "Ảnh không hợp lệ",
        description: `Chỉ nhận JPG, PNG, WEBP tối đa ${MAX_SIZE_MB}MB.`,
        variant: "destructive",
      });
    }

    const accepted = files
      .filter((f) => !invalid.includes(f))
      .slice(0, remaining);
    if (files.length - invalid.length > remaining) {
      toast({
        title: `Chỉ được tải tối đa ${MAX_FILES} ảnh máy móc / dây chuyền.`,
      });
    }
    if (!accepted.length) return;

    const previews = accepted.map((f) => URL.createObjectURL(f));
    setPending(previews);

    const results = await Promise.allSettled(
      accepted.map((f) => uploadFile(f, FOLDER)),
    );
    previews.forEach(URL.revokeObjectURL);
    setPending([]);

    const newUploaded = results.flatMap((r) => {
      if (r.status === "fulfilled") {
        return [
          {
            fileUrl: r.value.fileUrl,
            fileName: r.value.fileName,
            mimeType: r.value.mimeType || "image/jpeg",
            sizeBytes: r.value.sizeBytes,
          },
        ];
      }
      return [];
    });

    const failed = results.find(
      (r): r is PromiseRejectedResult => r.status === "rejected",
    );
    if (failed) {
      toast({
        title: "Tải ảnh thất bại",
        description: getApiErrorMessage(failed.reason),
        variant: "destructive",
      });
    }

    if (newUploaded.length) {
      setValue("images", [...images, ...newUploaded], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const dropHandlers = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      if (pending.length === 0) setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (pending.length === 0) handleFiles(e.dataTransfer.files);
    },
  };

  return (
    <FormSection
      title="Hình ảnh máy móc & dây chuyền"
      description={`Tải tối đa ${MAX_FILES} ảnh thực tế máy móc, dây chuyền hoặc phân xưởng`}
    >
      <div className="space-y-4">
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {images.map((img, i) => (
              <div
                key={img.fileUrl}
                className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm"
              >
                <img
                  src={img.fileUrl}
                  alt={img.fileName || "Ảnh máy móc"}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "images",
                      images.filter((_, idx) => idx !== i),
                      { shouldDirty: true, shouldValidate: true },
                    )
                  }
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 hover:bg-rose-600"
                  aria-label="Xóa ảnh"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {canAdd && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
            }
            {...dropHandlers}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-6 text-center transition cursor-pointer ${
              dragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 bg-slate-50/50 hover:border-emerald-400"
            }`}
          >
            {pending.length > 0 ? (
              <div className="flex items-center gap-2 text-emerald-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Đang tải ảnh lên...</span>
              </div>
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-emerald-600" />
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-emerald-700">Chọn ảnh</span>{" "}
                  hoặc kéo thả vào đây
                </p>
                <p className="text-xs text-slate-500">
                  JPG, PNG, WEBP · tối đa {MAX_SIZE_MB}MB · {images.length}/
                  {MAX_FILES} ảnh
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </FormSection>
  );
}
