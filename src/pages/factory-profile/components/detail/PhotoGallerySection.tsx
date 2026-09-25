import { FormSection } from "@/components/form";
import type { Factory } from "@/features/factory";

function Gallery({ title, urls }: { title: string; urls: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">{title}</p>
      {urls.length === 0 ? (
        <p className="text-sm text-slate-400">Chưa có ảnh.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {urls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-lg border border-slate-200">
              <img src={url} alt="" className="h-full w-full object-cover transition hover:scale-105" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function PhotoGallerySection({ factory }: { factory: Factory }) {
  return (
    <FormSection title="Hình ảnh">
      <div className="space-y-4">
        <Gallery title="Khu vực chế biến" urls={factory.facilityPhotos} />
        <Gallery title="Máy móc / dây chuyền" urls={factory.machinePhotos} />
      </div>
    </FormSection>
  );
}
