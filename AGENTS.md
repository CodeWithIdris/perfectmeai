# Project Architecture Decisions

- Keep the product as a client-rendered React/Vite application with React Router; this preserves the existing user-facing experience and Lovable Cloud integration.
- Store account-owned onboarding goals in `public.profiles` under the authenticated user ID with row-level ownership policies; goals must follow the user between devices.
- Gate first-run dashboard access on saved onboarding completion and keep onboarding goal editing available in account settings; this makes goal selection actionable and revisitable.