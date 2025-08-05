-- 🚀 Star Trek TNG Agile Project Manager - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    tech_stack JSONB DEFAULT '[]',
    team_members JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assignee VARCHAR(255),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]',
    story_points INTEGER,
    dependencies JSONB DEFAULT '[]'
);

-- Create sprints table
CREATE TABLE IF NOT EXISTS sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    goals JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access (for demo purposes)
-- Projects policies
DROP POLICY IF EXISTS "Allow public read access" ON projects;
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON projects;
CREATE POLICY "Allow public insert access" ON projects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON projects;
CREATE POLICY "Allow public update access" ON projects FOR UPDATE USING (true);

-- Tasks policies
DROP POLICY IF EXISTS "Allow public read access" ON tasks;
CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON tasks;
CREATE POLICY "Allow public insert access" ON tasks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON tasks;
CREATE POLICY "Allow public update access" ON tasks FOR UPDATE USING (true);

-- Sprints policies
DROP POLICY IF EXISTS "Allow public read access" ON sprints;
CREATE POLICY "Allow public read access" ON sprints FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON sprints;
CREATE POLICY "Allow public insert access" ON sprints FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON sprints;
CREATE POLICY "Allow public update access" ON sprints FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_project_id ON sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Insert some sample Star Trek themed data
INSERT INTO projects (name, description, project_type, status, tech_stack, team_members) VALUES
('Enterprise-D Systems Upgrade', 'Upgrade the Enterprise-D computer systems to handle increased data processing requirements', 'infrastructure', 'active', '["phaser_arrays", "shield_generators", "warp_core"]', '["Picard", "Data", "LaForge"]'),
('Diplomatic Mission to Betazed', 'Establish diplomatic relations with the Betazoid government', 'diplomatic', 'active', '["universal_translator", "diplomatic_protocols"]', '["Troi", "Riker", "Picard"]'),
('Security Protocol Enhancement', 'Implement enhanced security protocols for the Enterprise', 'security', 'active', '["force_fields", "biometric_scanners", "encryption"]', '["Worf", "Data", "O\'Brien"]'),
('Holodeck Entertainment Programs', 'Develop new holodeck programs for crew recreation', 'entertainment', 'active', '["holodeck_technology", "holographic_programming"]', '["Barclay", "LaForge", "Data"]'),
('Medical Research Initiative', 'Research new medical treatments and technologies', 'medical', 'active', '["medical_scanners", "biotechnology", "pharmaceuticals"]', '["Crusher", "Pulaski", "Data"]');

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, assignee, project_id, story_points) VALUES
('Upgrade Main Computer Core', 'Replace the main computer core with the latest isolinear chips', 'in_progress', 'high', 'Data', (SELECT id FROM projects WHERE name = 'Enterprise-D Systems Upgrade' LIMIT 1), 8),
('Install New Shield Generators', 'Install and calibrate new shield generator technology', 'todo', 'critical', 'LaForge', (SELECT id FROM projects WHERE name = 'Enterprise-D Systems Upgrade' LIMIT 1), 13),
('Prepare Diplomatic Briefing', 'Prepare comprehensive briefing materials for Betazed mission', 'done', 'medium', 'Troi', (SELECT id FROM projects WHERE name = 'Diplomatic Mission to Betazed' LIMIT 1), 5),
('Security System Audit', 'Conduct comprehensive audit of all security systems', 'review', 'high', 'Worf', (SELECT id FROM projects WHERE name = 'Security Protocol Enhancement' LIMIT 1), 8),
('Design Sherlock Holmes Program', 'Create a new Sherlock Holmes holodeck adventure', 'in_progress', 'low', 'Barclay', (SELECT id FROM projects WHERE name = 'Holodeck Entertainment Programs' LIMIT 1), 3);

-- Insert sample sprints
INSERT INTO sprints (name, start_date, end_date, project_id, goals) VALUES
('Enterprise Systems Sprint 1', NOW(), NOW() + INTERVAL '2 weeks', (SELECT id FROM projects WHERE name = 'Enterprise-D Systems Upgrade' LIMIT 1), '["Complete computer core upgrade", "Begin shield generator installation"]'),
('Diplomatic Mission Prep', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week', (SELECT id FROM projects WHERE name = 'Diplomatic Mission to Betazed' LIMIT 1), '["Complete briefing materials", "Schedule diplomatic meetings"]'),
('Security Enhancement Sprint', NOW(), NOW() + INTERVAL '3 weeks', (SELECT id FROM projects WHERE name = 'Security Protocol Enhancement' LIMIT 1), '["Complete security audit", "Implement new protocols"]');

-- Success message
SELECT '🚀 Star Trek TNG Agile Project Manager database setup complete!' as status; 