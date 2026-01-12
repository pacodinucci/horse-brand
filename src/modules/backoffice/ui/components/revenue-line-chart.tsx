"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type RawPoint = { label: string; amount: number };
type Point = { label: string; amount: number; cumulative: number };

function withCumulative(input: RawPoint[]): Point[] {
  let acc = 0;
  return input.map((p) => {
    acc += p.amount;
    return { ...p, cumulative: acc };
  });
}

function mockMonthlyRevenue(): RawPoint[] {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // mock “realista” (ARS)
  const base = [
    120000, 180000, 150000, 220000, 260000, 240000, 280000, 320000, 300000,
    360000, 390000, 420000,
  ];

  const now = new Date();
  const res: RawPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    res.push({
      label: months[m],
      amount: base[(m + d.getFullYear()) % base.length] + (i % 4) * 8000,
    });
  }
  return res;
}

function mockWeeklyRevenue(): RawPoint[] {
  // últimas 12 semanas
  const base = [
    22000, 26000, 31000, 28000, 35000, 42000, 39000, 46000, 44000, 52000, 49000,
    58000,
  ];
  return Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    amount: base[i],
  }));
}

const chartConfig = {
  amount: {
    label: "Ingresos período",
    color: "hsl(var(--chart-1))",
  },
  cumulative: {
    label: "Acumulado",
    color: "hsl(var(--chart-2))",
  },
} as const;

function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueLineChart() {
  const [mode, setMode] = React.useState<"month" | "week">("month");

  const data = React.useMemo(() => {
    const raw = mode === "month" ? mockMonthlyRevenue() : mockWeeklyRevenue();
    return withCumulative(raw);
  }, [mode]);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Ingresos</CardTitle>

          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "month" | "week")}
          >
            <TabsList>
              <TabsTrigger value="month">Mes</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={(v) => {
                // Compacto: $120k / $1.2M
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
                if (v >= 1_000) return `$${Math.round(v / 1_000)}k`;
                return `$${v}`;
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const n = String(name);
                    const label =
                      n === "amount"
                        ? "Ingresos período"
                        : n === "cumulative"
                        ? "Acumulado"
                        : n;

                    return [formatARS(Number(value)), label];
                  }}
                  labelFormatter={(label) =>
                    mode === "month" ? `Mes: ${label}` : `Semana: ${label}`
                  }
                />
              }
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--var-gold)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="var(--var-olive)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>

        <div className="mt-3 text-sm text-muted-foreground">
          Los datos no son reales.
        </div>
      </CardContent>
    </Card>
  );
}
