include .env

gen-types:
	npx supabase gen types typescript --project-id ${VITE_PROJECT_ID} --schema public > src/types/supabase.ts
