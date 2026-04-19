// Award Card OCR Scanner — extracts loyalty program details from card photos
// Uses Lovable AI Gateway (Gemini vision) for multimodal extraction

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ScanResult {
  programName?: string;
  category?: 'airline' | 'hotel' | 'credit-card' | 'booking' | 'car-rental' | 'cruise' | 'rail' | 'coalition' | 'retail';
  memberNumber?: string;
  currentTier?: string;
  pointsBalance?: number;
  pointsCurrency?: string;
  expiryDate?: string;
  confidence: number;
  rawText?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure data URL prefix
    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const systemPrompt = `You are an OCR specialist for loyalty/award/membership cards (airlines, hotels, credit cards, car rental, cruise, rail, retail). Extract structured data from the card image.

Return ONLY valid JSON matching this exact schema:
{
  "programName": "string — full official program name e.g. 'United MileagePlus', 'Marriott Bonvoy', 'Chase Sapphire Reserve'",
  "category": "airline | hotel | credit-card | booking | car-rental | cruise | rail | coalition | retail",
  "memberNumber": "string — member/account/card number visible on card (mask the middle if long)",
  "currentTier": "string — status tier visible e.g. 'Gold', 'Platinum', 'Diamond', null if none",
  "pointsBalance": "number — only if explicitly visible, otherwise null",
  "pointsCurrency": "string — e.g. 'Miles', 'Points', 'Avios'",
  "expiryDate": "string YYYY-MM-DD — only if visible, otherwise null",
  "confidence": "number 0-1 — your confidence in the extraction"
}

Rules:
- If you cannot read the card or it is not a loyalty card, return {"confidence": 0, "programName": null}
- Never invent fields. Use null for unknowns.
- For credit cards (Visa/Mastercard/Amex), use category "credit-card" and programName like "Chase Sapphire Reserve" if a brand name is visible, otherwise the bank name.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract loyalty card details from this image. Return JSON only." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw new Error(`AI Gateway returned ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";
    let parsed: ScanResult;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { confidence: 0, rawText: content };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("award-card-scan error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
