import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code || code.length > 20) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid short code" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("urls")
    .select("original_url, expires_at")
    .eq("short_code", code)
    .maybeSingle();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: "Short URL not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return new Response(
      JSON.stringify({ error: "This short URL has expired" }),
      { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Increment clicks and log
  await supabase.rpc("increment_clicks", { code });

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: data.original_url,
    },
  });
});
