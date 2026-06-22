"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Users, CheckCircle, Clock, FolderKanban, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardClientProps {
  stats: {
    totalLeads: number;
    completedLeads: number;
    pendingQuotes: number;
    totalProjects: number;
    conversionRate: number;
  };
  serviceData: any[];
  cityData: any[];
  monthlyData: any[];
}

// Custom luxury theme colors for Pie charts
const COLORS = ["#1e40af", "#d4af37", "#10b981", "#64748b"];

export default function DashboardClient({
  stats,
  serviceData,
  cityData,
  monthlyData,
}: DashboardClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cardStats = [
    {
      title: "Total Inquiry Leads",
      value: stats.totalLeads,
      icon: <Users className="w-5 h-5 text-accent" />,
      desc: "Cumulative user submissions",
    },
    {
      title: "Inquiries Completed",
      value: stats.completedLeads,
      icon: <CheckCircle className="w-5 h-5 text-accent" />,
      desc: "Delivered & resolved works",
    },
    {
      title: "Pending Quotes",
      value: stats.pendingQuotes,
      icon: <Clock className="w-5 h-5 text-accent" />,
      desc: "New or active negotiations",
    },
    {
      title: "Completed Projects",
      value: stats.totalProjects,
      icon: <FolderKanban className="w-5 h-5 text-accent" />,
      desc: "Live portfolio case studies",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 text-accent mr-2" /> CRM Analytics Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time insights on sales funnel, lead velocity, and service metrics.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-slate-300">
            Funnel Conversion Rate: <strong className="text-white text-sm">{stats.conversionRate}%</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cardStats.map((card, idx) => (
          <Card key={idx} className="bg-slate-900 border-slate-800 shadow-lg rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {card.title}
              </CardTitle>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {card.value}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Trend (Line Chart) */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-white">Monthly Lead Inflow</h3>
            <p className="text-xs text-slate-400">Leads generated per calendar month</p>
          </div>
          <div className="h-[280px] w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc", borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#1e40af" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-950/20 rounded-xl animate-pulse"></div>
            )}
          </div>
        </Card>

        {/* Leads by Service (Pie Chart) */}
        <Card className="bg-slate-900 border-slate-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-white">Service Distribution</h3>
            <p className="text-xs text-slate-400">Proportion of service requests</p>
          </div>
          <div className="h-[220px] w-full relative">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-950/20 rounded-xl animate-pulse"></div>
            )}
          </div>
          {/* Custom legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs pt-4 border-t border-slate-800/80">
            {serviceData && serviceData.length > 0 ? (
              serviceData.map((d, index) => (
                <div key={d.name} className="flex items-center space-x-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="text-slate-400 font-medium">
                    {d.name}: <strong className="text-white">{d.value}</strong>
                  </span>
                </div>
              ))
            ) : (
              <span className="text-slate-500 font-medium">No service inquiries registered yet.</span>
            )}
          </div>
        </Card>
      </div>

      {/* Leads by City (Bar Chart) */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="bg-slate-900 border-slate-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-white">Inquiries by City</h3>
            <p className="text-xs text-slate-400">Total volume grouped by geographic sector</p>
          </div>
          <div className="h-[280px] w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc", borderRadius: 8 }}
                  />
                  <Bar dataKey="value" fill="#d4af37" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-950/20 rounded-xl animate-pulse"></div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
