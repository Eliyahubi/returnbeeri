-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'single' CHECK (type IN ('single', 'multi')),
  chart_type TEXT NOT NULL DEFAULT 'pie' CHECK (chart_type IN ('pie', 'bar')),
  options TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create survey_responses table
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create response_answers table (junction table for responses and their answers)
CREATE TABLE public.response_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID NOT NULL REFERENCES public.survey_responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_options TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.response_answers ENABLE ROW LEVEL SECURITY;

-- Questions policies (publicly readable, admin can modify - for now all public since no auth)
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions FOR SELECT 
USING (true);

CREATE POLICY "Questions can be inserted by everyone" 
ON public.questions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Questions can be updated by everyone" 
ON public.questions FOR UPDATE 
USING (true);

CREATE POLICY "Questions can be deleted by everyone" 
ON public.questions FOR DELETE 
USING (true);

-- Survey responses policies (public for anonymous surveys)
CREATE POLICY "Survey responses are viewable by everyone" 
ON public.survey_responses FOR SELECT 
USING (true);

CREATE POLICY "Survey responses can be inserted by everyone" 
ON public.survey_responses FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Survey responses can be deleted by everyone" 
ON public.survey_responses FOR DELETE 
USING (true);

-- Response answers policies
CREATE POLICY "Response answers are viewable by everyone" 
ON public.response_answers FOR SELECT 
USING (true);

CREATE POLICY "Response answers can be inserted by everyone" 
ON public.response_answers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Response answers can be deleted by everyone" 
ON public.response_answers FOR DELETE 
USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.survey_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.response_answers;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for questions table
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();