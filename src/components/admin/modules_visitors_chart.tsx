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
  { type: "tourism", visitors: 300, fill: "var(--color-tourism)" },
  { type: "student", visitors: 305, fill: "var(--color-student)" },
  { type: "jobs", visitors: 50, fill: "var(--color-jobs)" },
  { type: "businesses", visitors: 173, fill: "var(--color-businesses)" },
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

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.type === activeType),
    [activeType]
  );
  const types = React.useMemo(() => data.map((item) => item.type), []);

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Visitors Per Module</CardTitle>
          <CardDescription>
            Shows visitor numbers across platform modules this month.
          </CardDescription>
        </div>
        <Select value={activeType} onValueChange={setActiveType}>
          <SelectTrigger
            className="ml-auto h-7 w-fit min-w-[130px] rounded-lg pl-2.5"
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
              data={data}
              dataKey="visitors" // Changed from "data" to "visitors"
              nameKey="type" // This was correct already
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
                          {data[activeIndex].visitors.toLocaleString()}
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
