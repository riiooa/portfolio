-- ============================================================
-- PORTFOLIO DATABASE SCHEMA (Jalankan di Supabase SQL Editor)
-- ============================================================

-- 1. Tabel Profile (Landing Page)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL DEFAULT 'Rio Al Fandi',
  short_intro TEXT NOT NULL DEFAULT 'Data Engineer & Solofounder',
  photo_front_url VARCHAR(512),
  photo_back_metadata JSONB DEFAULT '{
    "status": "ACTIVE",
    "role": "DATA_ENGINEER",
    "location": "ID",
    "skills": ["Python", "SQL", "AWS", "Airflow"]
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row
INSERT INTO profile (full_name, short_intro) 
VALUES ('Rio Al Fandi', 'Building data infrastructures for the future. Scaling ideas from zero to production.')
ON CONFLICT DO NOTHING;

-- 2. Tabel About & Contact
CREATE TABLE IF NOT EXISTS about_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_logs JSONB DEFAULT '[]'::jsonb,
  tech_circuits JSONB DEFAULT '[]'::jsonb,
  github_url VARCHAR(512),
  linkedin_url VARCHAR(512),
  resume_url VARCHAR(512),
  contact_email VARCHAR(255) DEFAULT 'riiooalfandi@gmail.com',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row
INSERT INTO about_contact (
  about_logs,
  tech_circuits,
  github_url,
  linkedin_url,
  contact_email
) VALUES (
  '[
    {"timestamp": "2021-01-01", "event": "INITIALIZED", "message": "Started journey as Data Engineer"},
    {"timestamp": "2023-06-01", "event": "UPGRADED", "message": "Launched first project as Solofounder"},
    {"timestamp": "CURRENT", "event": "STATUS", "message": "Open for high-impact collaborations"}
  ]'::jsonb,
  '[
    {"name": "Python", "category": "Language", "connected_to": ["Airflow", "dbt", "PostgreSQL"]},
    {"name": "SQL", "category": "Language", "connected_to": ["PostgreSQL", "BigQuery"]},
    {"name": "Airflow", "category": "Orchestration", "connected_to": ["Python", "AWS"]},
    {"name": "dbt", "category": "Transform", "connected_to": ["SQL", "BigQuery", "PostgreSQL"]},
    {"name": "PostgreSQL", "category": "Database", "connected_to": ["Python", "dbt"]},
    {"name": "AWS", "category": "Cloud", "connected_to": ["Airflow", "Python"]},
    {"name": "BigQuery", "category": "Warehouse", "connected_to": ["dbt", "SQL"]},
    {"name": "Spark", "category": "Processing", "connected_to": ["Python", "AWS"]}
  ]'::jsonb,
  'https://github.com/rioalfandi',
  'https://linkedin.com/in/rioalfandi',
  'riiooalfandi@gmail.com'
) ON CONFLICT DO NOTHING;

-- 3. Tabel Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  overview TEXT NOT NULL,
  problem_statement TEXT,
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  architecture_image VARCHAR(512),
  technical_challenge TEXT,
  key_metrics JSONB DEFAULT '[]'::jsonb,
  repo_url VARCHAR(512),
  demo_url VARCHAR(512),
  is_featured BOOLEAN DEFAULT false,
  priority_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample project
INSERT INTO projects (title, slug, overview, problem_statement, tech_stack, technical_challenge, key_metrics, is_featured, priority_order)
VALUES (
  'Real-time ETL Pipeline',
  'real-time-etl-pipeline',
  'End-to-end data pipeline processing 1TB+ daily from e-commerce platforms to analytical warehouse.',
  'E-commerce client had data scattered across 5 systems with 4-hour reporting lag, causing missed restocking opportunities.',
  '["Python", "Apache Airflow", "dbt", "PostgreSQL", "AWS S3", "Kafka"]'::jsonb,
  'Handling schema drift from upstream APIs. Solved with dynamic schema validation layer that auto-adapts column types.',
  '[{"label": "Latency Reduced", "value": "-85%"}, {"label": "Daily Volume", "value": "1TB+"}, {"label": "Uptime", "value": "99.9%"}]'::jsonb,
  true,
  1
) ON CONFLICT (slug) DO NOTHING;

-- 4. Tabel Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT false
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trigger_about_updated_at
  BEFORE UPDATE ON about_contact
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public can read about_contact" ON about_contact FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admins can do everything on profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on about_contact" ON about_contact FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything on messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
