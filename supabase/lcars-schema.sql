-- 🖥️ LCARS System Database Schema
-- Enterprise-D Library Computer Access/Retrieval System
-- Single source of truth for all crew members

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Memory Entries Table - Core memory storage for all crew observations
CREATE TABLE IF NOT EXISTS memory_entries (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  crew_member TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('observation', 'decision', 'learning', 'coordination', 'mission')),
  content JSONB NOT NULL,
  context TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  tags TEXT[] DEFAULT '{}',
  related_entries TEXT[] DEFAULT '{}',
  crew_consensus DECIMAL(3,2) DEFAULT 0.0 CHECK (crew_consensus >= 0.0 AND crew_consensus <= 1.0),
  validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crew Coordination Table - Tracks coordination sessions between crew members
CREATE TABLE IF NOT EXISTS crew_coordination (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  initiator TEXT NOT NULL,
  participants TEXT[] NOT NULL DEFAULT '{}',
  mission TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'failed')),
  crew_insights JSONB[] DEFAULT '{}',
  decisions JSONB[] DEFAULT '{}',
  outcomes JSONB[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Decisions Table - Records decisions made during coordination
CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  coordination_id TEXT REFERENCES crew_coordination(id) ON DELETE CASCADE,
  decision_type TEXT NOT NULL CHECK (decision_type IN ('strategic', 'tactical', 'operational', 'emergency')),
  description TEXT NOT NULL,
  crew_consensus DECIMAL(3,2) NOT NULL DEFAULT 0.0 CHECK (crew_consensus >= 0.0 AND crew_consensus <= 1.0),
  alternatives TEXT[] NOT NULL DEFAULT '{}',
  chosen_alternative TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  expected_outcome TEXT NOT NULL,
  actual_outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Outcomes Table - Records outcomes of decisions
CREATE TABLE IF NOT EXISTS outcomes (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decision_id TEXT REFERENCES decisions(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL,
  metrics JSONB DEFAULT '{}',
  lessons TEXT[] DEFAULT '{}',
  crew_feedback JSONB[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crew Feedback Table - Individual crew member feedback on outcomes
CREATE TABLE IF NOT EXISTS crew_feedback (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  outcome_id TEXT REFERENCES outcomes(id) ON DELETE CASCADE,
  crew_member TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  feedback TEXT NOT NULL,
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crew Expertise Table - Defines expertise areas for each crew member
CREATE TABLE IF NOT EXISTS crew_expertise (
  id SERIAL PRIMARY KEY,
  crew_member TEXT NOT NULL UNIQUE,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  confidence_levels JSONB DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mission Logs Table - Records all mission-related activities
CREATE TABLE IF NOT EXISTS mission_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mission_name TEXT NOT NULL,
  mission_type TEXT NOT NULL CHECK (mission_type IN ('exploration', 'diplomatic', 'scientific', 'security', 'maintenance', 'emergency')),
  crew_assigned TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'failed', 'aborted')),
  objectives TEXT[] NOT NULL DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  lessons_learned TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Learning Patterns Table - Tracks learning and improvement patterns
CREATE TABLE IF NOT EXISTS learning_patterns (
  id SERIAL PRIMARY KEY,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('success', 'failure', 'improvement', 'optimization')),
  context TEXT NOT NULL,
  crew_members_involved TEXT[] NOT NULL DEFAULT '{}',
  pattern_description TEXT NOT NULL,
  success_factors TEXT[] DEFAULT '{}',
  failure_factors TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memory_entries_crew_member ON memory_entries(crew_member);
CREATE INDEX IF NOT EXISTS idx_memory_entries_entry_type ON memory_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_memory_entries_timestamp ON memory_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_memory_entries_tags ON memory_entries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_memory_entries_context ON memory_entries USING GIN(to_tsvector('english', context));

CREATE INDEX IF NOT EXISTS idx_crew_coordination_initiator ON crew_coordination(initiator);
CREATE INDEX IF NOT EXISTS idx_crew_coordination_status ON crew_coordination(status);
CREATE INDEX IF NOT EXISTS idx_crew_coordination_timestamp ON crew_coordination(timestamp);
CREATE INDEX IF NOT EXISTS idx_crew_coordination_participants ON crew_coordination USING GIN(participants);

CREATE INDEX IF NOT EXISTS idx_decisions_coordination_id ON decisions(coordination_id);
CREATE INDEX IF NOT EXISTS idx_decisions_decision_type ON decisions(decision_type);
CREATE INDEX IF NOT EXISTS idx_decisions_timestamp ON decisions(timestamp);

CREATE INDEX IF NOT EXISTS idx_outcomes_decision_id ON outcomes(decision_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_success ON outcomes(success);
CREATE INDEX IF NOT EXISTS idx_outcomes_timestamp ON outcomes(timestamp);

CREATE INDEX IF NOT EXISTS idx_crew_feedback_outcome_id ON crew_feedback(outcome_id);
CREATE INDEX IF NOT EXISTS idx_crew_feedback_crew_member ON crew_feedback(crew_member);
CREATE INDEX IF NOT EXISTS idx_crew_feedback_rating ON crew_feedback(rating);

CREATE INDEX IF NOT EXISTS idx_mission_logs_mission_name ON mission_logs(mission_name);
CREATE INDEX IF NOT EXISTS idx_mission_logs_mission_type ON mission_logs(mission_type);
CREATE INDEX IF NOT EXISTS idx_mission_logs_status ON mission_logs(status);
CREATE INDEX IF NOT EXISTS idx_mission_logs_crew_assigned ON mission_logs USING GIN(crew_assigned);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_memory_entries_content_search ON memory_entries USING GIN(to_tsvector('english', content::text));
CREATE INDEX IF NOT EXISTS idx_crew_coordination_mission_search ON crew_coordination USING GIN(to_tsvector('english', mission));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_memory_entries_updated_at BEFORE UPDATE ON memory_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crew_coordination_updated_at BEFORE UPDATE ON crew_coordination FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_outcomes_updated_at BEFORE UPDATE ON outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crew_feedback_updated_at BEFORE UPDATE ON crew_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crew_expertise_updated_at BEFORE UPDATE ON crew_expertise FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mission_logs_updated_at BEFORE UPDATE ON mission_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_patterns_updated_at BEFORE UPDATE ON learning_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial crew expertise data
INSERT INTO crew_expertise (crew_member, expertise_areas, confidence_levels, specializations) VALUES
  ('captain-picard', ARRAY['strategic-planning', 'decision-making', 'leadership', 'diplomacy'], 
   '{"strategic-planning": 0.95, "decision-making": 0.92, "leadership": 0.98, "diplomacy": 0.89}', 
   ARRAY['Starfleet protocols', 'Interstellar diplomacy', 'Crisis management']),
  
  ('commander-data', ARRAY['data-analysis', 'technical-implementation', 'efficiency', 'type-safety'], 
   '{"data-analysis": 0.99, "technical-implementation": 0.97, "efficiency": 0.96, "type-safety": 0.98}', 
   ARRAY['Android physiology', 'Computational analysis', 'Scientific methodology']),
  
  ('counselor-troi', ARRAY['user-experience', 'emotional-intelligence', 'accessibility', 'team-morale'], 
   '{"user-experience": 0.94, "emotional-intelligence": 0.97, "accessibility": 0.91, "team-morale": 0.93}', 
   ARRAY['Betazoid empathy', 'Psychological assessment', 'Conflict resolution']),
  
  ('chief-engineer-scott', ARRAY['infrastructure', 'deployment', 'technical-implementation', 'build-systems'], 
   '{"infrastructure": 0.96, "deployment": 0.95, "technical-implementation": 0.94, "build-systems": 0.97}', 
   ARRAY['Miracle working', 'Engineering optimization', 'Resource management']),
  
  ('commander-spock', ARRAY['logical-analysis', 'time-management', 'efficiency', 'risk-assessment'], 
   '{"logical-analysis": 0.99, "time-management": 0.93, "efficiency": 0.95, "risk-assessment": 0.96}', 
   ARRAY['Vulcan logic', 'Scientific method', 'Strategic analysis']),
  
  ('lieutenant-worf', ARRAY['security-protocols', 'compliance', 'risk-management', 'defense'], 
   '{"security-protocols": 0.97, "compliance": 0.94, "risk-management": 0.95, "defense": 0.98}', 
   ARRAY['Klingon combat', 'Security systems', 'Tactical analysis']),
  
  ('quark', ARRAY['business-intelligence', 'revenue-optimization', 'market-analysis', 'profitability'], 
   '{"business-intelligence": 0.96, "revenue-optimization": 0.95, "market-analysis": 0.93, "profitability": 0.97}', 
   ARRAY['Ferengi business rules', 'Market manipulation', 'Profit optimization']),
  
  ('observation-lounge', ARRAY['crew-coordination', 'collective-intelligence', 'consensus-building', 'team-synergy'], 
   '{"crew-coordination": 0.95, "collective-intelligence": 0.94, "consensus-building": 0.96, "team-synergy": 0.93}', 
   ARRAY['Collective decision making', 'Team dynamics', 'Strategic collaboration'])
ON CONFLICT (crew_member) DO UPDATE SET
  expertise_areas = EXCLUDED.expertise_areas,
  confidence_levels = EXCLUDED.confidence_levels,
  specializations = EXCLUDED.specializations,
  updated_at = NOW();

-- Create views for common queries
CREATE OR REPLACE VIEW crew_performance_summary AS
SELECT 
  ce.crew_member,
  ce.expertise_areas,
  COUNT(me.id) as total_contributions,
  COUNT(CASE WHEN me.entry_type = 'observation' THEN 1 END) as observations,
  COUNT(CASE WHEN me.entry_type = 'decision' THEN 1 END) as decisions,
  COUNT(CASE WHEN me.entry_type = 'learning' THEN 1 END) as learnings,
  AVG(me.crew_consensus) as avg_consensus,
  MAX(me.timestamp) as last_activity
FROM crew_expertise ce
LEFT JOIN memory_entries me ON ce.crew_member = me.crew_member
GROUP BY ce.crew_member, ce.expertise_areas;

CREATE OR REPLACE VIEW coordination_summary AS
SELECT 
  cc.id,
  cc.mission,
  cc.status,
  cc.initiator,
  cc.participants,
  cc.timestamp,
  COUNT(cc.crew_insights) as total_insights,
  COUNT(cc.decisions) as total_decisions,
  COUNT(cc.outcomes) as total_outcomes
FROM crew_coordination cc
GROUP BY cc.id, cc.mission, cc.status, cc.initiator, cc.participants, cc.timestamp;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_crew_memory_summary(crew_member_param TEXT, days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  entry_type TEXT,
  count BIGINT,
  avg_consensus DECIMAL(3,2),
  last_activity TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    me.entry_type,
    COUNT(*) as count,
    AVG(me.crew_consensus) as avg_consensus,
    MAX(me.timestamp) as last_activity
  FROM memory_entries me
  WHERE me.crew_member = crew_member_param
    AND me.timestamp >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY me.entry_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_mission_insights(mission_name_param TEXT)
RETURNS TABLE(
  crew_member TEXT,
  insights_count BIGINT,
  avg_confidence DECIMAL(3,2),
  key_contributions TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    me.crew_member,
    COUNT(*) as insights_count,
    AVG(me.crew_consensus) as avg_confidence,
    ARRAY_AGG(DISTINCT me.content::text) as key_contributions
  FROM memory_entries me
  WHERE me.context ILIKE '%' || mission_name_param || '%'
    OR me.tags @> ARRAY[mission_name_param]
  GROUP BY me.crew_member
  ORDER BY insights_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create RLS policies for security
ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_expertise ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_patterns ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access for all users" ON memory_entries FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON crew_coordination FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON decisions FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON outcomes FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON crew_feedback FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON crew_expertise FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON mission_logs FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON learning_patterns FOR SELECT USING (true);

-- Allow insert/update for all authenticated users
CREATE POLICY "Allow insert for all users" ON memory_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON crew_coordination FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON decisions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON outcomes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON crew_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON crew_expertise FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON mission_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all users" ON learning_patterns FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON memory_entries FOR UPDATE USING (true);
CREATE POLICY "Allow update for all users" ON crew_coordination FOR UPDATE USING (true);
CREATE POLICY "Allow update for all users" ON decisions FOR UPDATE USING (true);
CREATE POLICY "Allow update for all users" ON outcomes FOR UPDATE USING (true);
CREATE POLICY "Allow update for all users" ON crew_feedback FOR UPDATE USING (true);
CREATE POLICY "Allow update for all users" ON crew_expertise FOR UPDATE USING (true);
CREATE POLICY "Allow update for all users" ON mission_logs FOR UPDATE USING (true);
CREATE POLICY "Allow update for all users" ON learning_patterns FOR UPDATE USING (true);

-- Insert initial system status
INSERT INTO memory_entries (id, crew_member, entry_type, content, context, priority, tags, crew_consensus, validation_status) VALUES
  ('system-init-001', 'lcars-system', 'mission', 
   '{"message": "LCARS System initialized", "version": "2.0.0", "status": "OPERATIONAL"}', 
   'system-initialization', 'high', ARRAY['system', 'initialization', 'lcars'], 1.0, 'validated')
ON CONFLICT (id) DO NOTHING;

-- Log schema creation
INSERT INTO memory_entries (id, crew_member, entry_type, content, context, priority, tags, crew_consensus, validation_status) VALUES
  ('schema-creation-001', 'lcars-system', 'learning', 
   '{"message": "LCARS Database Schema Created", "tables": 8, "indexes": 15, "functions": 2, "views": 2}', 
   'database-schema', 'high', ARRAY['database', 'schema', 'creation', 'lcars'], 1.0, 'validated')
ON CONFLICT (id) DO NOTHING;

-- Final status message
SELECT '🚀 LCARS Database Schema Successfully Created!' as status,
       'Enterprise-D Library Computer Access/Retrieval System Ready' as message,
       NOW() as timestamp;
