"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  // March
  { type: "tourism", visitors: 300, fill: "var(--color-tourism)", month: "2024-10" },
  { type: "student", visitors: 305, fill: "var(--color-student)", month: "2024-10" },
  { type: "jobs", visitors: 50, fill: "var(--color-jobs)", month: "2024-10" },
  { type: "businesses", visitors: 173, fill: "var(--color-businesses)", month: "2024-10" },
  // February
  { type: "tourism", visitors: 170, fill: "var(--color-tourism)", month: "2024-11" },
  { type: "student", visitors: 484, fill: "var(--color-student)", month: "2024-11" },
  { type: "jobs", visitors: 99, fill: "var(--color-jobs)", month: "2024-11" },
  { type: "businesses", visitors: 150, fill: "var(--color-businesses)", month: "2024-11" },
  // January
  { type: "tourism", visitors: 100, fill: "var(--color-tourism)", month: "2024-12" },
  { type: "student", visitors: 150, fill: "var(--color-student)", month: "2024-12" },
  { type: "jobs", visitors: 200, fill: "var(--color-jobs)", month: "2024-12" },
  { type: "businesses", visitors: 78, fill: "var(--color-businesses)", month: "2024-12" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  tourism: {
    label: "Tourism",
    color: "hsl(var(--chart-1))",
  },
  student: {
    label: "Student Resources",
    color: "hsl(var(--chart-2))",
  },
  jobs: {
    label: "Jobs",
    color: "hsl(var(--chart-3))",
  },
  businesses: {
    label: "Businesses",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function ModulesVisitorsChart() {
  const id = "pie-interactive";
  const [activeType, setActiveType] = React.useState(data[0].type);
  const [activeMonth, setActiveMonth] = React.useState("2024-12");

  const filteredData = React.useMemo(
    () => data.filter((item) => item.month === activeMonth),
    [activeMonth]
  );

  const activeIndex = React.useMemo(
    () => filteredData.findIndex((item) => item.type === activeType),
    [activeType, filteredData]
  );

  const types = React.useMemo(
    () => [...new Set(data.map((item) => item.type))],
    []
  );

  const months = React.useMemo(
    () => [...new Set(data.map((item) => item.month))],
    []
  );

  return (
    <Card data-chart={id} className="flex flex-col h-full">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-col items-center sm:flex-row sm:items-start space-y-0 pb-0 gap-2">
        <div className="grid gap-1 text-center sm:text-left">
          <CardTitle>Visitors Per Module</CardTitle>
          <CardDescription>
            Shows visitor numbers across platform modules for a selected month.
          </CardDescription>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <Select value={activeMonth} onValueChange={setActiveMonth}>
            <SelectTrigger
              className="h-7 w-fit min-w-[130px] rounded-lg pl-2.5"
              aria-label="Select month"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {new Date(month).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeType} onValueChange={setActiveType}>
            <SelectTrigger
              className="h-7 w-fit min-w-[130px] rounded-lg pl-2.5"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {types.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];

                if (!config) {
                  return null;
                }

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={filteredData}
              dataKey="visitors"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {filteredData[activeIndex]?.visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
