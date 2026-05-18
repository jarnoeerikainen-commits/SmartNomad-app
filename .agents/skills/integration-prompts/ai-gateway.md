# AI Gateway (ai-gateway)

## Secret
- `LOVABLE_API_KEY` (auto-provisioned in Lovable Cloud)

## Endpoints
- `POST https://ai.gateway.lovable.dev/v1/chat/completions` — OpenAI-compatible
- `POST https://ai.gateway.lovable.dev/v1/embeddings`

## Models (memory)
- `gemini-3-flash` — chat default
- `gemini-3-pro` — legal/medical/long-form
- `embedding-001` — vector store

## Pattern
Every wrapper already follows the same shape. No need to wrap with `callProvider`
because this is the core engine — but log to `ai_usage_logs` via `log_ai_usage` RPC.

## Activation prompt
> Already live. When adding a new AI feature, copy any `*-chat/index.ts` and adjust the system prompt; log usage with `log_ai_usage(device_id, function_name, model, input_tokens, output_tokens, latency_ms, cache_hit, reasoning, error)`.
