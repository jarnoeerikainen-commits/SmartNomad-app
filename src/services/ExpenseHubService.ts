// ExpenseHubService — single client surface for the Tax & Expense system.
// Handles trips, expenses, receipts, OCR invocation, per-diem & VAT lookups,
// CSV/PDF export, and concierge-friendly summaries.
//
// Note: this is the new Phase-1+2 service. The legacy ExpenseService.ts is
// kept for backward compatibility with older components.

import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/utils/deviceId";

export type ExpenseCategory =
  | "flight" | "hotel" | "meal" | "transport" | "mileage" | "daily_allowance"
  | "fuel" | "parking" | "tolls" | "phone" | "internet" | "supplies"
  | "entertainment" | "conference" | "training" | "gift" | "other";

export type ExpenseSource = "manual" | "ocr" | "wallet" | "email" | "bank_feed" | "agentic_payment" | "import";

export type ExpenseStatus =
  | "draft" | "confirmed" | "submitted" | "approved" | "rejected"
  | "reimbursed" | "reclaim_pending" | "reclaimed";

export interface ExpenseRow {
  id: string;
  user_id: string | null;
  device_id: string;
  trip_id: string | null;
  expense_date: string;
  amount: number;
  currency: string;
  amount_home: number | null;
  home_currency: string | null;
  fx_rate: number | null;
  category: ExpenseCategory;
  description: string;
  vendor: string | null;
  vendor_country_code: string | null;
  payment_method: string | null;
  vat_amount: number;
  vat_rate: number | null;
  supplier_vat_id: string | null;
  vat_reclaimable: boolean;
  vat_reclaim_pct: number;
  is_business: boolean;
  business_percentage: number;
  source: ExpenseSource;
  source_ref: string | null;
  receipt_id: string | null;
  status: ExpenseStatus;
  reclaim_status: string;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ExpenseTripRow {
  id: string;
  user_id: string | null;
  device_id: string;
  title: string;
  purpose: "business" | "personal" | "mixed";
  business_percentage: number;
  primary_country_code: string | null;
  countries: string[];
  start_date: string;
  end_date: string;
  per_diem_mode: boolean;
  per_diem_country_code: string | null;
  status: "active" | "closed" | "submitted" | "reimbursed";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PerDiemRate {
  id: string;
  country_code: string;
  country_name: string;
  city: string | null;
  year: number;
  lodging_rate: number;
  meals_rate: number;
  incidentals_rate: number;
  daily_total: number;
  currency: string;
  source: string;
  source_url: string;
  notes: string | null;
}

export interface VatRule {
  id: string;
  country_code: string;
  country_name: string;
  category: string;
  standard_vat_rate: number;
  reclaim_pct: number;
  conditions: string | null;
  source: string;
  source_url: string;
}

export interface OfficialMileageRate {
  id: string;
  country_code: string;
  year: number;
  rate_per_km: number | null;
  rate_per_mile: number | null;
  currency: string;
  source: string;
  source_url: string;
}

export const TERMS_VERSION = "1.0.0";

export const TERMS_TEXT = `**SuperNomad Tax & Expense — Terms of Use**

1. **No tax advice.** SuperNomad provides software and reference data only. We are not a CPA, tax attorney, or financial advisor. Always consult a licensed professional in your jurisdiction.
2. **Reference data accuracy.** Per diem, mileage, and VAT rates are sourced from official government publications, but may lag behind the latest official changes. Each rate displays its source URL and fetch date — verify against the source before filing.
3. **Your records, your responsibility.** You alone are responsible for the accuracy of expense entries, receipt retention (typically 7+ years), and timely filing.
4. **Liability.** SuperNomad is not liable for missed deductions, rejected reclaims, audit findings, penalties, or any direct or indirect damages arising from use of this software.
5. **Privacy.** Receipts and expense data are stored encrypted and never sold. You can export or delete your data at any time.

By tapping "I agree", you acknowledge and accept these terms.`;

class ExpenseHubServiceImpl {
  private get deviceId() { return getDeviceId(); }

  async hasAcceptedTerms(): Promise<boolean> {
    const { data } = await supabase
      .from("expense_terms_acceptance")
      .select("id")
      .eq("terms_version", TERMS_VERSION)
      .limit(1)
      .maybeSingle();
    return !!data;
  }

  async acceptTerms(): Promise<void> {
    const { data: userRes } = await supabase.auth.getUser();
    await supabase.from("expense_terms_acceptance").insert({
      device_id: this.deviceId,
      user_id: userRes?.user?.id ?? null,
      terms_version: TERMS_VERSION,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  }

  // ─── Trips ───────────────────────────────────────────────
  async listTrips(): Promise<ExpenseTripRow[]> {
    const { data, error } = await supabase
      .from("expense_trips")
      .select("*")
      .order("start_date", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ExpenseTripRow[];
  }

  async createTrip(input: Partial<ExpenseTripRow> & { title: string; start_date: string; end_date: string }): Promise<ExpenseTripRow> {
    const { data: userRes } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("expense_trips")
      .insert({
        device_id: this.deviceId,
        user_id: userRes?.user?.id ?? null,
        title: input.title,
        start_date: input.start_date,
        end_date: input.end_date,
        purpose: input.purpose ?? "business",
        business_percentage: input.business_percentage ?? 100,
        primary_country_code: input.primary_country_code ?? null,
        countries: input.countries ?? [],
        per_diem_mode: input.per_diem_mode ?? false,
        per_diem_country_code: input.per_diem_country_code ?? null,
        notes: input.notes ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return data as ExpenseTripRow;
  }

  async deleteTrip(id: string): Promise<void> {
    const { error } = await supabase.from("expense_trips").delete().eq("id", id);
    if (error) throw error;
  }

  // ─── Expenses ────────────────────────────────────────────
  async listExpenses(opts: { tripId?: string | null; from?: string; to?: string; limit?: number } = {}): Promise<ExpenseRow[]> {
    let q = supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    if (opts.tripId) q = q.eq("trip_id", opts.tripId);
    if (opts.from) q = q.gte("expense_date", opts.from);
    if (opts.to) q = q.lte("expense_date", opts.to);
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as ExpenseRow[];
  }

  async createExpense(input: Partial<ExpenseRow> & { amount: number; currency: string; expense_date: string; category: ExpenseCategory }): Promise<ExpenseRow> {
    const { data: userRes } = await supabase.auth.getUser();
    const payload = {
      device_id: this.deviceId,
      user_id: userRes?.user?.id ?? null,
      trip_id: input.trip_id ?? null,
      expense_date: input.expense_date,
      amount: input.amount,
      currency: input.currency,
      amount_home: input.amount_home ?? null,
      home_currency: input.home_currency ?? null,
      fx_rate: input.fx_rate ?? null,
      category: input.category,
      description: input.description ?? "",
      vendor: input.vendor ?? null,
      vendor_country_code: input.vendor_country_code ?? null,
      payment_method: input.payment_method ?? null,
      vat_amount: input.vat_amount ?? 0,
      vat_rate: input.vat_rate ?? null,
      supplier_vat_id: input.supplier_vat_id ?? null,
      vat_reclaimable: input.vat_reclaimable ?? false,
      vat_reclaim_pct: input.vat_reclaim_pct ?? 0,
      is_business: input.is_business ?? true,
      business_percentage: input.business_percentage ?? 100,
      source: input.source ?? "manual",
      source_ref: input.source_ref ?? null,
      receipt_id: input.receipt_id ?? null,
      status: input.status ?? "draft",
      tags: input.tags ?? [],
      metadata: input.metadata ?? {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("expenses") as any)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    await this.audit(data!.id, "expense.created", null, data);
    return data as ExpenseRow;
  }

  async updateExpense(id: string, patch: Partial<ExpenseRow>): Promise<ExpenseRow> {
    const before = await supabase.from("expenses").select("*").eq("id", id).single();
    const { data, error } = await supabase
      .from("expenses").update(patch as never).eq("id", id).select().single();
    if (error) throw error;
    await this.audit(id, "expense.updated", before.data, data);
    return data as ExpenseRow;
  }

  async deleteExpense(id: string): Promise<void> {
    const before = await supabase.from("expenses").select("*").eq("id", id).single();
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
    await this.audit(id, "expense.deleted", before.data, null);
  }

  private async audit(expenseId: string | null, action: string, before: unknown, after: unknown) {
    const { data: userRes } = await supabase.auth.getUser();
    await supabase.from("expense_audit_log").insert({
      device_id: this.deviceId,
      user_id: userRes?.user?.id ?? null,
      expense_id: expenseId,
      action,
      before_state: before as never,
      after_state: after as never,
    });
  }

  // ─── Receipts + OCR ──────────────────────────────────────
  async uploadReceiptAndOCR(file: File): Promise<{ receiptId: string; extracted: Record<string, unknown>; confidence: number }> {
    const { data: userRes } = await supabase.auth.getUser();
    const ownerSeg = userRes?.user?.id ?? this.deviceId;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${ownerSeg}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (upErr) throw upErr;

    const { data: receiptRow, error: insErr } = await supabase
      .from("expense_receipts").insert({
        device_id: this.deviceId,
        user_id: userRes?.user?.id ?? null,
        storage_path: path,
        mime_type: file.type || "image/jpeg",
        file_size_bytes: file.size,
        ocr_status: "processing",
      }).select().single();
    if (insErr) throw insErr;

    let extracted: Record<string, unknown> = {};
    let confidence = 0;
    try {
      const { data: ocrRes, error: ocrErr } = await supabase.functions.invoke("receipt-ocr", {
        body: { storage_path: path },
      });
      if (ocrErr) throw ocrErr;
      extracted = ocrRes?.extracted ?? {};
      confidence = ocrRes?.confidence ?? 0;
      await supabase.from("expense_receipts").update({
        ocr_status: ocrRes?.ok ? "done" : "failed",
        ocr_extracted: extracted as never,
        ocr_raw: ocrRes?.raw as never,
        ocr_confidence: confidence,
        ocr_model: ocrRes?.ocrModel,
        ocr_completed_at: new Date().toISOString(),
      }).eq("id", receiptRow.id);
    } catch (e) {
      console.error("OCR failed:", e);
      await supabase.from("expense_receipts").update({ ocr_status: "failed" }).eq("id", receiptRow.id);
    }

    return { receiptId: receiptRow.id, extracted, confidence };
  }

  async getReceiptSignedUrl(storagePath: string): Promise<string | null> {
    const { data } = await supabase.storage.from("receipts").createSignedUrl(storagePath, 3600);
    return data?.signedUrl ?? null;
  }

  // ─── Reference data ──────────────────────────────────────
  async getPerDiem(countryCode: string, opts: { city?: string; year?: number } = {}): Promise<PerDiemRate | null> {
    const year = opts.year ?? new Date().getFullYear();
    if (opts.city) {
      const { data } = await supabase.from("per_diem_rates").select("*")
        .eq("country_code", countryCode).eq("year", year).eq("city", opts.city).maybeSingle();
      if (data) return data as PerDiemRate;
    }
    const { data: fb } = await supabase.from("per_diem_rates").select("*")
      .eq("country_code", countryCode).eq("year", year).is("city", null).limit(1).maybeSingle();
    return (fb as PerDiemRate) ?? null;
  }

  async listPerDiem(): Promise<PerDiemRate[]> {
    const { data } = await supabase.from("per_diem_rates").select("*").order("country_code");
    return (data ?? []) as PerDiemRate[];
  }

  async getVatRule(countryCode: string, category: string): Promise<VatRule | null> {
    const { data } = await supabase.from("vat_reclaim_rules").select("*")
      .eq("country_code", countryCode).eq("category", category).maybeSingle();
    return (data as VatRule) ?? null;
  }

  async listVatRules(): Promise<VatRule[]> {
    const { data } = await supabase.from("vat_reclaim_rules").select("*").order("country_code");
    return (data ?? []) as VatRule[];
  }

  async getMileageRate(countryCode: string, year?: number): Promise<OfficialMileageRate | null> {
    const y = year ?? new Date().getFullYear();
    const { data } = await supabase.from("mileage_rates_official").select("*")
      .eq("country_code", countryCode).eq("year", y).eq("vehicle_type", "car").maybeSingle();
    return (data as OfficialMileageRate) ?? null;
  }

  // ─── Aggregations ────────────────────────────────────────
  async getStats(opts: { from?: string; to?: string } = {}): Promise<{
    total: number; business: number; personal: number;
    reclaimableVAT: number; byCategory: Record<string, number>;
    byCountry: Record<string, number>; count: number;
  }> {
    const expenses = await this.listExpenses({ from: opts.from, to: opts.to });
    const byCategory: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    let total = 0, business = 0, personal = 0, reclaimableVAT = 0;
    for (const e of expenses) {
      const home = Number(e.amount_home ?? e.amount);
      total += home;
      const bizPart = home * (e.business_percentage / 100);
      business += bizPart;
      personal += home - bizPart;
      reclaimableVAT += Number(e.vat_amount) * (e.vat_reclaim_pct / 100);
      byCategory[e.category] = (byCategory[e.category] ?? 0) + home;
      const country = e.vendor_country_code || "UNKNOWN";
      byCountry[country] = (byCountry[country] ?? 0) + home;
    }
    return {
      total: Math.round(total * 100) / 100,
      business: Math.round(business * 100) / 100,
      personal: Math.round(personal * 100) / 100,
      reclaimableVAT: Math.round(reclaimableVAT * 100) / 100,
      byCategory, byCountry, count: expenses.length,
    };
  }

  // ─── Auto-sync from agentic wallet ───────────────────────
  async syncFromWallet(): Promise<{ created: number; skipped: number }> {
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes?.user?.id) return { created: 0, skipped: 0 };

    const { data: txs } = await supabase
      .from("agentic_transactions")
      .select("*")
      .eq("user_id", userRes.user.id)
      .eq("status", "completed")
      .order("settled_at", { ascending: false })
      .limit(100);
    if (!txs?.length) return { created: 0, skipped: 0 };

    const { data: existing } = await supabase
      .from("expenses")
      .select("source_ref")
      .eq("source", "agentic_payment");
    const seen = new Set((existing ?? []).map((r: { source_ref: string | null }) => r.source_ref).filter(Boolean));

    let created = 0, skipped = 0;
    for (const tx of txs) {
      if (seen.has(tx.id)) { skipped++; continue; }
      const cat = mapAgenticCategory(tx.category);
      try {
        await this.createExpense({
          expense_date: (tx.settled_at as string).split("T")[0],
          amount: Number(tx.amount),
          currency: tx.currency,
          category: cat,
          description: tx.description,
          vendor: tx.merchant ?? null,
          payment_method: `Agentic ${tx.protocol}`,
          source: "agentic_payment",
          source_ref: tx.id,
          status: "confirmed",
          metadata: { agentic_protocol: tx.protocol, ai_initiated: tx.ai_initiated },
        });
        created++;
      } catch (e) {
        console.error("syncFromWallet insert failed", e);
        skipped++;
      }
    }
    return { created, skipped };
  }

  // ─── Export ──────────────────────────────────────────────
  expensesToCSV(rows: ExpenseRow[]): string {
    const headers = [
      "Date","Vendor","Country","Category","Amount","Currency","HomeAmount","HomeCurrency",
      "VAT","VATRate%","VATReclaimable%","Business%","Description","Source","Status","TripId",
    ];
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push([
        r.expense_date, r.vendor, r.vendor_country_code, r.category,
        r.amount, r.currency, r.amount_home ?? "", r.home_currency ?? "",
        r.vat_amount, r.vat_rate ?? "", r.vat_reclaim_pct,
        r.business_percentage, r.description, r.source, r.status, r.trip_id ?? "",
      ].map(escape).join(","));
    }
    return lines.join("\n");
  }

  downloadCSV(rows: ExpenseRow[], filename = "expenses.csv") {
    const csv = this.expensesToCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  // ─── Concierge intent ────────────────────────────────────
  detectExpenseIntent(text: string): { isExpense: boolean; action?: "summary" | "add" | "scan" | "trips" } {
    const t = text.toLowerCase();
    if (/(expense|receipt|reimburs|per ?diem|vat|tax deduct|business trip cost)/i.test(t)) {
      if (/(scan|photo|camera|upload)/i.test(t)) return { isExpense: true, action: "scan" };
      if (/(add|new|log)/i.test(t)) return { isExpense: true, action: "add" };
      if (/(trip|journey)/i.test(t)) return { isExpense: true, action: "trips" };
      return { isExpense: true, action: "summary" };
    }
    return { isExpense: false };
  }
}

function mapAgenticCategory(c: string): ExpenseCategory {
  const map: Record<string, ExpenseCategory> = {
    booking: "hotel", dining: "meal", transport: "transport",
    subscription: "supplies", shopping: "supplies", wellness: "other",
    concierge: "other", "data-query": "other", "api-call": "other",
    "micro-payment": "other",
  };
  return map[c] ?? "other";
}

export const ExpenseHubService = new ExpenseHubServiceImpl();
