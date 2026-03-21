---
description: Run regression tests on critical user paths.
---

# 🤖 QA Regression Testing Workflow

This workflow ensures that recent changes haven't broken existing functionality.

### Steps:

1.  **Run Automated Tests**: Use the terminal to run the project's test suite.
    // turbo
    - `npm test` or `npm run test:e2e` (whichever is applicable).
2.  **Manual Smoke Test**:
    - Navigate to the Home page.
    - Search for a tour.
    - Add to cart / Initialize booking.
    - Verify Admin dashboard loads correctly.
3.  **Edge Case Check**:
    - Test booking with 0 participants (should show error).
    - Test booking with date in the past (should be disabled).
    - Test newsletter signup with invalid email.
4.  **Visual Regression**:
    - Compare key pages against previous screenshots if available.
    - Check for UI breaks at 375px (Mobile), 768px (Tablet), and 1440px (Desktop).
5.  **Console Error Audit**:
    - Use the browser tool to check for any Red errors in the developer console during navigation.

// turbo
6. **Cleanup**: Clear browser cache/local storage before final sign-off.
