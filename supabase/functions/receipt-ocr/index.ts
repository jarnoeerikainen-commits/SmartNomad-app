// Receipt OCR via Lovable AI Gateway (Gemini 3 vision).
// Takes a receipts/{deviceId}/{file} storage path, returns structured expense fields.
// Demo-safe: never throws on missing data — returns best-effort with confidence.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-device-id",
};

const SYSTEM_PROMPT = `You are an expert receipt OCR engine for a global tax & expense system.
Extract structured data from receipt images. Be precise. If a field is unreadable, return null.
Currency must be ISO 4217 (USD, EUR, GBP, JPY, etc).
Date must be ISO 8601 (YYYY-MM-DD).
Category must be one of: flight, hotel, meal, transport, fuel, parking, tolls, phone, internet, supplies, entertainment, conference, training, gift, other.
VAT/GST/sales tax: extract amount and rate when shown separately.
Return ONLY a JSON object via the tool call.`;

interface OcrResponse {
  ok: boolean;
  ocrModel: string;
  confidence: number;
  extracted: {
    vendor: string | null;
    vendor_country_code: string | null;
    expense_date: string | null;
    amount: number | null;
    currency: string | null;
    category: string;
    description: string | null;
    vat_amount: number | null;
    vat_rate: number | null;
    supplier_vat_id: string | null;
    payment_method: string | null;
    line_items: Array<{ description: string; amount: number }>;
  };
  raw?: unknown;
  error?: string;
}

async function fetchImageAsDataUrl(
  supabaseUrl: string,
  serviceKey: string,
  storagePath: string,
): Promise<{ dataUrl: string; mimeType: string }> {
  const url = `${supabaseUrl}/storage/v1/object/receipts/${storagePath}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
  });
  if (!res.ok) throw new Error(`Storage fetch failed (${res.status})`);
  const mimeType = res.headers.get("content-type") || "image/jpeg";
  const bytes = new Uint8Array(await res.arrayBuffer());
  // base64-encode in chunks to avoid call-stack overflow
  let b64 = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    b64 += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return { dataUrl: `data:${mimeType};base64,${btoa(b64)}`, mimeType };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!SUPABASE_URL || !SERVICE_KEY || !LOVABLE_API_KEY) {
      throw new Error("Server misconfigured: missing env vars");
    }

    const body = await req.json().catch(() => ({}));
    const storagePath: string | undefined = body.storage_path;
    const dataUrlInput: string | undefined = body.data_url;
    if (!storagePath && !dataUrlInput) {
      return new Response(JSON.stringify({ ok: false, error: "storage_path or data_url required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { dataUrl } = dataUrlInput
      ? { dataUrl: dataUrlInput }
      : await fetchImageAsDataUrl(SUPABASE_URL, SERVICE_KEY, storagePath!);

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract this receipt." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_receipt",
            description: "Return structured receipt data.",
            parameters: {
              type: "object",
              properties: {
                vendor: { type: ["string", "null"] },
                vendor_country_code: { type: ["string", "null"], description: "ISO 3166-1 alpha-2" },
                expense_date: { type: ["string", "null"], description: "YYYY-MM-DD" },
                amount: { type: ["number", "null"], description: "Total amount including tax" },
                currency: { type: ["string", "null"], description: "ISO 4217" },
                category: {
                  type: "string",
                  enum: ["flight","hotel","meal","transport","fuel","parking","tolls","phone","internet","supplies","entertainment","conference","training","gift","other"],
                },
                description: { type: ["string", "null"] },
                vat_amount: { type: ["number", "null"] },
                vat_rate: { type: ["number", "null"], description: "Percentage, e.g. 20" },
                supplier_vat_id: { type: ["string", "null"] },
                payment_method: { type: ["string", "null"] },
                confidence: { type: "number", description: "0..1" },
                line_items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      description: { type: "string" },
                      amount: { type: "number" },
                    },
                    required: ["description", "amount"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["category", "confidence", "line_items"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "extract_receipt" } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ ok: false, error: "Rate limited — please try again." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ ok: false, error: "AI credits exhausted." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      return new Response(JSON.stringify({ ok: false, error: "OCR engine error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ai = await aiRes.json();
    const toolCall = ai?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = toolCall?.function?.arguments;
    const parsed = argsStr ? JSON.parse(argsStr) : {};

    const result: OcrResponse = {
      ok: true,
      ocrModel: "google/gemini-3-flash-preview",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
      extracted: {
        vendor: parsed.vendor ?? null,
        vendor_country_code: parsed.vendor_country_code ?? null,
        expense_date: parsed.expense_date ?? null,
        amount: parsed.amount ?? null,
        currency: parsed.currency ?? null,
        category: parsed.category ?? "other",
        description: parsed.description ?? null,
        vat_amount: parsed.vat_amount ?? null,
        vat_rate: parsed.vat_rate ?? null,
        supplier_vat_id: parsed.supplier_vat_id ?? null,
        payment_method: parsed.payment_method ?? null,
        line_items: Array.isArray(parsed.line_items) ? parsed.line_items : [],
      },
      raw: parsed,
    };

    return new Response(JSON.stringify(result), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("receipt-ocr error:", e);
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
