---
description: Perform a security scan of dependencies and configuration.
---

# 🛡️ Cybersecurity Audit Workflow

This workflow scans for vulnerabilities and misconfigurations.

### Steps:

1.  **Dependency Vulnerability Scan**:
    // turbo
    - Run `npm audit` to find known security issues in libraries.
2.  **Secret Leakage Detection**:
    - Search codebase for keywords: `key`, `secret`, `password`, `token`, `Bearer`, `sk_`.
    - Verify `.env` is in `.gitignore`.
3.  **Secure Headers Check**:
    - Inspect network headers of the live site using `read_browser_page`.
    - Look for `Content-Security-Policy`, `Strict-Transport-Security`.
4.  **Supabase RLS Policy Audit**:
    - Review `supabase-schema.sql` or run SQL queries to list all RLS policies.
    - Ensure no sensitive table has `PERMISSIVE` access without a `USING` clause.
5.  **Form Input Hygiene**:
    - Audit all `POST` or `PUT` endpoints (API routes or Supabase calls).
    - Verify input sanitization and server-side validation.

// turbo
6. **Command**: `npm audit fix` (Only if approved by the Lead Architect).
