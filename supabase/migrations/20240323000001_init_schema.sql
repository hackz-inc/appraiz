-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'guest');

-- Admin table (extends Supabase auth.users)
CREATE TABLE admin (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest table (extends Supabase auth.users)
CREATE TABLE guest (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(48) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hackathon table
CREATE TABLE hackathon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(48) NOT NULL,
  scoring_date DATE NOT NULL,
  access_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team table
CREATE TABLE team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(48) NOT NULL,
  hackathon_id UUID NOT NULL REFERENCES hackathon(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scoring item table (評価項目)
CREATE TABLE scoring_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(48) NOT NULL,
  max_score INTEGER NOT NULL,
  hackathon_id UUID NOT NULL REFERENCES hackathon(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scoring result table (審査結果)
CREATE TABLE scoring_result (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judge_name VARCHAR(255) NOT NULL,
  comment TEXT DEFAULT '',
  team_id UUID NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scoring item result table (各項目の得点)
CREATE TABLE scoring_item_result (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score INTEGER NOT NULL,
  scoring_item_id UUID NOT NULL REFERENCES scoring_item(id) ON DELETE CASCADE,
  scoring_result_id UUID NOT NULL REFERENCES scoring_result(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hackathon guest junction table
CREATE TABLE hackathon_guest (
  id BIGSERIAL PRIMARY KEY,
  hackathon_id UUID NOT NULL REFERENCES hackathon(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guest(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hackathon_id, guest_id)
);

-- Presentation order table
CREATE TABLE presentation_order (
  id BIGSERIAL PRIMARY KEY,
  "order" INTEGER NOT NULL,
  team_id UUID NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Confirmed team order table
CREATE TABLE confirmed_team_order (
  id BIGSERIAL PRIMARY KEY,
  hackathon_id UUID UNIQUE NOT NULL REFERENCES hackathon(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team social table (optional)
CREATE TABLE team_social (
  id BIGSERIAL PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_team_hackathon ON team(hackathon_id);
CREATE INDEX idx_scoring_item_hackathon ON scoring_item(hackathon_id);
CREATE INDEX idx_scoring_result_team ON scoring_result(team_id);
CREATE INDEX idx_scoring_item_result_scoring_result ON scoring_item_result(scoring_result_id);
CREATE INDEX idx_scoring_item_result_scoring_item ON scoring_item_result(scoring_item_id);
CREATE INDEX idx_hackathon_guest_hackathon ON hackathon_guest(hackathon_id);
CREATE INDEX idx_hackathon_guest_guest ON hackathon_guest(guest_id);
CREATE INDEX idx_presentation_order_team ON presentation_order(team_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON admin
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guest_updated_at BEFORE UPDATE ON guest
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hackathon_updated_at BEFORE UPDATE ON hackathon
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON team
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scoring_item_updated_at BEFORE UPDATE ON scoring_item
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scoring_result_updated_at BEFORE UPDATE ON scoring_result
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scoring_item_result_updated_at BEFORE UPDATE ON scoring_item_result
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hackathon_guest_updated_at BEFORE UPDATE ON hackathon_guest
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presentation_order_updated_at BEFORE UPDATE ON presentation_order
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_confirmed_team_order_updated_at BEFORE UPDATE ON confirmed_team_order
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_social_updated_at BEFORE UPDATE ON team_social
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_item_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_guest ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmed_team_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_social ENABLE ROW LEVEL SECURITY;
