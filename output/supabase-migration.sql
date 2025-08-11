-- 🚀 WEEKLY EXECUTION PLAN - SUPABASE PRODUCTION MIGRATION
-- Generated: 2025-08-11T09:51:24.854Z
-- Purpose: Production database setup for weekly execution plan system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Create weekly_execution_plans table
CREATE TABLE IF NOT EXISTS weekly_execution_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  day text NOT NULL,
  date date NOT NULL,
  focus text NOT NULL,
  revenue_target text NOT NULL,
  time_investment text NOT NULL,
  morning_tasks jsonb NOT NULL,
  afternoon_tasks jsonb NOT NULL,
  evening_tasks jsonb,
  status text NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0,
  revenue_generated decimal NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_weekly_execution_plans_date ON weekly_execution_plans (date);
CREATE INDEX IF NOT EXISTS idx_weekly_execution_plans_status ON weekly_execution_plans (status);

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  time_slot text NOT NULL,
  duration text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  phase text NOT NULL,
  revenue_target text NOT NULL,
  assignee text NOT NULL DEFAULT 'You',
  category text NOT NULL,
  tags jsonb NOT NULL DEFAULT [],
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_plan_id ON daily_tasks (plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_status ON daily_tasks (status);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_priority ON daily_tasks (priority);

-- Create progress_metrics table
CREATE TABLE IF NOT EXISTS progress_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start_date date NOT NULL,
  total_tasks integer NOT NULL DEFAULT 0,
  completed_tasks integer NOT NULL DEFAULT 0,
  pending_tasks integer NOT NULL DEFAULT 0,
  revenue_target text NOT NULL,
  revenue_generated decimal NOT NULL DEFAULT 0,
  time_investment text NOT NULL,
  success_rate text NOT NULL DEFAULT '0%',
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_progress_metrics_week_start ON progress_metrics (week_start_date);

-- Create functions

            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
          

-- Create triggers
CREATE TRIGGER update_weekly_execution_plans_updated_at
  BEFORE UPDATE ON weekly_execution_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at
  BEFORE UPDATE ON daily_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_metrics_updated_at
  BEFORE UPDATE ON progress_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- Insert sample weekly execution plan data
INSERT INTO weekly_execution_plans (day, date, focus, revenue_target, time_investment, morning_tasks, afternoon_tasks, evening_tasks) VALUES (
  'Monday',
  '2025-01-13',
  'Foundation & Setup',
  '$0',
  '8 hours',
  '["Choose business name and commit to it","Set up free business email (Gmail)","Create professional email signature","Set up email folders for organization"]',
  '["Write and publish first LinkedIn post","Create first Twitter thread (6 tweets)","Start first blog post draft","Set up content calendar"]',
  '["Review tomorrow's tasks","Prepare content for Tuesday","Update project management system","Set iCal reminders for tomorrow"]'
);

INSERT INTO weekly_execution_plans (day, date, focus, revenue_target, time_investment, morning_tasks, afternoon_tasks, evening_tasks) VALUES (
  'Tuesday',
  '2025-01-14',
  'Content & Networking',
  '$0',
  '8 hours',
  '["Complete blog post from Monday","Create Tuesday LinkedIn post","Plan Wednesday content","Research trending topics in AI/business"]',
  '["Create assessment templates","Develop workflow optimization tools","Build emergency support protocols","Document service delivery processes"]',
  '[]'
);

INSERT INTO weekly_execution_plans (day, date, focus, revenue_target, time_investment, morning_tasks, afternoon_tasks, evening_tasks) VALUES (
  'Wednesday',
  '2025-01-15',
  'Service Delivery Prep',
  '$0',
  '8 hours',
  '["Test assessment tools with sample data","Refine workflow optimization processes","Practice emergency support scenarios","Create client onboarding materials"]',
  '["Conduct first free consultation","Refine consultation process","Document client needs","Create follow-up materials"]',
  '[]'
);

INSERT INTO weekly_execution_plans (day, date, focus, revenue_target, time_investment, morning_tasks, afternoon_tasks, evening_tasks) VALUES (
  'Thursday',
  '2025-01-16',
  'First Revenue Generation',
  '$500-$1,250',
  '8 hours',
  '["Deliver first paid service","Conduct client consultation","Implement initial optimizations","Document results and feedback"]',
  '["Analyze first client results","Refine service delivery process","Identify upsell opportunities","Plan next client acquisition"]',
  '[]'
);

INSERT INTO weekly_execution_plans (day, date, focus, revenue_target, time_investment, morning_tasks, afternoon_tasks, evening_tasks) VALUES (
  'Friday',
  '2025-01-17',
  'Scaling & Optimization',
  '$750-$2,000',
  '8 hours',
  '["Deliver second paid service","Refine delivery process","Collect client testimonials","Identify improvement areas"]',
  '["Document successful processes","Create standard operating procedures","Optimize client onboarding","Plan next week's strategy"]',
  '[]'
);

INSERT INTO weekly_execution_plans (day, date, focus, revenue_target, time_investment, morning_tasks, afternoon_tasks, evening_tasks) VALUES (
  'Saturday',
  '2025-01-18',
  'Weekend Momentum',
  '$500-$1,500',
  '4 hours',
  '["Create weekend social media content","Write blog post for next week","Plan Monday's marketing strategy","Engage with weekend audience"]',
  '["Review week's accomplishments","Plan next week's goals","Update project management system","Set Sunday objectives"]',
  '[]'
);

INSERT INTO weekly_execution_plans (day, date, focus, revenue_target, time_investment, morning_tasks, afternoon_tasks, evening_tasks) VALUES (
  'Sunday',
  '2025-01-19',
  'Reflection & Planning',
  '$0',
  '4 hours',
  '["Analyze week's results","Calculate total revenue generated","Identify successful strategies","Document lessons learned"]',
  '["Set next week's revenue targets","Plan content calendar","Schedule client consultations","Update project management system"]',
  '[]'
);

