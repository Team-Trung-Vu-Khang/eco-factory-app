import { Award, BadgeCheck, CalendarClock, CircleX } from "lucide-react";
import { StatsGrid } from "@/components/common/StatsGrid";
import type { CertificateSummary } from "@/features/certificate";

export function CertificateStats({ data }: { data?: CertificateSummary }) {
  return (
    <StatsGrid
      items={[
        { title: "Tổng chứng nhận", value: data?.total ?? "—", icon: Award },
        { title: "Còn hiệu lực", value: data?.valid ?? "—", icon: BadgeCheck },
        {
          title: "Sắp hết hạn",
          value: data?.expiringSoon ?? "—",
          change: "trong 60 ngày tới",
          changeType: "neutral",
          icon: CalendarClock,
        },
        {
          title: "Đã hết hạn",
          value: data?.expired ?? "—",
          changeType: "negative",
          icon: CircleX,
        },
      ]}
    />
  );
}
