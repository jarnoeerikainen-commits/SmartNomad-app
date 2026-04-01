import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.test("list_resources returns all resource types", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/gateway-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": SERVICE_ROLE_KEY },
    body: JSON.stringify({ action: "list_resources" }),
  });
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.resources.length, 9);
});

Deno.test("full partner lifecycle: create, access, revoke", async () => {
  const slug = "test-corp-" + Date.now();
  
  // Create partner
  const createRes = await fetch(`${SUPABASE_URL}/functions/v1/gateway-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": SERVICE_ROLE_KEY },
    body: JSON.stringify({ action: "create_partner", partner_name: "Test Corp", partner_slug: slug, contact_email: "test@test.com", tier: "premium" }),
  });
  const createBody = await createRes.json();
  assertEquals(createRes.status, 201);
  const apiKey = createBody.api_key;
  const partnerId = createBody.partner.id;

  // Setup full access
  const policyRes = await fetch(`${SUPABASE_URL}/functions/v1/gateway-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": SERVICE_ROLE_KEY },
    body: JSON.stringify({ action: "setup_full_access", partner_id: partnerId, anonymize_pii: true }),
  });
  const policyBody = await policyRes.json();
  assertEquals(policyRes.status, 201);
  assertEquals(policyBody.policiesCreated, 9);

  // Gateway: info
  const infoRes = await fetch(`${SUPABASE_URL}/functions/v1/supernomad-gateway/v1/info`, { headers: { "x-api-key": apiKey } });
  const infoBody = await infoRes.json();
  assertEquals(infoRes.status, 200);
  assertEquals(infoBody.partner, "Test Corp");

  // Gateway: feature_catalog
  const catRes = await fetch(`${SUPABASE_URL}/functions/v1/supernomad-gateway/v1/feature_catalog`, { headers: { "x-api-key": apiKey } });
  const catBody = await catRes.json();
  assertEquals(catRes.status, 200);
  assertEquals(catBody.success, true);

  // Gateway: platform_stats
  const statsRes = await fetch(`${SUPABASE_URL}/functions/v1/supernomad-gateway/v1/platform_stats`, { headers: { "x-api-key": apiKey } });
  const statsBody = await statsRes.json();
  assertEquals(statsRes.status, 200);

  // Revoke
  const revokeRes = await fetch(`${SUPABASE_URL}/functions/v1/gateway-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": SERVICE_ROLE_KEY },
    body: JSON.stringify({ action: "revoke_partner", partner_id: partnerId }),
  });
  await revokeRes.json();
  assertEquals(revokeRes.status, 200);

  // Verify revoked
  const rejRes = await fetch(`${SUPABASE_URL}/functions/v1/supernomad-gateway/v1/info`, { headers: { "x-api-key": apiKey } });
  await rejRes.text();
  assertEquals(rejRes.status, 403);
});

Deno.test("gateway rejects without API key", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/supernomad-gateway/v1/info`);
  await res.text();
  assertEquals(res.status, 401);
});

Deno.test("admin rejects without admin key", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/gateway-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "list_partners" }),
  });
  await res.text();
  assertEquals(res.status, 401);
});
