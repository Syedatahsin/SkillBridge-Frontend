"use client";

import React, { useEffect, useState } from "react";
import { Loader2, DollarSign, CheckCircle2, Clock, XCircle } from "lucide-react";

interface RevenueData {
  totalEarnings: number;
  bookings: any[];
}

interface TeacherRevenueCardProps {
  tutorId: string;
}

export default function TeacherRevenueCard({ tutorId }: TeacherRevenueCardProps) {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/tutorbookings?userId=${tutorId}`
        );
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch revenue:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) fetchRevenue();
  }, [tutorId]);

  if (loading) {
    return (
      <div className="h-[140px] w-full flex items-center justify-center bg-card rounded-[2.5rem] border border-border/50 transition-colors duration-300">
        <Loader2 className="animate-spin text-emerald-500" size={28} />
      </div>
    );
  }

  const bookings = data?.bookings ?? [];
  const totalEarnings = data?.totalEarnings ?? 0;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      large: true,
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: CheckCircle2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Completed",
      value: completed,
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`
              relative overflow-hidden p-6 rounded-[2rem] border backdrop-blur-md
              bg-card/40 ${stat.border}
              flex flex-col justify-between gap-4
              transition-all hover:scale-[1.02] hover:shadow-2xl
              ${stat.large ? "md:col-span-1" : ""}
            `}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <Icon className={`${stat.color}`} size={18} />
            </div>

            {/* Value */}
            <div>
              <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>

            {/* Decorative glow */}
            <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 ${stat.bg}`} />
          </div>
        );
      })}
    </div>
  );
}
