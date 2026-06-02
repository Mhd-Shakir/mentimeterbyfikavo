import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(url, serviceKey);

async function checkPolicies() {
  const { data, error } = await supabase.rpc('get_policies', {});
  if (error) {
    console.log("RPC failed, trying raw query...", error);
    // Alternatively just do a direct query if we have postgres access, but supabase JS client can't query system tables directly.
  }
}

checkPolicies();
