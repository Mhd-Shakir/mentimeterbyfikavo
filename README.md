# Mentimeter by Fikavo

A zero-budget Mentimeter-style realtime quiz and presentation app built with Next.js App Router, Supabase PostgreSQL, Supabase Realtime, Tailwind CSS, and Framer Motion.

## Quick Start

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill in your project URL and anon key.
4. Install dependencies with `npm install`.
5. Start the app with `npm run dev`.

## Core Routes

- `/` - presenter landing and session entry
- `/dashboard` - create and manage presentations
- `/present/[id]` - presenter live screen with room code, QR, chart, leaderboard, and controls
- `/join` - mobile-first participant join form
- `/room/[code]` - participant waiting room, live quiz, and feedback screens

## Realtime Model

- Presenter flow updates `presentations.current_slide_index` and broadcasts `slide-change` on `room:{room_code}`.
- Participants listen for broadcast events and PostgreSQL changes on the live presentation row.
- Participants track active users with Supabase Presence on the room channel.
- Responses are inserted into `responses`; presenter charts subscribe to database changes for live tallying.
