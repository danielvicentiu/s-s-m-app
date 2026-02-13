-- S-S-M.RO — API KEYS TABLE
-- API key management for external integrations
-- Data: 13 Februarie 2026

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Key metadata
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Key data (hash stored, prefix visible for identification)
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_prefix VARCHAR(16) NOT NULL,

  -- Permissions (JSON array of permission strings)
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Rate limiting (requests per minute)
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 60,

  -- Usage tracking
  last_used_at TIMESTAMP WITH TIME ZONE,
  total_requests BIGINT NOT NULL DEFAULT 0,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Audit
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES profiles(id)
);

-- Indexes for performance
CREATE INDEX idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Create api_key_usage_log table for detailed tracking
CREATE TABLE IF NOT EXISTS api_key_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,

  -- Request details
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  duration_ms INTEGER,

  -- Error tracking
  error_message TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for usage log
CREATE INDEX idx_api_key_usage_log_api_key_id ON api_key_usage_log(api_key_id);
CREATE INDEX idx_api_key_usage_log_created_at ON api_key_usage_log(created_at);
CREATE INDEX idx_api_key_usage_log_status_code ON api_key_usage_log(status_code);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_keys

-- Consultants and firma_admin can view API keys for their organization
CREATE POLICY "Users can view org API keys"
  ON api_keys
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and firma_admin can create API keys for their organization
CREATE POLICY "Users can create org API keys"
  ON api_keys
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and firma_admin can update API keys for their organization
CREATE POLICY "Users can update org API keys"
  ON api_keys
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Consultants and firma_admin can delete (soft delete) API keys for their organization
CREATE POLICY "Users can delete org API keys"
  ON api_keys
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- RLS Policies for api_key_usage_log

-- Users can view usage logs for their organization's API keys
CREATE POLICY "Users can view org API key usage logs"
  ON api_key_usage_log
  FOR SELECT
  USING (
    api_key_id IN (
      SELECT id
      FROM api_keys
      WHERE organization_id IN (
        SELECT organization_id
        FROM memberships
        WHERE user_id = auth.uid()
          AND is_active = true
          AND role IN ('consultant', 'firma_admin')
      )
    )
  );

-- Service role can insert usage logs
CREATE POLICY "Service role can insert usage logs"
  ON api_key_usage_log
  FOR INSERT
  WITH CHECK (true);

-- Trigger to update updated_at on api_keys
CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();

-- Function to clean up old usage logs (run periodically via cron)
CREATE OR REPLACE FUNCTION cleanup_old_api_key_usage_logs(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM api_key_usage_log
  WHERE created_at < now() - (retention_days || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE api_keys IS 'API keys for external integrations with SSM platform';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the API key (actual key never stored)';
COMMENT ON COLUMN api_keys.key_prefix IS 'Visible prefix of the key for identification (e.g., ssm_pk_abc123)';
COMMENT ON COLUMN api_keys.permissions IS 'JSON array of permission strings (e.g., ["read:employees", "write:trainings"])';
COMMENT ON COLUMN api_keys.rate_limit_per_minute IS 'Maximum requests per minute for this API key';
COMMENT ON TABLE api_key_usage_log IS 'Detailed usage logs for API key requests';
