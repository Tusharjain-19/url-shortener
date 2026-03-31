
-- Create urls table for URL shortener
CREATE TABLE public.urls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read urls (needed for redirects)
CREATE POLICY "Anyone can read urls" ON public.urls FOR SELECT USING (true);

-- Allow anyone to insert urls (no auth required)
CREATE POLICY "Anyone can create urls" ON public.urls FOR INSERT WITH CHECK (true);

-- Allow anyone to update click count
CREATE POLICY "Anyone can update urls" ON public.urls FOR UPDATE USING (true);

-- Index for fast short_code lookups
CREATE INDEX idx_urls_short_code ON public.urls (short_code);
