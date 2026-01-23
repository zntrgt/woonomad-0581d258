-- Price alerts table for tracking user preferences
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('flight', 'hotel')),
  origin_code TEXT,
  destination_code TEXT,
  city_slug TEXT,
  target_price NUMERIC,
  current_price NUMERIC,
  last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Price history for trend analysis
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_key TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'TRY',
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Price alerts policies
CREATE POLICY "Users can view their own alerts"
ON public.price_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
ON public.price_alerts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
ON public.price_alerts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
ON public.price_alerts FOR DELETE
USING (auth.uid() = user_id);

-- Price history is readable by all for trend analysis
CREATE POLICY "Price history is publicly readable"
ON public.price_history FOR SELECT
USING (true);

-- Only system can insert price history
CREATE POLICY "System can insert price history"
ON public.price_history FOR INSERT
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_price_alerts_user ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON public.price_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_price_history_route ON public.price_history(route_key);
CREATE INDEX idx_price_history_date ON public.price_history(checked_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_price_alerts_updated_at
BEFORE UPDATE ON public.price_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();