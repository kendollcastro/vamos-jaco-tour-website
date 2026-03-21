---
description: Perform a full SEO and Accessibility Audit on a specific page.
---

# 🔍 SEO & Accessibility Audit Workflow

This workflow performs a comprehensive scan of a page to check for SEO best practices and accessibility compliance.

### Steps:

1.  **Identify Page URL**: Determine the local or production URL to audit (e.g., `http://localhost:4321/tours/jaco-surf-lesson`).
2.  **Run Accessibility Audit**:
    -   Use `read_browser_page` to inspect the DOM.
    -   Check for missing `alt` tags on images.
    -   Verify heading hierarchy (no skipped levels).
    -   Check for `aria-label` on interactive elements without text.
3.  **Run SEO Audit**:
    -   Check `<title>` length (50-60 chars) and relevance.
    -   Check `<meta description>` length (150-160 chars).
    -   Check for Canonical tags and Social Media (OG/Twitter) tags.
    -   Verify structured data (JSON-LD) is present and follows `@type` rules.
4.  **Performance Check**:
    -   Audit image sizes and formats (WebP preferred).
    -   Identify blocking scripts.
5.  **Report Findings**: Generate a report with "Critical", "Warning", and "Passed" sections.

// turbo
6. **Command**: `npm run build && npm run preview` (To test production-ready state if needed)
