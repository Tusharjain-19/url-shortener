import { useState } from "react";
import { Link, Copy, Check, Loader2, Calendar as CalendarIcon, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidSlug(str: string): boolean {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(str);
}

interface UrlShortenerFormProps {
  onUrlCreated: () => void;
}

export default function UrlShortenerForm({ onUrlCreated }: UrlShortenerFormProps) {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const baseRedirectUrl = `${supabaseUrl}/functions/v1/redirect`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    const slug = customSlug.trim();

    if (!trimmed) {
      toast.error("Please enter a URL");
      return;
    }
    if (!isValidUrl(trimmed)) {
      toast.error("Please enter a valid URL (starting with http:// or https://)");
      return;
    }
    if (slug && !isValidSlug(slug)) {
      toast.error("Custom slug must be 3-20 characters (letters, numbers, hyphens, underscores)");
      return;
    }

    setLoading(true);
    try {
      let shortCode = slug || generateShortCode();

      if (slug) {
        // Check if custom slug is taken
        const { data } = await supabase.from("urls").select("id").eq("short_code", slug).maybeSingle();
        if (data) {
          toast.error("This custom slug is already taken. Try another one.");
          setLoading(false);
          return;
        }
      } else {
        // Ensure random code uniqueness
        let exists = true;
        while (exists) {
          const { data } = await supabase.from("urls").select("id").eq("short_code", shortCode).maybeSingle();
          if (!data) exists = false;
          else shortCode = generateShortCode();
        }
      }

      const { error } = await supabase.from("urls").insert({
        original_url: trimmed,
        short_code: shortCode,
        user_id: user!.id,
        expires_at: expiryDate ? expiryDate.toISOString() : null,
      });

      if (error) throw error;

      const generated = `${baseRedirectUrl}?code=${shortCode}`;
      setShortUrl(generated);
      setUrl("");
      setCustomSlug("");
      setExpiryDate(undefined);
      toast.success("Short URL created!");
      onUrlCreated();
    } catch (err: any) {
      toast.error(err.message || "Failed to create short URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full font-body">
      <form onSubmit={handleSubmit} className="relative z-10 transition-all duration-700">
        <div className="flex flex-col gap-8">
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 group-focus-within:text-primary group-focus-within:scale-110">
              <Link className="h-6 w-6 text-muted-foreground/30" />
            </div>
            <Input
              type="text"
              placeholder="Enter your destination URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="glass-input pl-16 h-20 rounded-[2rem] text-xl font-medium tracking-tight shadow-[0_10px_40px_-20px_rgba(255,137,171,0.2)]"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-primary transition-all flex items-center gap-3 group px-4"
            >
              <Wand2 className="h-4 w-4 transition-transform group-hover:rotate-45" />
              {showAdvanced ? "Hide" : "Advanced"} Parameters
            </button>

            <Button
              type="submit"
              disabled={loading}
              className="aesthetic-button w-full sm:w-auto bg-primary text-primary-foreground min-w-[220px]"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "GENERATE ARCHIVE"}
            </Button>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground/40 ml-4">Custom Slug Path</Label>
              <Input
                type="text"
                placeholder="my-personal-archive"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                maxLength={20}
                className="glass-input h-14 rounded-2xl text-base px-6"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground/40 ml-4">Archival Expiry</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="glass-input w-full h-14 justify-start rounded-2xl font-medium border-white/5 px-6">
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                    {expiryDate ? format(expiryDate, "PPP") : <span className="text-muted-foreground/40">Select date...</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-white/10 bg-background/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-6"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </form>

      {shortUrl && (
        <div className="mt-16 p-10 rounded-[3rem] bg-primary/5 border border-primary/20 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="text-center space-y-4 w-full">
            <p className="text-[10px] font-black uppercase tracking-[.4em] text-primary/60">Archive Ready</p>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-foreground font-display break-all hover:text-primary transition-colors cursor-pointer" onClick={handleCopy}>
              {shortUrl.replace('https://', '')}
            </h3>
          </div>
          
          <Button 
            onClick={handleCopy} 
            className="aesthetic-button bg-primary/10 hover:bg-primary text-primary transition-all duration-700 group hover:text-primary-foreground min-w-[240px]"
          >
            {copied ? (
              <><Check className="h-5 w-5 mr-3" /> ARCHIVE COPIED</>
            ) : (
              <><Copy className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" /> COPY ASSET LINK</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
