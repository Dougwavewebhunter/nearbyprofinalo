# NearbyPro Current React Project Upgrade

This ZIP is designed for your **current GitHub repo** that has `src/`, `public/`, `supabase/`, `package.json`, `vite.config.ts`, and Tailwind config files.

## Very important
Do **not** delete the whole repo and do not upload the ZIP file itself.

## What to do in GitHub
1. Extract this ZIP on your computer.
2. Open the extracted folder.
3. Upload/replace these folders/files into your existing GitHub repo:
   - `src/`
   - `supabase/`
   - `public/`
   - `index.html`
   - `package.json`
   - `package-lock.json`
   - `tailwind.config.ts`
   - `vite.config.ts`
   - all config files included in the ZIP
4. Keep your repo as a React/Vite project.
5. Commit changes.
6. Netlify should auto-deploy.

## What NOT to remove
Keep the project structure. Do not remove:
- `src/`
- `public/`
- `supabase/`
- `package.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `tsconfig*.json`
- `.gitignore`

## What changed
- Upgraded current React/Vite app instead of replacing it with static HTML.
- Added large South African service category and subcategory list.
- Added IT Services and many more service industries.
- Added Post Job button in the header and hero.
- Added posted jobs page and job detail page.
- Added live job ticker with date/time and click-through.
- Added South Africa location dropdown.
- Improved Become a Pro flow: new account first, existing user sign-in second.
- Added first-account-created-becomes-admin logic in Supabase migration.
- Added admin email auto-promote for douglaswebhunter@gmail.com if the account exists.
- Added provider moderation: approve, flag, hide/remove.
- Added admin advert manager with upload, preview, size, slot, tier, scheduling and active toggle.
- Added desktop advert rail auto-rotation.
- Added platform-only chat polishing and quick replies.
- Removed public WhatsApp/phone buttons from provider profile actions.
- Added footer: Web app designed by www.webdevpro.co.za and +27 81 215 9792.

## Supabase migration
After GitHub deploy, check Supabase migrations. If Lovable/Netlify does not auto-run migrations, run this SQL file manually in Supabase SQL Editor:

`supabase/migrations/20260503201500_stage7_react_upgrade.sql`

This migration adds:
- first account admin setup
- more categories/subcategories
- advert creative storage bucket
- ad scheduling fields
- provider moderation fields
- admin role for douglaswebhunter@gmail.com if that user already exists

## Netlify settings
For this React/Vite project, Netlify should normally use:
- Build command: `npm run build`
- Publish directory: `dist`

Do not use `/` as publish directory for this React project.

## Admin login
1. Create/sign in with your admin email on the live site.
2. If it is the first account ever created in Supabase, it becomes admin automatically.
3. If the account already exists, the migration also promotes `douglaswebhunter@gmail.com` to admin.
4. Login through the shield icon or `/admin-login`.

Your password is not stored in code for safety.
