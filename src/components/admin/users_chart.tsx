"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
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

const chartData = [
  { date: "2024-10-01", users: 222 },
  { date: "2024-10-02", users: 97 },
  { date: "2024-10-03", users: 167 },
  { date: "2024-10-04", users: 242 },
  { date: "2024-10-05", users: 373 },
  { date: "2024-10-06", users: 301 },
  { date: "2024-10-07", users: 245 },
  { date: "2024-10-08", users: 409 },
  { date: "2024-10-09", users: 59 },
  { date: "2024-10-10", users: 261 },
  { date: "2024-10-11", users: 327 },
  { date: "2024-10-12", users: 292 },
  { date: "2024-10-13", users: 342 },
  { date: "2024-10-14", users: 137 },
  { date: "2024-10-15", users: 120 },
  { date: "2024-10-16", users: 138 },
  { date: "2024-10-17", users: 446 },
  { date: "2024-10-18", users: 364 },
  { date: "2024-10-19", users: 243 },
  { date: "2024-10-20", users: 89 },
  { date: "2024-10-21", users: 137 },
  { date: "2024-10-22", users: 224 },
  { date: "2024-10-23", users: 138 },
  { date: "2024-10-24", users: 387 },
  { date: "2024-10-25", users: 215 },
  { date: "2024-10-26", users: 75 },
  { date: "2024-10-27", users: 383 },
  { date: "2024-10-28", users: 122 },
  { date: "2024-10-29", users: 315 },
  { date: "2024-10-30", users: 454 },
  { date: "2024-10-31", users: 165 },
  { date: "2024-11-01", users: 293 },
  { date: "2024-11-02", users: 247 },
  { date: "2024-11-03", users: 385 },
  { date: "2024-11-04", users: 481 },
  { date: "2024-11-05", users: 498 },
  { date: "2024-11-06", users: 388 },
  { date: "2024-11-07", users: 149 },
  { date: "2024-11-08", users: 227 },
  { date: "2024-11-09", users: 293 },
  { date: "2024-11-10", users: 335 },
  { date: "2024-11-11", users: 197 },
  { date: "2024-11-12", users: 197 },
  { date: "2024-11-13", users: 448 },
  { date: "2024-11-14", users: 473 },
  { date: "2024-11-15", users: 338 },
  { date: "2024-11-16", users: 499 },
  { date: "2024-11-17", users: 315 },
  { date: "2024-11-18", users: 235 },
  { date: "2024-11-19", users: 177 },
  { date: "2024-11-20", users: 82 },
  { date: "2024-11-21", users: 81 },
  { date: "2024-11-22", users: 252 },
  { date: "2024-11-23", users: 294 },
  { date: "2024-11-24", users: 201 },
  { date: "2024-11-25", users: 213 },
  { date: "2024-11-26", users: 420 },
  { date: "2024-11-27", users: 233 },
  { date: "2024-11-28", users: 78 },
  { date: "2024-11-29", users: 340 },
  { date: "2024-11-30", users: 178 },
  { date: "2024-12-01", users: 178 },
  { date: "2024-12-02", users: 470 },
  { date: "2024-12-03", users: 103 },
  { date: "2024-12-04", users: 439 },
  { date: "2024-12-05", users: 88 },
  { date: "2024-12-06", users: 294 },
  { date: "2024-12-07", users: 323 },
  { date: "2024-12-08", users: 385 },
  { date: "2024-12-09", users: 438 },
  { date: "2024-12-10", users: 155 },
  { date: "2024-12-11", users: 92 },
  { date: "2024-12-12", users: 492 },
  { date: "2024-12-13", users: 81 },
  { date: "2024-12-14", users: 426 },
  { date: "2024-12-15", users: 307 },
  { date: "2024-12-16", users: 371 },
  { date: "2024-12-17", users: 475 },
  { date: "2024-12-18", users: 107 },
  { date: "2024-12-19", users: 341 },
  { date: "2024-12-20", users: 408 },
  { date: "2024-12-21", users: 169 },
  { date: "2024-12-22", users: 317 },
  { date: "2024-12-23", users: 480 },
];

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function UsersChart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const calculateTrend = React.useMemo(() => {
    const today = new Date(Math.max(...chartData.map(item => new Date(item.date).getTime())));
    const currentMonth = today.getMonth();
    
    // Get current month's data
    const currentMonthData = chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === currentMonth;
    });

    // Get previous month's data
    const previousMonthData = chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === (currentMonth - 1);
    });

    // Calculate averages
    const currentAvg = currentMonthData.reduce((acc, curr) => acc + curr.users, 0) / currentMonthData.length;
    const previousAvg = previousMonthData.reduce((acc, curr) => acc + curr.users, 0) / previousMonthData.length;

    // Calculate percentage change
    const percentageChange = ((currentAvg - previousAvg) / previousAvg) * 100;

    return {
      percentage: percentageChange.toFixed(1),
      trending: percentageChange > 0 ? "up" : "down"
    };
  }, []);

  const filteredData = React.useMemo(() => {
    // Get the most recent date from the data
    const mostRecentDate = new Date(Math.max(...chartData.map(item => new Date(item.date).getTime())));
    
    return chartData.filter((item) => {
      const date = new Date(item.date);
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      
      const startDate = new Date(mostRecentDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Users Overview</CardTitle>
          <CardDescription>User registration trends over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="users"
              type="natural"
              fill="url(#fillUsers)"
              stroke="var(--color-users)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending {calculateTrend.trending} by {Math.abs(Number(calculateTrend.percentage))}% this month{" "}
              <TrendingUp 
                className={`h-4 w-4 ${calculateTrend.trending === "down" ? "rotate-180" : ""}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {timeRange === "90d" ? "Last 3 months" : 
               timeRange === "30d" ? "Last 30 days" : "Last 7 days"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
