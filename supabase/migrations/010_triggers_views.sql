-- Migration 010: Triggers, Views, and RPC Functions
-- Description: Auto-update timestamps, alert creation, compliance views, and dashboard stats
-- Created: 2026-02-13

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger function: auto_update_updated_at
-- Automatically updates the updated_at column on any row update
CREATE OR REPLACE FUNCTION auto_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto_update_updated_at trigger to all relevant tables
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_trainings_updated_at
    BEFORE UPDATE ON trainings
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_medical_records_updated_at
    BEFORE UPDATE ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_equipment_updated_at
    BEFORE UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON memberships
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

CREATE TRIGGER update_penalties_updated_at
    BEFORE UPDATE ON penalties
    FOR EACH ROW
    EXECUTE FUNCTION auto_update_updated_at();

-- Trigger function: auto_create_alert_expiry
-- Automatically creates alerts when items are approaching expiration
CREATE OR REPLACE FUNCTION auto_create_alert_expiry()
RETURNS TRIGGER AS $$
DECLARE
    alert_type TEXT;
    alert_title TEXT;
    alert_message TEXT;
    days_until_expiry INTEGER;
BEGIN
    -- Determine alert type based on table
    alert_type := CASE TG_TABLE_NAME
        WHEN 'trainings' THEN 'training_expiry'
        WHEN 'medical_records' THEN 'medical_expiry'
        WHEN 'equipment' THEN 'equipment_expiry'
        ELSE 'general'
    END;

    -- Calculate days until expiry
    days_until_expiry := CASE TG_TABLE_NAME
        WHEN 'trainings' THEN EXTRACT(DAY FROM (NEW.valid_until - CURRENT_DATE))
        WHEN 'medical_records' THEN EXTRACT(DAY FROM (NEW.valid_until - CURRENT_DATE))
        WHEN 'equipment' THEN EXTRACT(DAY FROM (NEW.next_inspection - CURRENT_DATE))
        ELSE NULL
    END;

    -- Create alert if expiry is within 30 days and not already expired
    IF days_until_expiry IS NOT NULL AND days_until_expiry <= 30 AND days_until_expiry >= 0 THEN
        -- Build alert message
        alert_title := CASE TG_TABLE_NAME
            WHEN 'trainings' THEN 'Expirare Instruire SSM'
            WHEN 'medical_records' THEN 'Expirare Examen Medical'
            WHEN 'equipment' THEN 'Expirare Verificare Echipament'
            ELSE 'Expirare'
        END;

        alert_message := CASE TG_TABLE_NAME
            WHEN 'trainings' THEN 'Instruirea expiră în ' || days_until_expiry || ' zile'
            WHEN 'medical_records' THEN 'Examenul medical expiră în ' || days_until_expiry || ' zile'
            WHEN 'equipment' THEN 'Verificarea echipamentului expiră în ' || days_until_expiry || ' zile'
            ELSE 'Elementul expiră în ' || days_until_expiry || ' zile'
        END;

        -- Insert alert (avoid duplicates with ON CONFLICT)
        INSERT INTO alerts (
            organization_id,
            type,
            severity,
            title,
            message,
            related_id,
            related_type,
            status
        ) VALUES (
            NEW.organization_id,
            alert_type,
            CASE
                WHEN days_until_expiry <= 7 THEN 'high'
                WHEN days_until_expiry <= 14 THEN 'medium'
                ELSE 'low'
            END,
            alert_title,
            alert_message,
            NEW.id,
            TG_TABLE_NAME,
            'active'
        )
        ON CONFLICT (organization_id, related_type, related_id, type)
        WHERE status = 'active'
        DO UPDATE SET
            severity = EXCLUDED.severity,
            message = EXCLUDED.message,
            updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto_create_alert_expiry trigger to relevant tables
CREATE TRIGGER create_alert_on_training_expiry
    AFTER INSERT OR UPDATE OF valid_until ON trainings
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NULL)
    EXECUTE FUNCTION auto_create_alert_expiry();

CREATE TRIGGER create_alert_on_medical_expiry
    AFTER INSERT OR UPDATE OF valid_until ON medical_records
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NULL)
    EXECUTE FUNCTION auto_create_alert_expiry();

