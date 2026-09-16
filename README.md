# Goga & Lika wedding invitation

React / TanStack Start invitation hosted on Vercel, with Supabase RSVP and wishes.

## Database configuration

Copy `.env.example` to `.env.local`. Set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` from the **same confirmed active project**. The key may
be a public anon JWT or an `sb_publishable_` key. Never put a service-role or
secret key in a `VITE_` variable.

Set the same two variables in Vercel for each intended deployment environment,
then rebuild. Vite embeds these values at build time; changing settings alone
will not update an existing deployment. No template database fallback exists.
Browser, SSR and auth middleware all use this single configuration.

`SUPABASE_SERVICE_ROLE_KEY` is optional and server-only. If server admin
operations are used, this key must belong to that same project. The server
client no longer substitutes a public key when an admin key is missing.

## Diagnose schema mismatches

Run `supabase/diagnose.sql` in the confirmed project's SQL editor. It only reads
schema, constraints, policies and grants, without retrieving guest records.
The current form contract expects:

- `rsvps`: `id`, `created_at`, `guest_name`, `attending`, `plus_one`, `plus_one_name`.
- `wishes`: `id`, `created_at`, `message`.

A `42703` response means a requested column is absent. Confirm the project and
actual schema before changing field mappings or applying a migration. Do not
disable RLS or enable public guest-list reads to fix an insert error.
The existing admin password screen is client-side only; it is not database
authorization. Admin read permissions require a separate server-enforced policy.

The CLI `supabase/config.toml` project ID is a local identifier. Link any remote
project explicitly only after confirming its project reference.

## Development and checks

```sh
npm install
npm run dev
node --test tests/supabase-config.test.mjs
npx tsc --noEmit
npm run build
```

Node 24 is used for the TypeScript configuration tests. Build validation rejects
missing public variables, privileged public keys and mismatched legacy JWT refs.
Opaque publishable keys must be verified against their project in Supabase.

This repository is connected to Lovable. Preserve published git history.
