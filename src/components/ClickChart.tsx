import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { LayoutGrid, TrendingUp, PieChart as PieIcon, BarChart as BarIcon } from "lucide-react";

interface ClickChartProps {
  urlId: string;
}

interface DayData {
  date: string;
  clicks: number;
  fullTimestamp?: string;
}

export default function ClickChart({ urlId }: ClickChartProps) {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<"area" | "line" | "pie" | "bar">("area");
  const [days, setDays] = useState<number | "24h">(7);

  const COLORS = ["#ff89ab", "#ff6b9a", "#ff4d89", "#ff2f78", "#ff1167", "#e30056", "#c50047"];

  useEffect(() => {
    const fetchClicks = async () => {
      setLoading(true);
      const { data: logs, error } = await supabase
        .from("click_logs")
        .select("clicked_at")
        .eq("url_id", urlId)
        .order("clicked_at", { ascending: true });

      if (error || !logs) {
        setLoading(false);
        return;
      }

      const result: DayData[] = [];

      if (days === "24h") {
        // Group by Hour for the last 24 hours
        const hourCounts: Record<number, number> = {};
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        logs.forEach((log) => {
          const logDate = new Date(log.clicked_at);
          if (logDate >= twentyFourHoursAgo) {
            const hour = logDate.getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
          }
        });

        for (let i = 23; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 60 * 60 * 1000);
          const hour = d.getHours();
          result.push({ 
            date: `${hour}:00`, 
            clicks: hourCounts[hour] || 0,
            fullTimestamp: d.toLocaleString()
          });
        }
      } else {
        // Group by day for the selected range
        const dayCounts: Record<string, number> = {};
        logs.forEach((log) => {
          const day = new Date(log.clicked_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          result.push({ date: key, clicks: dayCounts[key] || 0 });
        }
      }

      setData(result);
      setLoading(false);
    };

    fetchClicks();
  }, [urlId, days]);

  if (loading) {
    return <div className="h-[350px] flex items-center justify-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">Calibrating Visuals...</div>;
  }

  if (data.every((d) => d.clicks === 0)) {
    return (
      <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground/40 text-sm font-medium italic rounded-[2rem] border border-white/5 bg-white/[0.01] gap-6">
        <div className="flex gap-2">
          {["24h", 7, 14, 30, 60].map((d) => (
            <button key={d} onClick={() => setDays(d as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${days === d ? 'text-primary bg-primary/10' : 'text-muted-foreground/40'}`}>
              {d === "24h" ? "Pulse" : `Last ${d}D`}
            </button>
          ))}
        </div>
        No archival engagement recorded yet.
      </div>
    );
  }

  const axisStyle = {
    fontSize: 13,
    fontWeight: 900,
    fill: "rgba(255,137,171,0.9)", // Massive visibility boost
    fontFamily: "Sora, sans-serif"
  };

  const tooltipStyle = {
    borderRadius: "1.5rem",
    border: "2px solid #ff89ab", // Visible border
    background: "rgba(14, 14, 15, 1)",
    backdropFilter: "blur(40px)",
    fontSize: "0.95rem",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    boxShadow: "0 20px 60px -15px rgba(255, 137, 171, 0.5)",
    padding: "16px"
  } as const;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-8 px-6">
        <div className="flex items-center gap-4">
          {[
            { id: "area", icon: <LayoutGrid className="h-6 w-6" /> },
            { id: "line", icon: <TrendingUp className="h-6 w-6" /> },
            { id: "bar", icon: <BarIcon className="h-6 w-6" /> },
            { id: "pie", icon: <PieIcon className="h-6 w-6" /> },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveChart(btn.id as any)}
              className={`p-4 rounded-2xl transition-all duration-500 border-2 ${
                activeChart === btn.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_30px_rgba(255,137,171,0.6)] scale-110" 
                  : "bg-white/[0.05] text-muted-foreground/60 border-white/10 hover:bg-white/[0.1] hover:text-primary"
              }`}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 p-3 rounded-[2.5rem] bg-white/[0.05] border-2 border-white/10">
          {["24h", 7, 14, 30, 60].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d as any)}
              className={`px-7 py-3 rounded-2xl text-[12px] font-black uppercase tracking-[0.25em] transition-all duration-500 border ${
                days === d 
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl" 
                  : "text-muted-foreground/50 border-transparent hover:text-primary hover:bg-white/[0.08]"
              }`}
            >
              {d === "24h" ? "Pulse" : `${d}D`}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[450px] w-full px-6 animate-in fade-in duration-1000">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === "area" ? (
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff89ab" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ff89ab" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,137,171,0.15)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} dy={20} hide={typeof days === 'number' && days > 40} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={axisStyle} dx={-20} />
              <Tooltip labelFormatter={(label) => `Timestamp: ${label}`} contentStyle={tooltipStyle} itemStyle={{ color: "#ff89ab" }} />
              <Area type="monotone" dataKey="clicks" stroke="#ff89ab" strokeWidth={6} fill="url(#clickGradient)" animationDuration={2000} />
            </AreaChart>
          ) : activeChart === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,137,171,0.15)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} dy={20} hide={typeof days === 'number' && days > 40} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={axisStyle} dx={-20} />
              <Tooltip labelFormatter={(label) => `Timestamp: ${label}`} contentStyle={tooltipStyle} itemStyle={{ color: "#ff89ab" }} />
              <Line type="stepAfter" dataKey="clicks" stroke="#ff89ab" strokeWidth={6} dot={{ r: typeof days === 'number' && days > 14 ? 0 : 6, fill: "#ff89ab", strokeWidth: 0 }} activeDot={{ r: 12, strokeWidth: 0, fill: "#ff89ab" }} animationDuration={2000} />
            </LineChart>
          ) : activeChart === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,137,171,0.15)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisStyle} dy={20} hide={typeof days === 'number' && days > 40} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={axisStyle} dx={-20} />
              <Tooltip cursor={{ fill: 'rgba(255,137,171,0.15)' }} contentStyle={tooltipStyle} itemStyle={{ color: "#ff89ab" }} />
              <Bar dataKey="clicks" radius={[12, 12, 0, 0]} animationDuration={2000}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data.filter(d => d.clicks > 0)}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={150}
                paddingAngle={6}
                dataKey="clicks"
                animationDuration={2000}
              >
                {data.filter(d => d.clicks > 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend 
                verticalAlign="bottom" 
                height={60} 
                iconType="circle" 
                wrapperStyle={{ 
                  fontSize: '14px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.25em', 
                  paddingTop: '40px',
                  color: '#ff89ab' 
                }} 
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
