import { Construction } from "lucide-react";
import PageWrapper from "./PageWrapper";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <PageWrapper title={title} description={description}>
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white text-center">
        <Construction className="h-8 w-8 text-emerald-600" />
        <p className="text-sm text-slate-500">Trang đang được phát triển.</p>
      </div>
    </PageWrapper>
  );
}
