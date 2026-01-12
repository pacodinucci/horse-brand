"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type Point = { label: string; sales: number };

function mockMonthlyData(): Point[] {
  // Últimos 12 meses, mock estable
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

  // Podés ajustar para que tenga “forma” más real
  const values = [4, 6, 3, 8, 10, 7, 9, 12, 11, 14, 13, 16];

  // Tomo desde el mes actual hacia atrás, 12 puntos
  const now = new Date();
  const res: Point[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    res.push({
      label: months[d.getMonth()],
      sales: values[(d.getMonth() + d.getFullYear()) % values.length] + (i % 3),
    });
  }
  return res;
}

function mockWeeklyData(): Point[] {
  // Últimas 12 semanas
  // Etiquetas W1..W12 (o podés poner “Sem 1”, etc.)
  const base = [2, 3, 5, 4, 6, 7, 5, 8, 6, 9, 7, 10];
  return Array.from({ length: 12 }, (_, idx) => ({
    label: `W${idx + 1}`,
    sales: base[idx],
  }));
}

const chartConfig = {
  sales: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
} as const;

export function SalesCountChart() {
  const [mode, setMode] = React.useState<"month" | "week">("month");

  const data = React.useMemo(() => {
    return mode === "month" ? mockMonthlyData() : mockWeeklyData();
  }, [mode]);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Ventas</CardTitle>

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
          <BarChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis tickLine={false} axisLine={false} width={28} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="sales"
              radius={6}
              fill="var(--var-gold)"
              barSize={60}
            />
          </BarChart>
        </ChartContainer>

        <div className="mt-3 text-sm text-muted-foreground">
          Los datos no son reales.
        </div>
      </CardContent>
    </Card>
  );
}
