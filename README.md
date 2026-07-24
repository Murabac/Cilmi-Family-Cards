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
