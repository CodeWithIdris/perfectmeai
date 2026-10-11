# PerfectMe Design-System Migration and Product Flow Completion

## Outcome
Replace PerfectMe's dark terminal styling with the uploaded DocuForge light design system while preserving the communication-training product and its existing working session/report flows. The document defines a visual system, not replacement product screens, so existing PerfectMe navigation and page purposes remain; the docs-inspired persistent sidebar, readable spacing, colors, typography, and component styles are applied to them.

## Work
1. Establish the DocuForge design tokens and shared component styles: light neutral page background, white surfaces, blue primary actions, purple reserved for secondary accents, Plus Jakarta Sans/Inter/Fira Code, 8px corner system, restrained elevation, and documented spacing. Retire the dark glass, scanline, neon, and terminal-label styling.
2. Rework shared navigation and page framing for the 280px persistent desktop sidebar, mobile navigation, search affordance, consistent page headers, reusable buttons/cards/inputs/dialogs, and accessible focus, hover, disabled, and error states.
3. Restyle the landing and authentication screens without changing their purpose; add Google sign-in alongside the existing email/password flow and create an onboarding step that captures communication-improvement goals. Add a settings screen to review and edit those goals.
4. Restyle dashboard, scenario library, practice session, feedback report, and progress screens. Keep existing AI conversation, speech-to-text, session history, report generation, and chart behavior. Add loading, empty, and visible failure states where missing.
5. Complete gaps found in the current implementation: make scenario filters affect results; calculate dashboard/progress summaries and achievements from saved sessions rather than presenting sample values as real; preserve a clear report-analysis failure state instead of silently showing fabricated results; and route sidebar items to their matching screens.
6. Persist selected improvement goals per account in Lovable Cloud with user-scoped row policies. Do not change the existing practice/report schema or store roles in profile data.
7. Verify navigation, authentication-facing screens, responsive layouts, practice/report surfaces, saved-goal behavior, and the current build/test signals; record any remaining limitations.

## Technical details
- Frontend remains the existing React/Vite/React Router app. No Next.js or Node API server migration is needed for this UI work.
- Add a `public.profiles` row keyed to `auth.users(id)` only to hold the requested account-owned improvement goals and onboarding completion state. Grant authenticated table access before enabling RLS and adding self-only policies. Keep all role data separate; no roles are needed here.
- Keep calls to the existing Lovable Cloud AI functions and the current authenticated ownership model. Google OAuth configuration is part of the auth update; no auto-confirm-email behavior is introduced.
- Keep product-specific layouts (conversation transcript, live metrics, charts) while applying the DocuForge design tokens; do not turn PerfectMe into an API documentation site.

## Assumptions
- “Full swap” means replace the previous visual identity across the app, not replace PerfectMe's product structure with documentation pages.
- Onboarding is shown to accounts without a completed goals record; the selected goal set is editable later in Settings.
- Existing simulated video/body-language assessment is not represented as camera-based functionality unless already implemented; this work preserves working capabilities and does not invent that behavior.