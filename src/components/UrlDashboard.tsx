import { useEffect, useState } from "react";
import { BarChart3, ExternalLink, MousePointerClick, Calendar, RefreshCw, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";
import ClickChart from "./ClickChart";
import { format } from "date-fns";

type Url = Tables<"urls">;

interface UrlDashboardProps {
  refreshKey: number;
}

export default function UrlDashboard({ refreshKey }: UrlDashboardProps) {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrlId, setSelectedUrlId] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const baseRedirectUrl = `${supabaseUrl}/functions/v1/redirect`;

  const fetchUrls = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setUrls(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUrls();
  }, [refreshKey]);

  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

  const isExpired = (url: Url) => url.expires_at && new Date(url.expires_at) < new Date();

  return (
    <div className="w-full font-body">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <StatCard 
          icon={<BarChart3 className="h-8 w-8 text-primary" />} 
          label="Shortened Assets" 
          value={urls.length.toString()} 
          description="Stored in your digital archive"
        />
        <StatCard 
          icon={<MousePointerClick className="h-8 w-8 text-primary" />} 
          label="Archival Engagement" 
          value={totalClicks.toLocaleString()} 
          description="Total interactions tracked"
        />
      </div>

      {selectedUrlId && (
        <div className="mb-20 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex items-center gap-6">
              <div className="w-[3px] h-12 bg-primary rounded-full shadow-[0_0_20px_rgba(255,137,171,0.5)]" />
              <h4 className="text-4xl font-black text-foreground font-display uppercase tracking-tighter">
                Asset <span className="text-primary italic">Intelligence</span>
              </h4>
            </div>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-primary transition-all" onClick={() => setSelectedUrlId(null)}>Terminate Analysis</Button>
          </div>
          <div className="glass-card p-10 rounded-[3rem] shadow-primary/5">
            <ClickChart urlId={selectedUrlId} />
          </div>
        </div>
      )}

      {loading && urls.length === 0 ? (
        <div className="text-center py-32 glass-card rounded-[3rem]">
          <RefreshCw className="h-12 w-12 animate-spin text-primary/40 mx-auto mb-6" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">Synchronizing Archive...</p>
        </div>
      ) : urls.length === 0 ? (
        <div className="text-center py-32 glass-card rounded-[3rem] border-dashed border-white/5 bg-transparent">
          <div className="p-6 rounded-full bg-primary/5 w-fit mx-auto mb-8">
            <BarChart3 className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-3xl font-black text-foreground mb-4 font-display uppercase tracking-tighter">Archive is Empty</h3>
          <p className="text-muted-foreground/40 max-w-xs mx-auto mb-10 text-sm font-medium leading-relaxed">
            Generate your first asset link to begin curating your digital workspace.
          </p>
        </div>
      ) : (
        <div className="group/table overflow-hidden rounded-[3rem] glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/[0.03]">
                  <th className="text-left px-10 py-10 font-black text-muted-foreground/20 uppercase tracking-[0.3em] text-[9px]">Resource Path</th>
                  <th className="text-left px-10 py-10 font-black text-muted-foreground/20 uppercase tracking-[0.3em] text-[9px]">Proxy Key</th>
                  <th className="text-center px-10 py-10 font-black text-muted-foreground/20 uppercase tracking-[0.3em] text-[9px]">Engagement</th>
                  <th className="text-left px-10 py-10 font-black text-muted-foreground/20 uppercase tracking-[0.3em] text-[9px]">Status</th>
                  <th className="text-right px-10 py-10 font-black text-muted-foreground/20 uppercase tracking-[0.3em] text-[9px]">Entry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {urls.map((u) => (
                  <tr
                    key={u.id}
                    className={`group transition-all duration-500 cursor-pointer ${selectedUrlId === u.id ? 'bg-primary/10' : 'hover:bg-white/[0.02]'}`}
                    onClick={() => setSelectedUrlId(u.id === selectedUrlId ? null : u.id)}
                  >
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2 max-w-[280px]">
                        <div className="flex items-center gap-3 text-foreground font-bold text-base group-hover:text-primary transition-all duration-500">
                          <ExternalLink className="h-4 w-4 shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
                          <span className="truncate tracking-tighter uppercase">{u.original_url.split('/')[2] || 'Resource'}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/30 truncate font-medium uppercase tracking-wider">{u.original_url}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white/[0.03] text-primary font-black text-[10px] tracking-widest uppercase border border-white/[0.05] group-hover:bg-primary/20 transition-all duration-500">
                        {u.short_code}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-3xl font-black text-foreground tracking-tighter tabular-nums group-hover:scale-110 transition-transform duration-500">
                          {u.clicks}
                        </span>
                        <span className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest mt-1">Impressions</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {isExpired(u) ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-[9px] font-black uppercase tracking-widest border border-destructive/20">
                          <AlertTriangle className="h-3 w-3" /> Offline
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live Asset
                        </span>
                      )}
                    </td>
                    <td className="px-10 py-8 text-right whitespace-nowrap">
                      <span className="text-muted-foreground/30 font-black text-[10px] uppercase tracking-tighter tabular-nums">
                        {format(new Date(u.created_at), "dd.MM.yy")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, description }: { icon: React.ReactNode; label: string; value: string; description: string }) {
  return (
    <div className="glass-card p-12 rounded-[4rem] flex flex-col gap-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-700">
      <div className="absolute -top-10 -right-10 p-20 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 rotate-12 group-hover:rotate-0 group-hover:scale-125">
        {icon}
      </div>
      <div className="p-5 rounded-3xl bg-primary/10 w-fit ring-1 ring-primary/30 group-hover:shadow-[0_0_40px_-10px_rgba(255,137,171,0.5)] transition-all duration-700">
        {icon}
      </div>
      <div>
        <p className="text-7xl font-black text-foreground tracking-tightest mb-4 font-display leading-none">{value}</p>
        <div className="flex flex-col gap-2">
          <span className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/60">{label}</span>
          <span className="text-xs text-muted-foreground/30 font-medium tracking-tight h-4 opacity-0 group-hover:opacity-100 transition-all duration-700">{description}</span>
        </div>
      </div>
    </div>
  );
}
