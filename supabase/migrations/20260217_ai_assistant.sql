-- Migration: AI Assistant conversations table
-- Date: 2026-02-17
-- Branch: feat/ai-assistant

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_conversations_user" ON ai_conversations FOR ALL USING (
  user_id = auth.uid() AND organization_id IN (
    SELECT organization_id FROM memberships WHERE user_id = auth.uid()
  )
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_org ON ai_conversations(organization_id);
CREATE INDEX idx_ai_conversations_updated ON ai_conversations(updated_at DESC);

CREATE TRIGGER update_ai_conversations_updated_at
BEFORE UPDATE ON ai_conversations FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
