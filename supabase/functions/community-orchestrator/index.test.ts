import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test('community orchestrator source is token optimized by mode', async () => {
  const source = await Deno.readTextFile(new URL('./index.ts', import.meta.url));
  assertEquals(source.includes("mode === 'quick_replies' ? 'google/gemini-2.5-flash-lite'"), true);
  assertEquals(source.includes("max_tokens: mode === 'ai_nudge' ? 110"), true);
});