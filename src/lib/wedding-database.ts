import { supabase } from "@/integrations/supabase/client";

/** Keep wedding forms and the admin view on the app's active Lovable Cloud database. */
export const weddingDatabase = supabase;