CREATE TRIGGER create_alert_on_equipment_expiry
    AFTER INSERT OR UPDATE OF next_inspection ON equipment
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NULL)
    EXECUTE FUNCTION auto_create_alert_expiry();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: v_employee_compliance
-- Provides a comprehensive overview of employee compliance status
CREATE OR REPLACE VIEW v_employee_compliance AS
SELECT
    e.id AS employee_id,
    e.organization_id,
    e.full_name,
    e.email,
    e.position,
    e.department,
    e.status,
    -- Training compliance
    COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until >= CURRENT_DATE) AS active_trainings,
    COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until < CURRENT_DATE) AS expired_trainings,
    MAX(t.valid_until) AS latest_training_expiry,
    -- Medical compliance
    COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until >= CURRENT_DATE) AS active_medical,
    COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until < CURRENT_DATE) AS expired_medical,
    MAX(mr.valid_until) AS latest_medical_expiry,
    -- Overall compliance status
    CASE
        WHEN COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until < CURRENT_DATE) > 0
             OR COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until < CURRENT_DATE) > 0
        THEN 'non_compliant'
        WHEN COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until >= CURRENT_DATE AND mr.valid_until <= CURRENT_DATE + INTERVAL '30 days') > 0
             OR COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until >= CURRENT_DATE AND t.valid_until <= CURRENT_DATE + INTERVAL '30 days') > 0
        THEN 'expiring_soon'
        ELSE 'compliant'
    END AS compliance_status,
    e.created_at,
    e.updated_at
FROM employees e
LEFT JOIN trainings t ON t.employee_id = e.id AND t.deleted_at IS NULL
LEFT JOIN medical_records mr ON mr.employee_id = e.id AND mr.deleted_at IS NULL
WHERE e.deleted_at IS NULL
GROUP BY e.id, e.organization_id, e.full_name, e.email, e.position, e.department, e.status, e.created_at, e.updated_at;

-- View: v_expiring_items
-- Shows all items (trainings, medical records, equipment) expiring within 30 days
CREATE OR REPLACE VIEW v_expiring_items AS
-- Trainings
SELECT
    'training' AS item_type,
    t.id AS item_id,
    t.organization_id,
    t.employee_id,
    e.full_name AS employee_name,
    t.training_type AS item_name,
    t.valid_until AS expiry_date,
    EXTRACT(DAY FROM (t.valid_until - CURRENT_DATE))::INTEGER AS days_until_expiry,
    CASE
        WHEN t.valid_until < CURRENT_DATE THEN 'expired'
        WHEN t.valid_until <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
        WHEN t.valid_until <= CURRENT_DATE + INTERVAL '14 days' THEN 'high'
        WHEN t.valid_until <= CURRENT_DATE + INTERVAL '30 days' THEN 'medium'
        ELSE 'low'
    END AS urgency,
    t.created_at,
    t.updated_at
FROM trainings t
JOIN employees e ON e.id = t.employee_id
WHERE t.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND t.valid_until <= CURRENT_DATE + INTERVAL '30 days'

UNION ALL

-- Medical Records
SELECT
    'medical' AS item_type,
    mr.id AS item_id,
    mr.organization_id,
    mr.employee_id,
    e.full_name AS employee_name,
    mr.exam_type AS item_name,
    mr.valid_until AS expiry_date,
    EXTRACT(DAY FROM (mr.valid_until - CURRENT_DATE))::INTEGER AS days_until_expiry,
    CASE
        WHEN mr.valid_until < CURRENT_DATE THEN 'expired'
        WHEN mr.valid_until <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
        WHEN mr.valid_until <= CURRENT_DATE + INTERVAL '14 days' THEN 'high'
        WHEN mr.valid_until <= CURRENT_DATE + INTERVAL '30 days' THEN 'medium'
        ELSE 'low'
    END AS urgency,
    mr.created_at,
    mr.updated_at
FROM medical_records mr
JOIN employees e ON e.id = mr.employee_id
WHERE mr.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND mr.valid_until <= CURRENT_DATE + INTERVAL '30 days'

UNION ALL

