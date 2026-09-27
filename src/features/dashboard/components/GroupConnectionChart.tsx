import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { GroupConnectionPoint } from "../types";

const chartConfig = {
  requests: { label: "Yêu cầu", color: "#10b981" },
  connected: { label: "Kết nối thành công", color: "#0f766e" },
} satisfies ChartConfig;

const ROW_HEIGHT = 48;

interface GroupConnectionChartProps {
  title: string;
  data: GroupConnectionPoint[];
}

export function GroupConnectionChart({ title, data }: GroupConnectionChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
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
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">Chưa có dữ liệu.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: Math.max(160, data.length * ROW_HEIGHT) }}
          >
            <BarChart data={data} layout="vertical" barGap={2} margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="requests" fill="var(--color-requests)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="connected" fill="var(--color-connected)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
