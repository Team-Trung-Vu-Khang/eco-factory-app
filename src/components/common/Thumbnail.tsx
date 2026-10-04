import placeholderImage from "@/assets/images/image-placeholder.webp";
import { useState } from "react";
import { ImagePreview } from "./ImagePreview";

const SIZES = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-16 w-16" } as const;

/** Square image preview for catalog items; falls back to the default placeholder when missing or broken */
export function Thumbnail({
  src,
  alt,
  size = "md",
  className = "",
  preview = true,
}: {
  src?: string | null;
  alt: string;
  size?: keyof typeof SIZES;
  className?: string;
  /** Click to open full image */
  preview?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const box = `${SIZES[size]} shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50 ${className}`;

  if (!src || broken)
    return <img src={placeholderImage} alt="" aria-hidden className={`${box} block object-cover`} />;
  const img = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={`${box} block object-cover`}
    />
  );
  return preview ? (
    <ImagePreview src={src} alt={alt}>
      {img}
    </ImagePreview>
  ) : (
    img
  );
}

/** Thumbnail + label, for table name cells and chips */
export function ThumbnailLabel({
  src,
  label,
  size = "md",
  children,
}: {
  src?: string | null;
  label: string;
  size?: keyof typeof SIZES;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <Thumbnail src={src} alt={label} size={size} />
      <div className="min-w-0">{children ?? <span className="font-medium text-slate-900">{label}</span>}</div>
    </div>
  );
}