-- Equipment
SELECT
    'equipment' AS item_type,
    eq.id AS item_id,
    eq.organization_id,
    NULL AS employee_id,
    NULL AS employee_name,
    eq.name || ' (' || eq.equipment_type || ')' AS item_name,
    eq.next_inspection AS expiry_date,
    EXTRACT(DAY FROM (eq.next_inspection - CURRENT_DATE))::INTEGER AS days_until_expiry,
    CASE
        WHEN eq.next_inspection < CURRENT_DATE THEN 'expired'
        WHEN eq.next_inspection <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
        WHEN eq.next_inspection <= CURRENT_DATE + INTERVAL '14 days' THEN 'high'
        WHEN eq.next_inspection <= CURRENT_DATE + INTERVAL '30 days' THEN 'medium'
        ELSE 'low'
    END AS urgency,
    eq.created_at,
    eq.updated_at
FROM equipment eq
WHERE eq.deleted_at IS NULL
  AND eq.next_inspection IS NOT NULL
  AND eq.next_inspection <= CURRENT_DATE + INTERVAL '30 days'

ORDER BY expiry_date ASC;

-- View: v_org_stats
-- Provides aggregated statistics per organization
CREATE OR REPLACE VIEW v_org_stats AS
SELECT
    o.id AS organization_id,
    o.name AS organization_name,
    o.organization_type,
    -- Employee stats
    COUNT(DISTINCT e.id) AS total_employees,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'active') AS active_employees,
    -- Training stats
    COUNT(DISTINCT t.id) AS total_trainings,
    COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until >= CURRENT_DATE) AS active_trainings,
    COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until < CURRENT_DATE) AS expired_trainings,
    COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') AS expiring_trainings,
    -- Medical stats
    COUNT(DISTINCT mr.id) AS total_medical_records,
    COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until >= CURRENT_DATE) AS active_medical,
    COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until < CURRENT_DATE) AS expired_medical,
    COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') AS expiring_medical,
    -- Equipment stats
    COUNT(DISTINCT eq.id) AS total_equipment,
    COUNT(DISTINCT eq.id) FILTER (WHERE eq.status = 'operational') AS operational_equipment,
    COUNT(DISTINCT eq.id) FILTER (WHERE eq.next_inspection < CURRENT_DATE) AS overdue_inspections,
    COUNT(DISTINCT eq.id) FILTER (WHERE eq.next_inspection BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') AS upcoming_inspections,
    -- Alert stats
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active') AS active_alerts,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active' AND a.severity = 'high') AS high_priority_alerts,
    -- Penalty stats
    COUNT(DISTINCT p.id) AS total_penalties,
    COALESCE(SUM(p.amount), 0) AS total_penalty_amount,
    -- Timestamps
    o.created_at,
    o.updated_at
FROM organizations o
LEFT JOIN employees e ON e.organization_id = o.id AND e.deleted_at IS NULL
LEFT JOIN trainings t ON t.organization_id = o.id AND t.deleted_at IS NULL
LEFT JOIN medical_records mr ON mr.organization_id = o.id AND mr.deleted_at IS NULL
LEFT JOIN equipment eq ON eq.organization_id = o.id AND eq.deleted_at IS NULL
LEFT JOIN alerts a ON a.organization_id = o.id AND a.deleted_at IS NULL
LEFT JOIN penalties p ON p.organization_id = o.id AND p.deleted_at IS NULL
WHERE o.deleted_at IS NULL
GROUP BY o.id, o.name, o.organization_type, o.created_at, o.updated_at;

-- View: v_active_alerts
-- Shows all active alerts with related information
CREATE OR REPLACE VIEW v_active_alerts AS
SELECT
    a.id AS alert_id,
    a.organization_id,
    o.name AS organization_name,
    a.type AS alert_type,
    a.severity,
    a.title,
    a.message,
    a.related_id,
    a.related_type,
    -- Employee info (if applicable)
    e.full_name AS employee_name,
    e.email AS employee_email,
    -- Days overdue/remaining
    CASE
        WHEN a.related_type = 'trainings' THEN EXTRACT(DAY FROM (t.valid_until - CURRENT_DATE))::INTEGER
        WHEN a.related_type = 'medical_records' THEN EXTRACT(DAY FROM (mr.valid_until - CURRENT_DATE))::INTEGER
        WHEN a.related_type = 'equipment' THEN EXTRACT(DAY FROM (eq.next_inspection - CURRENT_DATE))::INTEGER
        ELSE NULL
    END AS days_until_action,
    a.status,
    a.created_at,
    a.updated_at
