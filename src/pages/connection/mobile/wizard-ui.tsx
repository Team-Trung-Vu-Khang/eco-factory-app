import { ArrowLeft, Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import bannerImage from "@/assets/images/landscape-farm-factory.webp";
import placeholderImage from "@/assets/images/image-placeholder.webp";

const STEPS = ["Nông sản", "Dịch vụ", "Kết quả"] as const;

/** Banner with back button + 3-step progress */
export function WizardHeader({
  step,
  onBack,
  labels = STEPS,
}: {
  /** 1-based current step; omit for a plain banner (e.g. detail page) */
  step?: number;
  /** Step names, defaults to the factory search flow */
  labels?: readonly string[];
  /** Omit on top-level tab pages (no back button) */
  onBack?: () => void;
}) {
  return (
    <header
      className={`relative -mx-4 -mt-4 overflow-hidden ${step ? "h-36" : "h-32"}`}
    >
      <img
        src={bannerImage}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%] [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-[#f7f5ee]/40 to-[#f7f5ee]" />
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow-sm backdrop-blur active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      {step && (
        <ol
          className={`relative mx-auto flex items-start justify-between pt-16 ${labels.length > 3 ? "w-full max-w-sm px-1" : "w-60"}`}
        >
          {labels.map((label, i) => {
            const n = i + 1;
            const done = n < step!;
            const active = n === step!;
            return (
              <li
                key={label}
                className="relative flex flex-1 flex-col items-center"
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className={`absolute right-1/2 top-3.5 h-[3px] w-full -translate-y-1/2 rounded-full ${n <= step! ? "bg-[#1f7a45]" : "bg-white/90"}`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-4 ring-[#f7f5ee] transition-colors ${
                    active || done
                      ? "bg-[#14532d] text-white"
                      : "bg-white text-slate-400 ring-offset-0"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : n}
                </span>
                <span
                  className={`mt-1 text-[11px] font-medium ${active ? "text-[#14532d]" : "text-slate-500"}`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </header>
  );
}

/** White rounded card with numbered/iconed heading */
export function SectionCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white/80 p-4 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#14532d]">
          {icon}
        </span>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/** Image with the default agri placeholder when missing or broken */
export function TileImage({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <img
      src={src && !broken ? src : placeholderImage}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={`object-cover ${className}`}
    />
  );
}

/** Green check badge for selected tiles */
export function SelectedBadge() {
  return (
    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1f7a45] text-white shadow ring-2 ring-white">
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  );
}

/** Sticky footer above the bottom nav with a soft landscape backdrop */
export function WizardFooter({ children }: { children: ReactNode }) {
  return (
    // Sticks to the screen bottom; the landscape runs down behind the bottom nav so no page bg shows
    <div className="sticky bottom-0 z-20 -mx-4 mt-6">
      <div className="relative overflow-hidden px-4 pt-6 pb-[calc(6.25rem+env(safe-area-inset-bottom))]">
        <img
          src={bannerImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[50%_80%] [mask-image:linear-gradient(to_bottom,transparent,black_35%)]"
        />
        <div className="relative flex gap-3">{children}</div>
      </div>
    </div>
  );
}
