
-- Practice sessions table
CREATE TABLE public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_type TEXT NOT NULL,
  scenario_title TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  avatar_name TEXT NOT NULL,
  avatar_personality TEXT NOT NULL,
  transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance reports table
CREATE TABLE public.performance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.practice_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER NOT NULL DEFAULT 0,
  clarity_score INTEGER NOT NULL DEFAULT 0,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  answer_quality_score INTEGER NOT NULL DEFAULT 0,
  filler_words_score INTEGER NOT NULL DEFAULT 0,
  filler_words_count INTEGER NOT NULL DEFAULT 0,
  overall_feedback TEXT NOT NULL DEFAULT '',
  detailed_feedback JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for practice_sessions
CREATE POLICY "Users can view own sessions" ON public.practice_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.practice_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.practice_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for performance_reports
CREATE POLICY "Users can view own reports" ON public.performance_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reports" ON public.performance_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