FROM alerts a
JOIN organizations o ON o.id = a.organization_id
LEFT JOIN trainings t ON a.related_type = 'trainings' AND a.related_id = t.id
LEFT JOIN medical_records mr ON a.related_type = 'medical_records' AND a.related_id = mr.id
LEFT JOIN equipment eq ON a.related_type = 'equipment' AND a.related_id = eq.id
LEFT JOIN employees e ON COALESCE(t.employee_id, mr.employee_id) = e.id
WHERE a.deleted_at IS NULL
  AND a.status = 'active'
ORDER BY
    CASE a.severity
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
    END,
    a.created_at DESC;

-- ============================================================================
-- RPC FUNCTIONS
-- ============================================================================

-- RPC: calculate_compliance_score
-- Calculates a compliance score (0-100) for an organization or employee
CREATE OR REPLACE FUNCTION calculate_compliance_score(
    target_type TEXT, -- 'organization' or 'employee'
    target_id UUID
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    total_items INTEGER := 0;
    compliant_items INTEGER := 0;
    expiring_items INTEGER := 0;
    expired_items INTEGER := 0;
    score NUMERIC;
BEGIN
    IF target_type = 'organization' THEN
        -- Calculate for organization
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE valid_until >= CURRENT_DATE) AS compliant,
            COUNT(*) FILTER (WHERE valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') AS expiring,
            COUNT(*) FILTER (WHERE valid_until < CURRENT_DATE) AS expired
        INTO total_items, compliant_items, expiring_items, expired_items
        FROM (
            SELECT valid_until FROM trainings WHERE organization_id = target_id AND deleted_at IS NULL
            UNION ALL
            SELECT valid_until FROM medical_records WHERE organization_id = target_id AND deleted_at IS NULL
        ) AS items;

    ELSIF target_type = 'employee' THEN
        -- Calculate for employee
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE valid_until >= CURRENT_DATE) AS compliant,
            COUNT(*) FILTER (WHERE valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') AS expiring,
            COUNT(*) FILTER (WHERE valid_until < CURRENT_DATE) AS expired
        INTO total_items, compliant_items, expiring_items, expired_items
        FROM (
            SELECT valid_until FROM trainings WHERE employee_id = target_id AND deleted_at IS NULL
            UNION ALL
            SELECT valid_until FROM medical_records WHERE employee_id = target_id AND deleted_at IS NULL
        ) AS items;
    ELSE
        RAISE EXCEPTION 'Invalid target_type. Must be "organization" or "employee"';
    END IF;

    -- Calculate score (0-100)
    IF total_items = 0 THEN
        score := 0;
    ELSE
        -- Full points for compliant items, half points for expiring, zero for expired
        score := ROUND(((compliant_items * 1.0 + expiring_items * 0.5) / total_items) * 100, 2);
    END IF;

    -- Build result
    result := jsonb_build_object(
        'score', score,
        'total_items', total_items,
        'compliant_items', compliant_items,
        'expiring_items', expiring_items,
        'expired_items', expired_items,
        'status', CASE
            WHEN expired_items > 0 THEN 'non_compliant'
            WHEN expiring_items > 0 THEN 'expiring_soon'
            WHEN total_items = 0 THEN 'no_data'
            ELSE 'compliant'
        END
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- RPC: get_dashboard_stats
-- Returns comprehensive dashboard statistics for an organization
CREATE OR REPLACE FUNCTION get_dashboard_stats(org_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        -- Employee stats
        'employees', jsonb_build_object(
            'total', COUNT(DISTINCT e.id),
            'active', COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'active'),
            'inactive', COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'inactive')
        ),
        -- Training stats
        'trainings', jsonb_build_object(
            'total', COUNT(DISTINCT t.id),
            'active', COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until >= CURRENT_DATE),
            'expired', COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until < CURRENT_DATE),
            'expiring_soon', COUNT(DISTINCT t.id) FILTER (WHERE t.valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days')
        ),
        -- Medical stats
        'medical', jsonb_build_object(
            'total', COUNT(DISTINCT mr.id),
            'active', COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until >= CURRENT_DATE),
            'expired', COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until < CURRENT_DATE),
            'expiring_soon', COUNT(DISTINCT mr.id) FILTER (WHERE mr.valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days')
        ),
        -- Equipment stats
        'equipment', jsonb_build_object(
            'total', COUNT(DISTINCT eq.id),
            'operational', COUNT(DISTINCT eq.id) FILTER (WHERE eq.status = 'operational'),
            'maintenance', COUNT(DISTINCT eq.id) FILTER (WHERE eq.status = 'maintenance'),
            'overdue_inspections', COUNT(DISTINCT eq.id) FILTER (WHERE eq.next_inspection < CURRENT_DATE),
            'upcoming_inspections', COUNT(DISTINCT eq.id) FILTER (WHERE eq.next_inspection BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days')
        ),
        -- Alert stats
        'alerts', jsonb_build_object(
            'active', COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active'),
            'high_priority', COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active' AND a.severity = 'high'),
            'medium_priority', COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active' AND a.severity = 'medium'),
            'low_priority', COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active' AND a.severity = 'low')
        ),
        -- Document stats
        'documents', jsonb_build_object(
            'total', COUNT(DISTINCT d.id),
            'by_type', (
                SELECT jsonb_object_agg(document_type, count)
                FROM (
                    SELECT document_type, COUNT(*) as count
                    FROM documents
                    WHERE organization_id = org_id AND deleted_at IS NULL
                    GROUP BY document_type
                ) dt
            )
        ),
        -- Penalty stats
        'penalties', jsonb_build_object(
            'total_count', COUNT(DISTINCT p.id),
            'total_amount', COALESCE(SUM(p.amount), 0),
            'resolved', COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'resolved'),
            'pending', COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'pending')
        ),
        -- Compliance score
        'compliance_score', calculate_compliance_score('organization', org_id)
    )
    INTO result
    FROM organizations o
    LEFT JOIN employees e ON e.organization_id = o.id AND e.deleted_at IS NULL
    LEFT JOIN trainings t ON t.organization_id = o.id AND t.deleted_at IS NULL
    LEFT JOIN medical_records mr ON mr.organization_id = o.id AND mr.deleted_at IS NULL
    LEFT JOIN equipment eq ON eq.organization_id = o.id AND eq.deleted_at IS NULL
    LEFT JOIN alerts a ON a.organization_id = o.id AND a.deleted_at IS NULL
    LEFT JOIN documents d ON d.organization_id = o.id AND d.deleted_at IS NULL
    LEFT JOIN penalties p ON p.organization_id = o.id AND p.deleted_at IS NULL
    WHERE o.id = org_id AND o.deleted_at IS NULL
    GROUP BY o.id;

    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION auto_update_updated_at() IS 'Automatically updates updated_at timestamp on row updates';
