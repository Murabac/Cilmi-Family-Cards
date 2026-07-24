# CILMI Family Cards

Clean, swipeable **person cards** with a light 3D connection view. Live data from Supabase.

## Features

- Full-name person card with photo (or initials), description, city/occupation
- **WhatsApp** + **Call** buttons from `phone_number`
- Swipe left/right between siblings (or connected family)
- Horizontal **Connected** rail: father, siblings, children
- Light 3D neighborhood showing linked people

## Run

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Requires `SUPABASE_SERVICE_ROLE_KEY` (or anon with SELECT) for `reer_sh_yoonis.profiles`.

## Deploy on Netlify

1. Connect the GitHub repo and leave build command as `npm run build` (see `netlify.toml`).
2. In **Site settings → Environment variables**, add:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `NEXT_PUBLIC_SUPABASE_SCHEMA` | `reer_sh_yoonis` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server API) |

3. Redeploy after saving env vars. Do **not** set publish directory to `out` or `dist` — the Next.js plugin handles it.
