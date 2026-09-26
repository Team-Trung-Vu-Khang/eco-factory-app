import { useFactoryOptions } from "@/features/factory";

export function FactoryName({ id }: { id: string }) {
  return <span className="text-sm text-slate-600">{useFactoryOptions().nameOf(id)}</span>;
}