COMMENT ON FUNCTION auto_create_alert_expiry() IS 'Creates alerts when trainings, medical records, or equipment are expiring within 30 days';
COMMENT ON VIEW v_employee_compliance IS 'Comprehensive employee compliance overview with training and medical status';
COMMENT ON VIEW v_expiring_items IS 'All items (trainings, medical, equipment) expiring within 30 days';
COMMENT ON VIEW v_org_stats IS 'Aggregated statistics per organization for dashboard display';
COMMENT ON VIEW v_active_alerts IS 'All active alerts with related information and urgency';
COMMENT ON FUNCTION calculate_compliance_score IS 'Calculates compliance score (0-100) for organization or employee';
COMMENT ON FUNCTION get_dashboard_stats IS 'Returns comprehensive dashboard statistics for an organization';

-- ============================================================================
-- GRANTS (RLS policies will control actual access)
-- ============================================================================

-- Grant access to views
GRANT SELECT ON v_employee_compliance TO authenticated;
GRANT SELECT ON v_expiring_items TO authenticated;
GRANT SELECT ON v_org_stats TO authenticated;
GRANT SELECT ON v_active_alerts TO authenticated;

-- Grant execute on RPC functions
GRANT EXECUTE ON FUNCTION calculate_compliance_score TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats TO authenticated;
