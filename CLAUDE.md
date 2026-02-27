# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run in browser
npm run lint        # Run ESLint
```

## Architecture Overview

**Unit313** is a React Native/Expo networking platform for three user roles: **Investor**, **Entrepreneur**, and **Job Seeker**. The backend is Supabase (PostgreSQL + Auth + Storage).

### Routing

Uses **Expo Router** (file-based routing):
- `app/index.tsx` — Auth gate: redirects to login or tabs based on session state
- `app/(auth)/` — Login and register screens
- `app/(tabs)/` — Main app (tab navigation): home feed, explore, createPost, postDetails, profileScreen, roleSelection

### Role System

Three roles stored as boolean columns on the `profiles` table (`is_investor`, `is_jobseeker`, `is_entrepreneur`). A user can have multiple roles.

- `services/fetchUserRole.ts` — Fetches the user's roles from Supabase
- `services/fetchContentRole.ts` — Filters posts by role:
  - Investors → "Investment" posts
  - Job Seekers → "Hiring" posts
  - Entrepreneurs → "Job Seeking" posts
- `constants/roleOptions.ts` — Role option definitions
- `types/databaseUserRole.ts` — Role interface type

### Database (Supabase)

Migrations are in `supabase/migrations/`. Key tables:
- `profiles` — Base user profile (name, avatar, bio, role booleans)
- `posts` — Content with category: `"Investment" | "Hiring" | "Job Seeking"`
- `investor`, `jobseeker`, `entrepreneur` — Role-specific tables (1:1 with profiles)
- `applications`, `investments`, `notifications` — Supporting tables

Supabase client is initialized in `lib/supabase.ts`. Environment variables: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY` (prefixed `EXPO_PUBLIC_` for Expo to expose them client-side).

### UI Layer

- **GlueStack UI** — Primary component library (themed components from `@gluestack-ui/*`)
- **Lucide React Native** — Icons
- `utils/useShowToast.tsx` — Custom hook for toast notifications via GlueStack
- `constants/theme.ts` — Color and font constants
- `hooks/use-color-scheme.ts` — Dark/light theme detection

### File Uploads

Uses Expo APIs (`expo-document-picker`, `expo-image-picker`, `expo-file-system`) to pick files, encode to base64, then upload to Supabase Storage buckets. Profile screen (`profileScreen.tsx`) handles role-specific uploads:
- Job Seekers → resume PDF → `resume_url` on `jobseeker` table
- Entrepreneurs → business plan PDF → `business_plan_url` on `entrepreneur` table

### Import Paths

TypeScript path alias `@/*` maps to the project root:
```ts
import { supabase } from '@/lib/supabase'
import { fetchUserRole } from '@/services/fetchUserRole'
```

### State Management

No Redux or global state library — local `useState`/`useEffect` per screen. Screens use `useFocusEffect` (from Expo Router) to refresh data when navigating back to a screen.

### Key Complex Files

- `app/(tabs)/profileScreen.tsx` — Role-based profile view + file uploads
- `app/(tabs)/createPost.tsx` — Post creation with image uploads and milestones
- `app/(tabs)/postDetails.tsx` — Post detail with image carousel
- `app/(tabs)/index.tsx` — Home feed
