"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

interface ChartDataPoint {
  date: string;
  count: number;
}

interface OverviewProps {
  userId: string;
  role: "STUDENT" | "TUTOR";
}

const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Transform full booking objects → { date: "Mon", count: N } grouped by day
function transformToChartData(bookings: any[]): ChartDataPoint[] {
  const counts: Record<string, number> = {};

  for (const booking of bookings) {
    const startTime = booking.availability?.startTime;
    if (!startTime) continue;
    const day = DAY_ORDER[new Date(startTime).getDay()];
    counts[day] = (counts[day] || 0) + 1;
  }

  return DAY_ORDER
    .filter((day) => counts[day])
    .map((day) => ({ date: day, count: counts[day] }));
}

export default function DashboardOverview({ userId, role }: OverviewProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/overview/${userId}`
        );
        const result = await response.json();

        // Backend returns: { success, totalSessions, bookings: [...] }
        const bookings = Array.isArray(result.bookings) ? result.bookings : [];
        setTotalSessions(result.totalSessions ?? bookings.length);
        setData(transformToChartData(bookings));
      } catch (error) {
        console.error("Failed to fetch overview:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOverview();
    else setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center bg-card rounded-[2.5rem] border border-border/50 transition-colors duration-300">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  const chartColor = role === "TUTOR" ? "#10b981" : "#a855f7";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="w-full bg-card/40 backdrop-blur-md border border-border/10 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl transition-colors duration-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
            Session Activity
          </h3>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
            {role === "TUTOR" ? "Classes Conducted" : "Learning Progress"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className={`text-2xl font-black ${role === "TUTOR" ? "text-emerald-400" : "text-purple-400"}`}>
              {totalSessions}
            </p>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              Total
            </p>
          </div>
          <div className="p-3 bg-muted/20 rounded-2xl border border-border/10">
            <TrendingUp
              className={role === "TUTOR" ? "text-emerald-500" : "text-purple-500"}
              size={20}
            />
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-[250px] w-full flex flex-col items-center justify-center gap-3">
          <TrendingUp className="text-muted-foreground/40" size={40} />
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
            No session data yet
          </p>
        </div>
      ) : (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`colorCount-${role}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12, fontWeight: "bold" }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                itemStyle={{ color: chartColor }}
                cursor={{ stroke: "#3f3f46", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={chartColor}
                strokeWidth={4}
                fillOpacity={1}
                fill={`url(#colorCount-${role})`}
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
