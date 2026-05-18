# Receipt OCR (receipt-ocr)

## Secret
- `LOVABLE_API_KEY` (uses AI Gateway vision)

## Already wired
`supabase/functions/receipt-ocr/index.ts` — calls Gemini with image_url.

## Output schema
`{ merchant, date, total, currency, tax, items: [{ name, qty, price }], category }`

## Activation prompt
> Already live. To extend: pass `taxJurisdiction` so the model splits VAT/GST per jurisdiction (used by Business mode & Tax Clear).
