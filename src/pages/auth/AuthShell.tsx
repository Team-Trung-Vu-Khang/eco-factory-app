import { Factory } from "lucide-react";
import type { ReactNode } from "react";

/** Shared backdrop + card for the public login / register pages */
export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 text-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60" />
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-lime-200/50 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <Factory className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
