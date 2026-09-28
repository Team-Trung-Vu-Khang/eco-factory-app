import { Cog, type LucideIcon } from "lucide-react";
import type { Factory } from "@/features/factory";
import { DetailCard } from "@/components/common/DetailCard";

function Gallery({ icon, title, urls }: { icon: LucideIcon; title: string; urls: string[] }) {
  return (
    <DetailCard icon={icon} title={`${title} (${urls.length})`}>
      {urls.length === 0 ? (
        <p className="text-sm text-slate-400">Chưa có ảnh.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {urls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <img src={url} alt="" className="h-full w-full object-cover transition hover:scale-105" />
            </a>
          ))}
        </div>
      )}
    </DetailCard>
  );
}

export function PhotoGallerySection({ factory }: { factory: Factory }) {
  return (
    <Gallery icon={Cog} title="Máy móc / dây chuyền" urls={factory.machinePhotos} />
  );
}
