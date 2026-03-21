---
description: Perform database schema checks and optimizations.
---

# 🗄️ Database Maintenance Workflow

This workflow ensures the data layer is optimized and clean.

### Steps:

1.  **Schema Sync Check**:
    - Compare local `supabase-schema.sql` with the remote schema (if accessible).
2.  **Index Audit**:
    - Identify tables with high read volume (e.g., `tours`).
    - Verify indexes exist on filter columns (`slug`, `category_id`, `active`).
3.  **Data Consistency Scan**:
    - Run SQL scripts to find orphans or invalid references.
    - Check for `null` values in mandatory fields.
4.  **Migration Verification**:
    - Dry-run any new SQL migrations to check for syntax errors.
    - Verify rollback scripts are present.
5.  **Performance Check**:
    - Audit query execution times for the main "List Tours" API.

// turbo
6. **Command**: Run `vacuum analyze` (if allowed by environment) to update statistics.
