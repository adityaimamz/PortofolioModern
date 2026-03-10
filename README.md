# Portfolio Modern

An interactive portfolio built with Next.js, featuring 3D/animated UI, bilingual content, and an AI Digital Twin powered by RAG (Retrieval-Augmented Generation).

## Feature Summary

- Modern portfolio landing page with animation and 3D components.
- Multi-language UI content (Indonesian/English).
- AI Digital Twin chat that answers based on your portfolio knowledge base.
- Admin panel for secure login (JWT `httpOnly` cookie), knowledge management, single/bulk document ingestion, and chat session monitoring.
- Supabase (`pgvector`) integration for RAG vector search.
- GitHub contribution calendar integration.
- Sentry integration for error monitoring.

## Tech Stack (Current)

- Framework: Next.js 16, React 19, TypeScript.
- Styling: Tailwind CSS.
- UI/Animation: Framer Motion, Lottie, Lucide, React Icons.
- 3D: Three.js, `@react-three/fiber`, `@react-three/drei`, `three-globe`.
- AI: Vercel AI SDK (`ai`, `@ai-sdk/google`) with Gemini models.
- Database: Supabase + PostgreSQL + `pgvector`.
- Admin Auth: JWT (`jose`) + bcrypt hash.
- Deployment: Vercel.

## Main Project Structure

- `app/`: Next.js App Router (public pages, admin pages, API routes).
- `components/`: Portfolio UI components and admin components.
- `context/`: Global context (including language context).
- `services/`: External service integrations (for example GitHub).
- `lib/`: Auth, rate limit, and utility helpers.
- `supabase/migrations/`: SQL migrations for vector documents and chat logs.
- `messages/`: Translation resources (`en.json`, `id.json`).

## Important API Endpoints

- Public: `POST /api/chat` (main AI chat endpoint, RAG + logging).
- Public: `GET /api/github` (GitHub contribution data).
- Admin (protected by proxy/JWT):
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `POST /api/admin/ingest`
- `POST /api/admin/ingest-bulk`
- `GET /api/admin/knowledge`
- `DELETE /api/admin/knowledge/[id]`
- `POST /api/admin/knowledge/bulk-delete`
- `GET /api/admin/chats`
- `GET /api/admin/chats/[sessionId]`

## Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=

# Admin Auth
JWT_SECRET=minimum_32_characters
ADMIN_PASSWORD_HASH=

# Legacy fallback (optional, not recommended)
ADMIN_PASSWORD=

# Profile branding (optional)
NEXT_PUBLIC_PROFILE_NAME=Portfolio Owner
PUBLIC_PROFILE_NAME=Portfolio Owner
NEXT_PUBLIC_AI_TWIN_NAME=Portfolio Owner AI Twin

# GitHub (optional, for /api/github endpoint)
GITHUB_READ_USER_TOKEN_PERSONAL=
```

Notes:
- `ADMIN_PASSWORD_HASH` is safer than plain text `ADMIN_PASSWORD`.
- Generate password hash using the built-in script (see Scripts section).

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Prepare env file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local
```

If `.env.example` is not available, create `.env.local` manually using the template above.

3. Generate admin password hash:

```bash
npm run hash-password -- "StrongPassword123"
```

4. Run Supabase SQL migrations (via Supabase SQL Editor) in order:

- `supabase/migrations/01_init_pgvector.sql`
- `supabase/migrations/02_chat_logs.sql`

5. Start development server:

```bash
npm run dev
```

6. Open the app:

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Scripts

- `npm run dev`: run development mode.
- `npm run build`: build for production.
- `npm run start`: run production build.
- `npm run lint`: run Next.js lint.
- `npm run deploy`: deploy to Vercel (`vercel --prod`).
- `npm run hash-password -- <password>`: generate bcrypt hash for `ADMIN_PASSWORD_HASH`.

## AI RAG Flow (Short)

1. User sends a message to `/api/chat`.
2. System generates query embedding (Gemini embedding).
3. Similarity search is performed against `documents` (`pgvector`, `match_documents` function).
4. Retrieved context is injected into the system prompt.
5. Gemini model generates the response.
6. Chat messages are logged into `chat_logs`.

## Security Notes

- `/admin/*` and `/api/admin/*` are protected by `proxy.ts` using JWT cookies.
- Admin login has rate limiting (5 attempts per 15 minutes per IP).
- Auth cookies are set with `httpOnly`, `sameSite=lax`, and `secure` in production.

## Deployment

Recommended deployment target: Vercel.

1. Import the repository into Vercel.
2. Set all required environment variables.
3. Ensure Supabase migrations are applied.
4. Deploy.

## Developer Note

- In some environments, `npm run lint` may have configuration issues. For quick type validation, use:

```bash
npx tsc --noEmit
```
