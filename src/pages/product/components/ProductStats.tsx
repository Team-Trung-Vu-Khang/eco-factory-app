import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award, Package, Sparkles, Factory } from "lucide-react";
import { NEW_PRODUCT_TARGET, useProductSummary } from "@/features/product";

export function ProductStats() {
  const { data } = useProductSummary();
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Tổng sản phẩm" value={data?.total ?? "—"} icon={Package} />
      <StatsCard title="Đang sản xuất" value={data?.active ?? "—"} icon={Factory} />
      <StatsCard
        title="Sản phẩm mới phát triển"
        value={data ? `${data.newlyDeveloped} / ${NEW_PRODUCT_TARGET}` : "—"}
        change="chỉ số dự án"
        changeType="neutral"
        icon={Sparkles}
      />
      <StatsCard title="Có chứng nhận" value={data?.certified ?? "—"} icon={Award} />
    </div>
  );
}
