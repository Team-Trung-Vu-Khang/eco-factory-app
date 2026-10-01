import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAdminConnectionChart } from "../hooks/use-dashboard";
import type { FactoryDashboardPeriodType } from "../types";
import dayjs from "dayjs";

const chartConfig = {
  connectionRequests: { label: "Yêu cầu kết nối", color: "#10b981" },
  acceptedConnectionRequests: { label: "Kết nối thành công", color: "#0f766e" },
} satisfies ChartConfig;

const PERIOD_OPTIONS: { value: FactoryDashboardPeriodType; label: string }[] = [
  { value: "MONTHLY", label: "Theo tháng" },
  { value: "YEARLY", label: "Theo năm" },
];

export function DemandTrendChart() {
  const [periodType, setPeriodType] =
    useState<FactoryDashboardPeriodType>("MONTHLY");
  const { data, isLoading } = useAdminConnectionChart({ periodType });

  const chartData = (data?.points || []).map((p) => {
    let label = p.bucketStart;
    if (periodType === "MONTHLY" && p.bucketStart) {
      // e.g. "2026-01" -> "T1/2026" or "T1"
      const d = dayjs(p.bucketStart);
      if (d.isValid()) {
        label = `T${d.format("M")}`;
      }
    }
    return {
      name: label,
      connectionRequests: p.connectionRequests,
      acceptedConnectionRequests: p.acceptedConnectionRequests,
    };
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Tình hình kết nối</CardTitle>
          <CardDescription>
            {periodType === "MONTHLY"
              ? "Các tháng trong năm"
              : "Các năm gần đây"}
          </CardDescription>
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600">
            {Object.entries(chartConfig).map(([key, { label, color }]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={periodType === opt.value}
              onClick={() => setPeriodType(opt.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                periodType === opt.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            Đang tải dữ liệu biểu đồ...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            Chưa có dữ liệu kết nối.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="connectionRequests"
                fill="var(--color-connectionRequests)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="acceptedConnectionRequests"
                fill="var(--color-acceptedConnectionRequests)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
