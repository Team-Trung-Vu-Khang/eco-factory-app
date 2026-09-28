import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Card with icon title bar — shared by the profile detail tabs */
export function DetailCard({ icon: Icon, title, children, className = "" }: { icon: LucideIcon; title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 sm:py-4">
        <Icon className="h-5 w-5 shrink-0 text-emerald-600" />
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

/** Uppercase icon label + value, as in the stat row */
export function DetailField({ icon: Icon, label, children, iconClassName = "text-slate-400" }: { icon: LucideIcon; label: string; children: ReactNode; iconClassName?: string }) {
  const empty = children === undefined || children === null || children === "";
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClassName}`} />
        {label}
      </p>
      <div className="break-words text-sm font-semibold text-slate-900 sm:text-base">{empty ? <span className="font-normal text-slate-400">—</span> : children}</div>
    </div>
  );
}
