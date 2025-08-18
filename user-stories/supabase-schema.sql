-- Supabase Schema for User Story Testing and Learning
-- Generated: 2025-08-18T04:04:41.427Z

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Table: user_stories
CREATE TABLE IF NOT EXISTS user_stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_role text NOT NULL,
  task text NOT NULL,
  business_value text NOT NULL,
  category text NOT NULL,
  complexity text NOT NULL,
  priority integer NOT NULL,
  estimated_time text,
  dependencies jsonb,
  acceptance_criteria jsonb,
  crew_feedback jsonb,
  validation_status text DEFAULT validated,
  validation_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_stories_category ON user_stories (category);
CREATE INDEX IF NOT EXISTS idx_user_stories_priority ON user_stories (priority);
CREATE INDEX IF NOT EXISTS idx_user_stories_complexity ON user_stories (complexity);

-- Table: test_executions
CREATE TABLE IF NOT EXISTS test_executions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id uuid REFERENCES user_stories.id,
  scenario_name text NOT NULL,
  status text NOT NULL,
  execution_time integer,
  expected_outcome text,
  actual_outcome text,
  error_details jsonb,
  executed_at timestamptz DEFAULT now(),
  crew_member text,
  feedback jsonb
);
CREATE INDEX IF NOT EXISTS idx_test_executions_story_id ON test_executions (story_id);
CREATE INDEX IF NOT EXISTS idx_test_executions_status ON test_executions (status);
CREATE INDEX IF NOT EXISTS idx_test_executions_executed_at ON test_executions (executed_at);

-- Table: learning_insights
CREATE TABLE IF NOT EXISTS learning_insights (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type text NOT NULL,
  insight_data jsonb NOT NULL,
  story_id uuid REFERENCES user_stories.id,
  crew_member text,
  confidence_score numeric,
  created_at timestamptz DEFAULT now(),
  applied boolean,
  applied_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_learning_insights_type ON learning_insights (insight_type);
CREATE INDEX IF NOT EXISTS idx_learning_insights_story_id ON learning_insights (story_id);
CREATE INDEX IF NOT EXISTS idx_learning_insights_applied ON learning_insights (applied);

-- Function: update_updated_at

            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = now();
              RETURN NEW;
            END;
            $$ language 'plpgsql';
          
CREATE TRIGGER update_user_stories_updated_at
  BEFORE UPDATE
  ON user_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

