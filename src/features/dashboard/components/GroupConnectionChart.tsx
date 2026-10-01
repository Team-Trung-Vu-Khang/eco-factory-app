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
import type {
  AdminFactoryCatalogChartItem,
  GroupConnectionPoint,
} from "../types";

const chartConfig = {
  requests: { label: "Yêu cầu", color: "#10b981" },
  connected: { label: "Kết nối thành công", color: "#0f766e" },
} satisfies ChartConfig;

const ROW_HEIGHT = 48;

interface GroupConnectionChartProps {
  title: string;
  items?: AdminFactoryCatalogChartItem[];
  data?: GroupConnectionPoint[];
  isLoading?: boolean;
}

export function GroupConnectionChart({
  title,
  items,
  data,
  isLoading,
}: GroupConnectionChartProps) {
  const chartData: GroupConnectionPoint[] =
    items?.map((item) => ({
      name: item.name,
      requests: item.connectionRequests,
      connected: item.acceptedConnectionRequests,
    })) ||
    data ||
    [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">
            Đang tải dữ liệu...
          </div>
        ) : chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Chưa có dữ liệu.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: Math.max(160, chartData.length * ROW_HEIGHT) }}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              barGap={2}
              margin={{ left: 8 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="requests"
                fill="var(--color-requests)"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="connected"
                fill="var(--color-connected)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
