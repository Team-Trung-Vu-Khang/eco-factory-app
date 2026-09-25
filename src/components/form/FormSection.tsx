import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Titled group of fields, no card frame */
export function FormSection({ title, description, actions, children, className }: FormSectionProps) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-start justify-between gap-4 border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
