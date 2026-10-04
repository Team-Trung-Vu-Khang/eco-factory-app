import { BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";

/** Marketplace only lists APPROVED profiles */
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-sm ${className}`}
    >
      <BadgeCheck className="h-3.5 w-3.5 fill-emerald-600 text-white" />
      Đã xác minh
    </span>
  );
}

/** Small pill; pass an image/icon for a leading visual */
export function Pill({
  children,
  lead,
  tone = "green",
}: {
  children: ReactNode;
  lead?: ReactNode;
  tone?: "green" | "slate";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        tone === "green"
          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {lead}
      {children}
    </span>
  );
}

/** Rounded section block used on detail / confirm screens */
export function Block({
  icon,
  title,
  children,
  id,
}: {
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(20,83,45,0.05)] ring-1 ring-emerald-900/5"
    >
      {title && (
        <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-slate-900">
          {icon && <span className="text-emerald-700">{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

/** Card section: icon + title header, then content */
export function Section({
  id,
  icon,
  title,
  children,
}: {
  id?: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-16 rounded-2xl bg-white p-3.5 shadow-[0_1px_8px_rgba(20,83,45,0.06)] ring-1 ring-slate-200/70"
    >
      <h3 className="mb-2.5 flex items-center gap-2 text-[15px] font-semibold text-slate-800">
        <span className="text-slate-500">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Label/value rows; rows without a value are skipped */
export function InfoRows({ rows }: { rows: [string, ReactNode][] }) {
  const shown = rows.filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  return (
    <dl className="divide-y divide-slate-100">
      {shown.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 py-2 text-sm">
          <dt className="shrink-0 text-slate-500">{label}</dt>
          <dd className="min-w-0 text-right font-medium text-slate-800">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Chip({
  lead,
  children,
}: {
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/70 px-2.5 py-1 text-[13px] font-medium text-emerald-900 ring-1 ring-emerald-100">
      {lead}
      {children}
    </span>
  );
}
