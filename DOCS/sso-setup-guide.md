# SSO Setup Guide — s-s-m.ro Platform

## Overview

This guide provides step-by-step instructions for configuring SAML-based Single Sign-On (SSO) for enterprise organizations using the s-s-m.ro platform.

### Supported Identity Providers

- **Azure AD (Microsoft Entra ID)**
- **Google Workspace**
- **Okta**
- **Generic SAML 2.0 providers**

### Prerequisites

- Enterprise subscription with SSO feature flag enabled
- Organization administrator role (consultant or firma_admin)
- Access to your organization's Identity Provider (IdP) admin console
- SAML metadata XML from your IdP

---

## Table of Contents

1. [Azure AD Setup](#azure-ad-setup)
2. [Google Workspace Setup](#google-workspace-setup)
3. [Okta Setup](#okta-setup)
4. [Generic SAML Provider Setup](#generic-saml-provider-setup)
5. [Configuring SSO in s-s-m.ro](#configuring-sso-in-s-s-mro)
6. [Testing Your SSO Configuration](#testing-your-sso-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)

---

## Azure AD Setup

### Step 1: Register Application in Azure AD

1. Sign in to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **Enterprise applications**
3. Click **+ New application** → **Create your own application**
4. Enter application name: `s-s-m.ro Platform`
5. Select **Integrate any other application you don't find in the gallery (Non-gallery)**
6. Click **Create**

### Step 2: Configure Single Sign-On

1. In your new application, go to **Single sign-on**
2. Select **SAML** as the single sign-on method
3. Click **Edit** on **Basic SAML Configuration**

Configure the following:

```
Identifier (Entity ID): https://app.s-s-m.ro/api/auth/saml/metadata/{YOUR_ORG_ID}
Reply URL (Assertion Consumer Service URL): https://app.s-s-m.ro/api/auth/saml/callback
Sign on URL: https://app.s-s-m.ro/login/sso/{YOUR_ORG_ID}
```

Replace `{YOUR_ORG_ID}` with your organization ID from s-s-m.ro.

4. Click **Save**

### Step 3: Configure User Attributes & Claims

In the **User Attributes & Claims** section, ensure these claims are configured:

| Claim Name | Source Attribute |
|------------|------------------|
| `emailaddress` | user.mail |
| `givenname` | user.givenname |
| `surname` | user.surname |
| `name` | user.displayname |
| `role` (optional) | user.assignedroles |

### Step 4: Download SAML Metadata

1. Scroll to **SAML Certificates** section
2. Click **Download** next to **Federation Metadata XML**
3. Save the file — you'll upload this to s-s-m.ro

### Step 5: Assign Users

1. Navigate to **Users and groups** in your application
2. Click **+ Add user/group**
3. Select users or groups who should have access to s-s-m.ro
4. Optionally assign roles if using role-based provisioning
5. Click **Assign**

---

## Google Workspace Setup

### Step 1: Create Custom SAML App

1. Sign in to [Google Admin Console](https://admin.google.com)
2. Navigate to **Apps** → **Web and mobile apps**
3. Click **Add app** → **Add custom SAML app**
4. Enter app name: `s-s-m.ro Platform`
5. Click **Continue**

### Step 2: Download IdP Metadata

1. On the **Google Identity Provider details** page
2. Click **Download Metadata**
3. Save the XML file — you'll upload this to s-s-m.ro
4. Click **Continue**

### Step 3: Configure Service Provider Details

Enter the following values:

```
ACS URL: https://app.s-s-m.ro/api/auth/saml/callback
Entity ID: https://app.s-s-m.ro/api/auth/saml/metadata/{YOUR_ORG_ID}
Start URL: https://app.s-s-m.ro/login/sso/{YOUR_ORG_ID}
Name ID format: EMAIL
Name ID: Basic Information > Primary email
```

Replace `{YOUR_ORG_ID}` with your organization ID from s-s-m.ro.

4. Click **Continue**

### Step 4: Configure Attribute Mapping

Add the following attribute mappings:

| Google Directory Attribute | App Attribute |
|---------------------------|---------------|
| Primary email | email |
| First name | firstName |
| Last name | lastName |
| Full name | displayName |

5. Click **Finish**

### Step 5: Enable the App

1. Click on your newly created app
2. Click **User access**
3. Select **ON for everyone** or choose specific organizational units
4. Click **Save**

---

## Okta Setup

### Step 1: Create SAML Application

1. Sign in to [Okta Admin Console](https://admin.okta.com)
2. Navigate to **Applications** → **Applications**
3. Click **Create App Integration**
4. Select **SAML 2.0**
5. Click **Next**

### Step 2: Configure General Settings

1. Enter app name: `s-s-m.ro Platform`
2. Optionally upload logo
3. Click **Next**

### Step 3: Configure SAML Settings

Enter the following:

```
Single sign on URL: https://app.s-s-m.ro/api/auth/saml/callback
☑ Use this for Recipient URL and Destination URL
Audience URI (SP Entity ID): https://app.s-s-m.ro/api/auth/saml/metadata/{YOUR_ORG_ID}
Default RelayState: (leave empty)
Name ID format: EmailAddress
Application username: Email
```

Replace `{YOUR_ORG_ID}` with your organization ID from s-s-m.ro.

### Step 4: Configure Attribute Statements

Add the following attribute statements:

| Name | Name format | Value |
|------|-------------|-------|
| email | Unspecified | user.email |
| firstName | Unspecified | user.firstName |
| lastName | Unspecified | user.lastName |
| displayName | Unspecified | user.displayName |
| role | Unspecified | user.role (optional) |
| department | Unspecified | user.department (optional) |

4. Click **Next**
5. Select **I'm an Okta customer adding an internal app**
6. Click **Finish**

### Step 5: Download Metadata

1. On your application's **Sign On** tab
2. Scroll to **SAML 2.0** section
3. Right-click **Identity Provider metadata** link
4. Select **Save link as...**
5. Save the XML file — you'll upload this to s-s-m.ro

### Step 6: Assign Users

1. Go to **Assignments** tab
2. Click **Assign** → **Assign to People** or **Assign to Groups**
3. Select users/groups and click **Assign**
4. Click **Done**

---

## Generic SAML Provider Setup

For other SAML 2.0 compliant identity providers:

### Required Configuration Values

Provide these values to your IdP administrator:

```
Service Provider Entity ID: https://app.s-s-m.ro/api/auth/saml/metadata/{YOUR_ORG_ID}
Assertion Consumer Service (ACS) URL: https://app.s-s-m.ro/api/auth/saml/callback
Single Logout Service URL: https://app.s-s-m.ro/api/auth/saml/logout
NameID Format: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
```

Replace `{YOUR_ORG_ID}` with your organization ID.

### Required SAML Attributes

Your IdP must provide at minimum:

- **email** (required) — User's email address
- **firstName** (recommended) — User's first name
- **lastName** (recommended) — User's last name
- **displayName** (optional) — User's display name

### Obtain Metadata XML

Request the SAML metadata XML file from your IdP administrator. This file contains:

- IdP Entity ID
- Single Sign-On Service URL
- Single Logout Service URL
- X.509 Certificate for signature verification

---

## Configuring SSO in s-s-m.ro

Once you have your IdP metadata XML file, configure SSO in the platform:

### Step 1: Navigate to SSO Settings

1. Log in to [s-s-m.ro](https://app.s-s-m.ro)
2. Go to **Setări** → **Securitate** → **Single Sign-On**
3. Click **Configurare SSO**

### Step 2: Select Provider

Choose your identity provider:
- Azure AD
- Google Workspace
- Okta
- Generic SAML 2.0

### Step 3: Upload Metadata

1. Click **Încarcă Metadata XML**
2. Select the metadata file you downloaded from your IdP
3. The system will automatically extract:
   - Entity ID
   - SSO URL
   - Logout URL
   - Certificate

4. Verify the extracted information

### Step 4: Configure Attribute Mapping

The default attribute mappings are pre-configured based on your provider. Review and adjust if needed:

| Platform Field | SAML Attribute | Required |
|---------------|----------------|----------|
| Email | (varies by provider) | ✓ |
| First Name | (varies by provider) | - |
| Last Name | (varies by provider) | - |
| Display Name | (varies by provider) | - |
| Role | (varies by provider) | - |
| Department | (varies by provider) | - |

### Step 5: Configure Provisioning Options

**Auto-Provisioning**
- ☐ **Disabled** — Users must exist in s-s-m.ro before SSO login
- ☑ **Enabled** — New users are automatically created on first SSO login

**Default Role** (if auto-provisioning enabled):
- Select the default role for new users: `angajat`, `firma_admin`, or `consultant`

**Role Mapping** (optional):
- Map IdP roles to platform roles
- Example: Azure AD role "SSM Admin" → platform role "firma_admin"

### Step 6: Test Configuration

1. Click **Testează Conexiune**
2. Verify the test results:
   - ✓ Metadata valid
   - ✓ Certificate valid
   - ✓ SSO URL accessible
3. If all tests pass, proceed to enable SSO

### Step 7: Enable SSO

1. Toggle **Activează SSO**
2. Confirm the action
3. SSO is now active for your organization

### Step 8: Communication

Inform your users:
- SSO login URL: `https://app.s-s-m.ro/login/sso/{YOUR_ORG_ID}`
- They should use their corporate credentials
- Legacy email/password login remains available at `https://app.s-s-m.ro/login`

---

## Testing Your SSO Configuration

### Test Login Flow

1. **Initiate SSO Login**
   - Navigate to: `https://app.s-s-m.ro/login/sso/{YOUR_ORG_ID}`
   - Or click "Login with SSO" on the main login page

2. **IdP Authentication**
   - You should be redirected to your IdP's login page
   - Enter your corporate credentials
   - If already logged in to IdP, you may be automatically signed in

3. **Callback Processing**
   - After successful IdP authentication, you'll be redirected back to s-s-m.ro
   - The platform validates the SAML assertion
   - User attributes are mapped to your profile

4. **Access Dashboard**
   - You should be logged in and redirected to the dashboard
   - Verify your profile information is correct

### Test Scenarios

| Scenario | Expected Result |
|----------|----------------|
| Existing user login | User authenticated, session created |
| New user login (auto-provision ON) | User created, session created |
| New user login (auto-provision OFF) | Error: "User not found" |
| Invalid assertion | Error: "Invalid SAML assertion" |
| Expired assertion | Error: "Assertion expired" |
| Invalid signature | Error: "Invalid signature" |

### Verify Audit Log

1. Go to **Setări** → **Securitate** → **Jurnal Audit**
2. Look for events:
   - `sso_login` — Successful SSO authentication
   - `sso_configured` — SSO configuration changes
   - `sso_enabled` — SSO enabled/disabled

---

## Troubleshooting

### Common Issues

#### Issue: "Metadata XML invalid"

**Cause**: The uploaded XML file is malformed or not a valid SAML metadata file.

**Solution**:
- Verify you downloaded the correct file from your IdP
- Ensure the file is not corrupted
- Check that the file contains `<EntityDescriptor>` or `<EntitiesDescriptor>` root element
- Re-download the metadata from your IdP

#### Issue: "Certificate invalid"

**Cause**: The X.509 certificate in the metadata is malformed or has expired.

**Solution**:
- Verify the certificate in your IdP configuration
- Check certificate expiration date
- Re-download fresh metadata with updated certificate
- Contact your IdP administrator

#### Issue: "SSO URL not accessible"

**Cause**: The Single Sign-On URL in the metadata is incorrect or unreachable.

**Solution**:
- Verify the SSO URL in your IdP configuration
- Test the URL manually in a browser
- Check for network/firewall restrictions
- Ensure HTTPS is configured correctly

#### Issue: "Email not provided by SSO provider"

**Cause**: The email attribute is not being sent in the SAML assertion.

**Solution**:
- Verify attribute mapping in your IdP configuration
- Check that the email claim/attribute is configured
- Review the attribute mapping in s-s-m.ro SSO settings
- Test with a user who has an email address configured

#### Issue: "Invalid SAML signature"

**Cause**: The SAML assertion signature verification failed.

**Solution**:
- Verify the certificate matches between IdP and s-s-m.ro
- Ensure the IdP is using the correct signing certificate
- Check that the signing algorithm is supported (RSA-SHA256)
- Re-upload the latest metadata XML

#### Issue: "User not found" (with auto-provisioning disabled)

**Cause**: User doesn't exist in s-s-m.ro and auto-provisioning is disabled.

**Solution**:
- Enable auto-provisioning in SSO settings
- Or manually create the user in s-s-m.ro before SSO login
- Ensure the email address matches exactly

#### Issue: Redirect loop

**Cause**: Misconfigured URLs or RelayState issues.

**Solution**:
- Verify all URLs in IdP configuration match exactly
- Clear browser cookies and cache
- Check that the ACS URL is correct: `https://app.s-s-m.ro/api/auth/saml/callback`
- Ensure no URL encoding issues

### Debug Mode

To enable SSO debug logging:

1. Contact s-s-m.ro support
2. Provide your organization ID
3. Support will enable verbose SSO logging
4. Attempt SSO login
5. Review logs with support team

### Getting Help

If you continue to experience issues:

1. **Collect Information**:
   - Organization ID
   - Identity Provider (Azure AD, Google, Okta, etc.)
   - Error message
   - Screenshots of the issue
   - SAML assertion (if available)

2. **Contact Support**:
   - Email: support@s-s-m.ro
   - Subject: "SSO Configuration Issue - [YOUR_ORG_ID]"
   - Include collected information

---

## Security Best Practices

### Certificate Management

- **Rotate Regularly**: Update IdP certificates before expiration
- **Monitor Expiration**: Set reminders 30 days before certificate expiry
- **Test After Rotation**: Always test SSO after updating certificates
- **Backup Metadata**: Keep a backup of your SAML metadata XML

### Access Control

- **Principle of Least Privilege**: Only assign necessary users to the SSO app
- **Regular Audits**: Review user assignments quarterly
- **Disable Unused Accounts**: Remove access for employees who leave
- **Role Mapping**: Use role-based provisioning for appropriate access levels

### Network Security

- **HTTPS Only**: Always use HTTPS for all SSO endpoints
- **IP Whitelisting**: Consider restricting SSO callback to known IP ranges
- **Firewall Rules**: Ensure IdP can reach s-s-m.ro callback URL
- **DDoS Protection**: Monitor for unusual SSO traffic patterns

### Compliance

- **Audit Logging**: Enable and monitor SSO audit logs
- **Data Retention**: Configure appropriate log retention policies
- **Privacy**: Ensure SAML assertions only contain necessary user data
- **GDPR Compliance**: Document SSO data flows for compliance requirements

### Operational

- **Backup Authentication**: Keep email/password login available as fallback
- **Communication**: Notify users before enabling/disabling SSO
- **Testing**: Test SSO in staging environment before production
- **Documentation**: Maintain internal documentation of SSO configuration
- **Emergency Access**: Ensure admin accounts can bypass SSO if needed

---

## Architecture & Implementation Details

### Authentication Flow

```
1. User → s-s-m.ro/login/sso/{orgId}
2. s-s-m.ro → Redirect to IdP SSO URL (SAML Request)
3. User ← IdP Login Page
4. User → IdP (Credentials)
5. IdP → s-s-m.ro/api/auth/saml/callback (SAML Response)
6. s-s-m.ro:
   a. Verify signature
   b. Validate assertion
   c. Map attributes
   d. Create/update user
   e. Create session
7. User ← Redirect to dashboard
```

### Database Schema

```sql
CREATE TABLE sso_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'azure-ad', 'google-workspace', 'okta', 'generic'
  enabled BOOLEAN DEFAULT false,
  metadata JSONB NOT NULL, -- {entityId, ssoUrl, logoutUrl, certificate}
  attribute_mapping JSONB NOT NULL, -- {email, firstName, lastName, ...}
  auto_provision BOOLEAN DEFAULT false,
  default_role VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

CREATE INDEX idx_sso_configs_org ON sso_configs(organization_id);
CREATE INDEX idx_sso_configs_enabled ON sso_configs(enabled);
```

### API Endpoints

- `GET /api/auth/saml/metadata/{orgId}` — Service Provider metadata
- `POST /api/auth/saml/callback` — Assertion Consumer Service (ACS)
- `GET /api/auth/saml/logout` — Single Logout Service
- `GET /login/sso/{orgId}` — Initiate SSO login
- `POST /api/admin/sso/config` — Configure SSO (admin only)
- `POST /api/admin/sso/test` — Test SSO connection (admin only)

### Service Methods

```typescript
// lib/services/sso-config.ts

configureSAML(orgId, provider, metadataXml, options)
// Configure SSO for organization

handleSAMLCallback(assertion, orgId)
// Process SAML assertion and authenticate user

mapSAMLAttributes(attributes, mapping)
// Map IdP attributes to user profile

testSSOConnection(configId)
// Verify SSO configuration

toggleSSO(configId, enabled)
// Enable/disable SSO

getSSOConfig(orgId)
// Retrieve SSO configuration
```

### Feature Flag

SSO requires the `sso_enabled` feature flag:

```sql
-- Check if SSO is available for organization
SELECT * FROM feature_flags
WHERE organization_id = 'xxx'
  AND feature_name = 'sso_enabled'
  AND enabled = true;
```

Enable SSO feature for enterprise customers only.

---

## Appendix

### SAML Terminology

- **IdP (Identity Provider)**: Service that authenticates users (Azure AD, Google, Okta)
- **SP (Service Provider)**: Application using SSO for authentication (s-s-m.ro)
- **SAML**: Security Assertion Markup Language
- **Assertion**: Signed XML document containing user identity information
- **ACS**: Assertion Consumer Service — endpoint that receives SAML assertions
- **Entity ID**: Unique identifier for IdP or SP
- **Metadata**: XML file describing IdP/SP configuration
- **NameID**: User identifier in SAML assertion (usually email)
- **Attribute Statement**: User attributes included in assertion
- **RelayState**: Optional parameter to maintain state during authentication

### Supported SAML Specifications

- SAML 2.0
- HTTP-POST Binding
- HTTP-Redirect Binding
- RSA-SHA256 Signature Algorithm
- X.509 Certificate-based signing

### Links & Resources

- [SAML 2.0 Specification](https://docs.oasis-open.org/security/saml/v2.0/)
- [Azure AD SAML Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/single-sign-on-saml-protocol)
- [Google Workspace SAML](https://support.google.com/a/answer/6087519)
- [Okta SAML Documentation](https://developer.okta.com/docs/concepts/saml/)

---

## Changelog

- **v1.0** (2026-02-13): Initial SSO setup guide
  - Azure AD, Google Workspace, Okta support
  - SAML 2.0 configuration
  - Attribute mapping
  - Auto-provisioning
  - Troubleshooting guide

---

**Document Version**: 1.0
**Last Updated**: 2026-02-13
**Author**: s-s-m.ro Platform Team
**Contact**: support@s-s-m.ro
