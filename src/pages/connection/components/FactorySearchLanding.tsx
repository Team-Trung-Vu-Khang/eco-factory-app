import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import heroImage from "@/assets/images/factory-search-hero-mevi.webp";
import landscapeImage from "@/assets/images/landscape-farm-factory.webp";
import { FactorySproutIcon, LeafWatermark, SheetCurve } from "./landing-art";

/** Mobile-app intro shown before the search form: full-bleed photo + bottom sheet */
export function FactorySearchLanding({ onStart }: { onStart: () => void }) {
  const [loaded, setLoaded] = useState(false);
  // Exact height from our top edge to the screen bottom → fits one screen, never scrolls
  const [rootRef, height] = useFillViewportHeight<HTMLDivElement>();

  return (
    // Cancel the mobile layout's padding so the photo runs edge to edge down to the bottom nav
    <div
      ref={rootRef}
      style={{ height }}
      className="relative -mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-[#f7f5ee]"
    >
      {/* Photo fills the top and slides under the sheet's rounded corners */}
      <div className="relative min-h-0 flex-1">
        <img
          src={heroImage}
        alt="Nông dân và nhà máy chế biến MEVI Factory"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
          className={`fsl-kenburns absolute inset-x-0 top-0 -bottom-10 h-[calc(100%+2.5rem)] w-full object-cover object-[50%_42%] transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-28 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <section className="fsl-sheet relative -mt-10 flex shrink-0 flex-col bg-[#f7f5ee]">
        {/* Wavy top edge instead of plain rounded corners */}
        <SheetCurve className="pointer-events-none absolute inset-x-0 -top-[47px] h-12 w-full" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <LeafWatermark className="absolute -right-10 -top-10 h-48 w-48 rotate-6 text-emerald-800/[0.07]" />
        </div>
        <div className="relative px-6 pt-2">
          <h1 className="relative text-[2.125rem] font-extrabold leading-[1.15] tracking-tight text-[#14532d]">
            Tìm nhà máy
            <br />
            chế biến phù hợp
          </h1>
          <p className="relative mt-3 text-[15px] leading-relaxed text-slate-600">
            Kết nối nông sản của bạn với nhà máy, xưởng chế biến gần nhất.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="group relative mt-6 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-[#14532d] to-[#1f7a45] px-5 py-[1.1rem] text-left text-white shadow-lg shadow-emerald-900/25 transition-transform duration-150 active:scale-[0.98]"
          >
            <FactorySproutIcon className="h-9 w-9 shrink-0 text-white" />
            <span className="flex-1 text-[1.125rem] font-semibold">
              Tìm nhà máy ngay
            </span>
            <ArrowRight className="h-6 w-6 shrink-0 transition-transform duration-200 group-active:translate-x-1" />
          </button>
        </div>

        <img
          src={landscapeImage}
          alt=""
          aria-hidden
          loading="lazy"
          className="fsl-landscape relative mt-5 block h-[calc(7.5rem+5.5rem+env(safe-area-inset-bottom))] w-full object-cover object-[50%_75%] [mask-image:linear-gradient(to_bottom,transparent,black_35%)]"
        />
      </section>
    </div>
  );
}
