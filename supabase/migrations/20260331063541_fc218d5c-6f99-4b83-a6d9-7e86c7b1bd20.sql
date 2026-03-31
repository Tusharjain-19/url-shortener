
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add user_id and expires_at to urls
ALTER TABLE public.urls ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.urls ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;

-- Update RLS: only authenticated users can create, users see own links
DROP POLICY "Anyone can create urls" ON public.urls;
DROP POLICY "Anyone can read urls" ON public.urls;

CREATE POLICY "Authenticated users can create urls" ON public.urls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own urls" ON public.urls FOR SELECT USING (auth.uid() = user_id);

-- Create click_logs table for analytics
CREATE TABLE public.click_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID REFERENCES public.urls(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.click_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own click logs" ON public.click_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.urls WHERE urls.id = click_logs.url_id AND urls.user_id = auth.uid())
  );

CREATE INDEX idx_click_logs_url_id ON public.click_logs (url_id);
CREATE INDEX idx_click_logs_clicked_at ON public.click_logs (clicked_at);

-- Update increment_clicks to also log clicks
CREATE OR REPLACE FUNCTION public.increment_clicks(code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  url_id_val UUID;
BEGIN
  SELECT id INTO url_id_val FROM public.urls WHERE short_code = code;
  IF url_id_val IS NOT NULL THEN
    UPDATE public.urls SET clicks = clicks + 1 WHERE short_code = code;
    INSERT INTO public.click_logs (url_id) VALUES (url_id_val);
  END IF;
END;
$$;
