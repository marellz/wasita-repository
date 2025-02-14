import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

const supabase = createClient<Database>(url, anonKey)

export default supabase
