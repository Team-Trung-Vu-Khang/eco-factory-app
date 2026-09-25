import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award, BadgeCheck, CalendarClock, CircleX } from "lucide-react";
import { useCertificateSummary } from "@/features/certificate";

export function CertificateStats() {
  const { data } = useCertificateSummary();
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Tổng chứng nhận" value={data?.total ?? "—"} icon={Award} />
      <StatsCard title="Còn hiệu lực" value={data?.valid ?? "—"} icon={BadgeCheck} />
      <StatsCard title="Sắp hết hạn" value={data?.expiringSoon ?? "—"} change="trong 60 ngày tới" changeType="neutral" icon={CalendarClock} />
      <StatsCard title="Đã hết hạn" value={data?.expired ?? "—"} changeType="negative" icon={CircleX} />
    </div>
  );
}
