
ALTER TABLE public.performance_reports 
  ADD COLUMN IF NOT EXISTS response_structure_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS conversation_flow_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS better_responses JSONB NOT NULL DEFAULT '[]'::jsonb;
