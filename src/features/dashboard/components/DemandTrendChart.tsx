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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { MonthlyDemandPoint } from "../types";

const chartConfig = {
  received: { label: "Nhu cầu nhận được", color: "#10b981" },
  connected: { label: "Đã kết nối", color: "#0f766e" },
} satisfies ChartConfig;

export function DemandTrendChart({ data }: { data: MonthlyDemandPoint[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Nhu cầu theo tháng</CardTitle>
        <CardDescription>6 tháng gần nhất</CardDescription>
        <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600">
          {Object.entries(chartConfig).map(([key, { label, color }]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="received" fill="var(--color-received)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="connected" fill="var(--color-connected)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
