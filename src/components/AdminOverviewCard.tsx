"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { Loader2, TrendingUp, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RoleCount {
  students: number;
  teachers: number;
  admins: number;
}

export default function AdminPieOverview() {
  const [counts, setCounts] = useState<RoleCount>({ students: 0, teachers: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/count`);
        const result = await res.json();

        if (result.success) {
          setCounts({
            students: result.student || 0,
            teachers: result.teacher || 0,
            admins: result.admin || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [process.env.NEXT_PUBLIC_BACKEND_URL]);

  const chartData = [
    { name: "Students", value: counts.students, color: "#a855f7" }, // Purple
    { name: "Teachers", value: counts.teachers, color: "#10b981" }, // Emerald
    { name: "Admins", value: counts.admins, color: "#facc15" },    // Yellow
  ];

  const totalUsers = counts.students + counts.teachers + counts.admins;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-xl border border-border/10 p-8 rounded-[3rem] shadow-2xl transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">
            User <span className="text-purple-500">Distribution</span>
          </h2>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">
            Real-time platform share
          </p>
        </div>
        <div className="p-3 bg-muted/20 rounded-2xl border border-border/10">
          <Users className="text-purple-500" size={20} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* CHART SECTION */}
        <div className="relative h-[300px] w-full md:w-1/2">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip defaultIndex={0} content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* CENTER TEXT */}
          {!loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-foreground">{totalUsers}</span>
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Users</span>
            </div>
          )}
        </div>

        {/* LEGEND SECTION */}
        <div className="w-full md:w-1/2 space-y-4">
          {chartData.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/5 group hover:border-border/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
              </div>
              <span className="font-black text-foreground">
                {totalUsers > 0 ? ((item.value / totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// STYLISH HOVER EFFECT
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 10px ${fill}44)` }}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border/10 p-3 rounded-xl shadow-2xl">
        <p className="text-xs font-black uppercase text-popover-foreground tracking-widest">
          {payload[0].name}: <span style={{ color: payload[0].payload.color }}>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};