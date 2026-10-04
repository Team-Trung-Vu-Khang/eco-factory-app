import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState, type ReactNode } from "react";

/** Wraps a preview so clicking it opens the full image in a lightbox */
export function ImagePreview({
  src,
  alt,
  children,
  className = "",
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        title="Xem ảnh"
        aria-label={`Xem ảnh ${alt}`}
        className={`shrink-0 cursor-zoom-in rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
        onClick={(e) => {
          // Don't trigger row clicks in tables
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="fsl-no-sheet gap-0 overflow-hidden border-0 p-0 sm:max-w-[min(92vw,1200px)] [&>button]:rounded-full [&>button]:bg-black/50 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button:hover]:bg-black/70"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center bg-slate-950">
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
          <div className="border-t border-slate-100 bg-white px-5 py-3">
            <DialogTitle className="truncate text-sm font-semibold text-slate-900">
              {alt}
            </DialogTitle>
            <DialogDescription className="sr-only">Xem ảnh kích thước đầy đủ</DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
