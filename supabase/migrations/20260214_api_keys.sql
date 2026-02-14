-- API Keys Table for External Integrations
-- Created: 2026-02-14
-- Purpose: Manage API keys for external system integrations with rate limiting

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Key information
  name TEXT NOT NULL, -- Human-readable name for the key
  key_prefix TEXT NOT NULL UNIQUE, -- First 8 chars visible (e.g., "sk_live_")
  key_hash TEXT NOT NULL UNIQUE, -- SHA-256 hash of the full key

  -- Permissions (JSON array of permission strings)
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Rate limiting
  rate_limit_per_hour INTEGER DEFAULT 1000,
  rate_limit_per_day INTEGER DEFAULT 10000,

  -- Usage tracking
  last_used_at TIMESTAMPTZ,
  total_requests BIGINT DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES auth.users(id),
  revoked_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ, -- Optional expiration

  -- Constraints
  CONSTRAINT valid_name CHECK (length(trim(name)) > 0),
  CONSTRAINT valid_key_prefix CHECK (length(key_prefix) = 8),
  CONSTRAINT valid_permissions CHECK (jsonb_typeof(permissions) = 'array')
);

-- Indexes for performance
CREATE INDEX idx_api_keys_org_id ON api_keys(organization_id);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at DESC);

-- API Key Usage Log for Rate Limiting
CREATE TABLE IF NOT EXISTS api_key_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,

  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,

  -- Response details
  status_code INTEGER,
  response_time_ms INTEGER,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Partitioning hint: we'll typically query by hour/day
  request_hour TIMESTAMPTZ GENERATED ALWAYS AS (date_trunc('hour', created_at)) STORED
);

-- Indexes for rate limiting queries
CREATE INDEX idx_api_key_usage_log_key_id ON api_key_usage_log(api_key_id);
CREATE INDEX idx_api_key_usage_log_request_hour ON api_key_usage_log(request_hour);
CREATE INDEX idx_api_key_usage_log_created_at ON api_key_usage_log(created_at DESC);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_api_key_rate_limit(
  p_api_key_id UUID,
  p_rate_limit_per_hour INTEGER,
  p_rate_limit_per_day INTEGER
)
RETURNS TABLE(
  hourly_count BIGINT,
  daily_count BIGINT,
  hourly_limit_exceeded BOOLEAN,
  daily_limit_exceeded BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH hourly_usage AS (
    SELECT COUNT(*) as count
    FROM api_key_usage_log
    WHERE api_key_id = p_api_key_id
      AND created_at >= NOW() - INTERVAL '1 hour'
  ),
  daily_usage AS (
    SELECT COUNT(*) as count
    FROM api_key_usage_log
    WHERE api_key_id = p_api_key_id
      AND created_at >= NOW() - INTERVAL '24 hours'
  )
  SELECT
    h.count::BIGINT as hourly_count,
    d.count::BIGINT as daily_count,
    (h.count >= p_rate_limit_per_hour)::BOOLEAN as hourly_limit_exceeded,
    (d.count >= p_rate_limit_per_day)::BOOLEAN as daily_limit_exceeded
  FROM hourly_usage h, daily_usage d;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to log API key usage
CREATE OR REPLACE FUNCTION log_api_key_usage(
  p_api_key_id UUID,
  p_endpoint TEXT,
  p_method TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_status_code INTEGER DEFAULT NULL,
  p_response_time_ms INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Insert usage log
  INSERT INTO api_key_usage_log (
    api_key_id, endpoint, method, ip_address,
    user_agent, status_code, response_time_ms
  )
  VALUES (
    p_api_key_id, p_endpoint, p_method, p_ip_address,
    p_user_agent, p_status_code, p_response_time_ms
  )
  RETURNING id INTO v_log_id;

  -- Update last_used_at and total_requests on api_keys
  UPDATE api_keys
  SET
    last_used_at = NOW(),
    total_requests = total_requests + 1
  WHERE id = p_api_key_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view API keys for their organizations
CREATE POLICY "Users can view org API keys"
  ON api_keys FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Only admins/consultants can create API keys
CREATE POLICY "Admins can create API keys"
  ON api_keys FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Only admins/consultants can update API keys
CREATE POLICY "Admins can update API keys"
  ON api_keys FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Only admins/consultants can delete API keys
CREATE POLICY "Admins can delete API keys"
  ON api_keys FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Users can view usage logs for their org's API keys
CREATE POLICY "Users can view org API key usage"
  ON api_key_usage_log FOR SELECT
  USING (
    api_key_id IN (
      SELECT ak.id
      FROM api_keys ak
      INNER JOIN memberships m ON m.organization_id = ak.organization_id
      WHERE m.user_id = auth.uid()
    )
  );

-- Policy: System can insert usage logs (bypass RLS for service)
CREATE POLICY "System can log API key usage"
  ON api_key_usage_log FOR INSERT
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE api_keys IS 'API keys for external system integrations with rate limiting';
COMMENT ON COLUMN api_keys.key_prefix IS 'First 8 characters of key (visible), format: sk_live_';
COMMENT ON COLUMN api_keys.key_hash IS 'SHA-256 hash of the full API key';
COMMENT ON COLUMN api_keys.permissions IS 'JSON array of permission strings (e.g., ["read:employees", "write:trainings"])';
COMMENT ON TABLE api_key_usage_log IS 'Usage tracking and rate limiting for API keys';
