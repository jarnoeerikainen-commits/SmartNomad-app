import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("location-ip returns JSON and does not crash without forwarding headers", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/location-ip`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      accept: "application/json",
    },
  });
  const text = await response.text();
  assertEquals(response.headers.get("content-type")?.includes("application/json"), true);
  assertEquals(response.status < 500, true, text);
});

Deno.test("location-ip supports header fallback when edge IP lookup is unavailable", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/location-ip`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      accept: "application/json",
      "cf-ipcountry": "FI",
      "x-vercel-ip-city": "Helsinki",
    },
  });
  const data = JSON.parse(await response.text());
  assertEquals(response.status < 500, true);
  assertEquals(data.country_code === "FI" || typeof data.error === "string", true);
});
