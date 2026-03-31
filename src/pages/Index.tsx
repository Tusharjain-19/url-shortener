import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Scissors, LogOut, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import UrlDashboard from "@/components/UrlDashboard";
import { useTheme } from "next-themes";

export default function Index() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background font-body select-none transition-colors duration-700">
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-10 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto group cursor-pointer">
          <div className="p-3 rounded-2xl bg-primary/20 backdrop-blur-xl ring-1 ring-primary/30 group-hover:bg-primary/30 transition-all duration-500">
            <Scissors className="h-6 w-6 text-primary" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-foreground font-display">
            SNIP<span className="text-primary italic">LINK</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6 pointer-events-auto">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] hover:bg-primary/10 transition-all duration-500 group"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-primary group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="h-5 w-5 text-primary group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>
          )}

          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 hidden sm:block">
            Architect: {user?.email?.split('@')[0]}
          </span>
          <Button 
            variant="ghost" 
            className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all p-0 h-auto"
            onClick={() => supabase.auth.signOut()}
          >
            Logout session
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-52 pb-32">
        <section className="text-center mb-32 space-y-10 animate-in fade-in slide-in-from-top-12 duration-1000 ease-out">
          <h1 className="text-8xl md:text-9xl font-black tracking-tightest leading-[0.85] text-foreground font-display uppercase">
            CURATE <br />
            <span className="text-primary italic">YOUR</span> SPACE
          </h1>
          <p className="max-w-xl mx-auto text-xl md:text-2xl text-muted-foreground/50 font-medium tracking-tight leading-relaxed">
            Architect your digital presence with high-fidelity, aesthetic link management.
          </p>
        </section>

        <section className="mb-40 flex justify-center animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="w-full max-w-4xl glass-card p-12 rounded-[4rem]">
            <UrlShortenerForm onUrlCreated={() => setRefreshKey(prev => prev + 1)} />
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500" key={refreshKey}>
          <div className="flex items-center gap-4 mb-16 px-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground font-display">Your Archive</h2>
            <div className="h-[2px] flex-1 bg-white/[0.03] rounded-full" />
          </div>
          <UrlDashboard refreshKey={refreshKey} />
        </section>
      </main>

      <footer className="py-20 text-center">
        <a 
          href="https://tusharjain.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-black text-muted-foreground/20 uppercase tracking-[0.4em] hover:text-primary/60 transition-all cursor-pointer block"
        >
          &copy; 2026 SNIPLINK &mdash; Crafted by Tushar (tusharjain.in)
        </a>
      </footer>
    </div>
  );
}
