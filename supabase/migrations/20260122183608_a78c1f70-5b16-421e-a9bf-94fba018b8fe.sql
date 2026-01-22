-- Create wifi_speed_tests table for user-verified speed tests
CREATE TABLE public.wifi_speed_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('coworking', 'hotel', 'cafe', 'other')),
  location_slug TEXT NOT NULL,
  location_name TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  download_speed NUMERIC NOT NULL CHECK (download_speed >= 0 AND download_speed <= 1000),
  upload_speed NUMERIC CHECK (upload_speed >= 0 AND upload_speed <= 1000),
  ping_ms NUMERIC CHECK (ping_ms >= 0 AND ping_ms <= 5000),
  is_stable BOOLEAN DEFAULT true,
  notes TEXT CHECK (char_length(notes) <= 500),
  tested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0
);

-- Create visa_applications table for tracking user visa applications
CREATE TABLE public.visa_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  visa_program_id TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'preparing', 'submitted', 'approved', 'rejected', 'expired')),
  application_date DATE,
  decision_date DATE,
  expiry_date DATE,
  notes TEXT CHECK (char_length(notes) <= 2000),
  documents_checklist JSONB DEFAULT '[]'::jsonb,
  reminders JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create speed test votes table to track user votes
CREATE TABLE public.speed_test_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  speed_test_id UUID NOT NULL REFERENCES public.wifi_speed_tests(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, speed_test_id)
);

-- Enable Row Level Security
ALTER TABLE public.wifi_speed_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speed_test_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wifi_speed_tests
CREATE POLICY "Anyone can view speed tests"
ON public.wifi_speed_tests
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert speed tests"
ON public.wifi_speed_tests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own speed tests"
ON public.wifi_speed_tests
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own speed tests"
ON public.wifi_speed_tests
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for visa_applications
CREATE POLICY "Users can view own visa applications"
ON public.visa_applications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visa applications"
ON public.visa_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visa applications"
ON public.visa_applications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own visa applications"
ON public.visa_applications
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for speed_test_votes
CREATE POLICY "Anyone can view votes"
ON public.speed_test_votes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert votes"
ON public.speed_test_votes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
ON public.speed_test_votes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
ON public.speed_test_votes
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_wifi_speed_tests_location ON public.wifi_speed_tests(location_type, location_slug);
CREATE INDEX idx_wifi_speed_tests_city ON public.wifi_speed_tests(city_slug);
CREATE INDEX idx_wifi_speed_tests_user ON public.wifi_speed_tests(user_id);
CREATE INDEX idx_visa_applications_user ON public.visa_applications(user_id);
CREATE INDEX idx_visa_applications_status ON public.visa_applications(status);
CREATE INDEX idx_speed_test_votes_test ON public.speed_test_votes(speed_test_id);

-- Add trigger for updating visa_applications updated_at
CREATE TRIGGER update_visa_applications_updated_at
BEFORE UPDATE ON public.visa_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();