import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FACTORY_ROUTES } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Circle } from "lucide-react";
import { Link } from "wouter";
import type { ProfileStatus } from "../types";

export function ProfileStatusCard({ profile }: { profile: ProfileStatus }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Hồ sơ nhà máy</CardTitle>
        <CardDescription>
          {profile.isKpiEligible
            ? "Đã đủ điều kiện hiển thị và tính vào chỉ số dự án."
            : "Hoàn thiện hồ sơ để được gợi ý tới người có nhu cầu."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-slate-500">Mức hoàn thiện</span>
            <span className="font-semibold tabular-nums">
              {profile.completionPercent}%
            </span>
          </div>
          <Progress value={profile.completionPercent} />
        </div>

        <ul className="space-y-2">
          {profile.checklist.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-slate-300" />
              )}
              <span className={item.done ? "text-slate-700" : "text-slate-500"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        {!profile.isKpiEligible && (
          <Button asChild className="w-full">
            <Link href={FACTORY_ROUTES.profile}>Cập nhật hồ sơ</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
