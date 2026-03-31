import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Scissors, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24 font-body">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
        <div className="text-center mb-16">
          <div className="inline-flex flex-col items-center gap-6 mb-8">
            <div className="p-5 rounded-3xl bg-primary/20 ring-1 ring-primary/40 shadow-[0_0_60px_-15px_rgba(255,137,171,0.5)] animate-pulse">
              <Scissors className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-6xl font-extrabold tracking-tighter text-foreground font-display">
              SNIP<span className="text-primary italic">LINK</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground/60 font-medium tracking-tight max-w-sm mx-auto leading-relaxed">
            {isLogin ? "Enter the obsidian suite to manage your digital assets." : "Join the elite circle of digital architects."}
          </p>
        </div>

        <div className="glass-card p-12 rounded-[3.5rem]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="space-y-4">
                <Label htmlFor="displayName" className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-4">Architect Name</Label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-500" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your profile name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="glass-input pl-14 h-16 rounded-[1.5rem] text-lg"
                    required={!isLogin}
                    maxLength={100}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Label htmlFor="email" className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-4">Identity (Email)</Label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@sniplink.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-14 h-16 rounded-[1.5rem] text-lg"
                  required
                  maxLength={255}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="password" className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-4">Access Key (Password)</Label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-all duration-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-14 pr-14 h-16 rounded-[1.5rem] text-lg"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="aesthetic-button w-full bg-primary text-primary-foreground mt-6"
            >
              {loading ? "Authenticating..." : isLogin ? "Secure Entry" : "Register Profile"}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-[0.3em] hover:tracking-[0.4em]"
            >
              {isLogin ? "Need Access? Request Invite" : "Registered? Identify Here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
