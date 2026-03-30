import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ═══════════════════════════════════════════════════════════
// Snomad Orchestrator — Cross-Feature AI Logic
// When a travel event occurs, auto-trigger connected features
// ═══════════════════════════════════════════════════════════

interface OrchestratorRequest {
  deviceId: string;
  eventType: 'travel-entry' | 'flight-booking' | 'visa-change' | 'location-change';
  payload: {
    countryCode: string;
    countryName: string;
    city?: string;
    date?: string;
    purpose?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OrchestratorRequest = await req.json();
    const { deviceId, eventType, payload } = body;

    if (!deviceId || !eventType || !payload?.countryCode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: deviceId, eventType, payload.countryCode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: Record<string, any> = {};

    // 1. Tax Day Impact Analysis
    const taxAnalysis = analyzeTaxImpact(payload.countryCode, eventType);
    results.taxImpact = taxAnalysis;

    // 2. Threat Intelligence Check
    const threatCheck = await checkThreats(supabase, deviceId, payload.countryCode);
    results.threatLevel = threatCheck;

    // 3. Visa Requirement Check
    const visaCheck = analyzeVisaRequirements(payload.countryCode, payload.purpose);
    results.visaStatus = visaCheck;

    // 4. Health Advisory
    const healthAdvisory = getHealthAdvisory(payload.countryCode);
    results.healthAdvisory = healthAdvisory;

    // 5. Store orchestration result as knowledge graph edges
    const edgeId = `orch-${eventType}-${payload.countryCode}-${Date.now()}`;
    const edges = [];

    if (taxAnalysis.riskLevel !== 'none') {
      edges.push({
        device_id: deviceId,
        source_type: eventType,
        source_id: edgeId,
        target_type: 'tax-alert',
        target_id: `tax-alert-${payload.countryCode}`,
        relationship: 'triggers',
        weight: taxAnalysis.riskLevel === 'high' ? 1.0 : 0.6,
        metadata: { analysis: taxAnalysis },
      });
    }

    if (threatCheck.level !== 'low') {
      edges.push({
        device_id: deviceId,
        source_type: eventType,
        source_id: edgeId,
        target_type: 'security-alert',
        target_id: `security-${payload.countryCode}`,
        relationship: 'triggers',
        weight: threatCheck.level === 'critical' ? 1.0 : 0.7,
        metadata: { threat: threatCheck },
      });
    }

    if (edges.length > 0) {
      await supabase.from('knowledge_graph_edges').insert(edges);
    }

    // 6. Log AI usage
    await supabase.rpc('log_ai_usage', {
      p_device_id: deviceId,
      p_function_name: 'snomad-orchestrator',
      p_model: 'rule-engine',
      p_input_tokens: 0,
      p_output_tokens: 0,
      p_latency_ms: 0,
      p_cache_hit: false,
      p_reasoning: `Orchestrated ${eventType} for ${payload.countryCode}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        eventType,
        country: payload.countryCode,
        orchestrationResults: results,
        edgesCreated: edges.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Orchestrator error:', error);
    return new Response(
      JSON.stringify({ error: 'Orchestration failed', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ─── Tax Impact Analysis ──────────────────────────────────
function analyzeTaxImpact(countryCode: string, eventType: string): {
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  message: string;
  daysThreshold?: number;
} {
  const highTaxCountries: Record<string, { threshold: number; note: string }> = {
    US: { threshold: 183, note: 'Substantial Presence Test applies' },
    GB: { threshold: 183, note: 'UK Statutory Residence Test' },
    DE: { threshold: 183, note: 'German tax residency rules' },
    FR: { threshold: 183, note: 'French tax domicile rules' },
    ES: { threshold: 183, note: 'Spanish tax residency' },
    PT: { threshold: 183, note: 'Portuguese NHR program may apply' },
    IT: { threshold: 183, note: 'Italian tax residency' },
    AU: { threshold: 183, note: 'Australian residency test' },
    CA: { threshold: 183, note: 'Canadian deemed resident rules' },
    JP: { threshold: 183, note: 'Japanese tax residency' },
    TH: { threshold: 180, note: 'Thai tax residency threshold' },
    AE: { threshold: 183, note: 'UAE tax residency (no income tax)' },
  };

  const countryInfo = highTaxCountries[countryCode];
  if (!countryInfo) {
    return { riskLevel: 'low', message: `No specific tax alert for ${countryCode}` };
  }

  return {
    riskLevel: eventType === 'travel-entry' ? 'medium' : 'high',
    message: countryInfo.note,
    daysThreshold: countryInfo.threshold,
  };
}

// ─── Threat Intelligence ──────────────────────────────────
async function checkThreats(
  supabase: any,
  deviceId: string,
  countryCode: string
): Promise<{ level: string; alerts: string[] }> {
  // Check knowledge graph for existing threat data
  const { data: existingEdges } = await supabase
    .from('knowledge_graph_edges')
    .select('metadata')
    .eq('device_id', deviceId)
    .eq('target_type', 'security-alert')
    .eq('is_active', true)
    .limit(5);

  const highRiskCountries = ['AF', 'IQ', 'SY', 'YE', 'SO', 'LY', 'SS', 'CF', 'ML', 'BF'];
  const mediumRiskCountries = ['VE', 'HT', 'MM', 'PK', 'NG', 'CD', 'ET', 'SD', 'UA', 'RU'];

  if (highRiskCountries.includes(countryCode)) {
    return { level: 'critical', alerts: ['Active conflict zone', 'Travel advisory: Do not travel', 'Embassy registration recommended'] };
  }
  if (mediumRiskCountries.includes(countryCode)) {
    return { level: 'elevated', alerts: ['Exercise increased caution', 'Register with embassy', 'Monitor local news'] };
  }
  return { level: 'low', alerts: ['Standard precautions apply'] };
}

// ─── Visa Requirements ────────────────────────────────────
function analyzeVisaRequirements(countryCode: string, purpose?: string): {
  visaRequired: boolean;
  notes: string[];
} {
  // Simplified — in production this queries a real visa database
  const visaFreeForEU = ['FR', 'DE', 'ES', 'IT', 'PT', 'NL', 'BE', 'AT', 'GR', 'SE', 'DK', 'FI', 'IE', 'CZ', 'PL', 'HR', 'RO', 'BG', 'HU', 'SK', 'SI', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU'];
  const schengenCountries = ['FR', 'DE', 'ES', 'IT', 'PT', 'NL', 'BE', 'AT', 'GR', 'SE', 'DK', 'FI', 'CZ', 'PL', 'HR', 'HU', 'SK', 'SI', 'LT', 'LV', 'EE', 'MT', 'LU', 'NO', 'IS', 'CH', 'LI'];
  
  const notes: string[] = [];
  if (schengenCountries.includes(countryCode)) {
    notes.push('Schengen zone: 90/180 day rule applies');
    if (purpose === 'digital-nomad') notes.push('Digital nomad visa may be available');
  }

  return {
    visaRequired: !visaFreeForEU.includes(countryCode),
    notes: notes.length > 0 ? notes : ['Check visa requirements for your passport'],
  };
}

// ─── Health Advisory ──────────────────────────────────────
function getHealthAdvisory(countryCode: string): {
  vaccines: string[];
  warnings: string[];
} {
  const tropicalCountries = ['TH', 'VN', 'KH', 'LA', 'MM', 'ID', 'PH', 'MY', 'IN', 'LK', 'BD', 'NP', 'KE', 'TZ', 'UG', 'GH', 'NG', 'SN', 'BR', 'CO', 'PE', 'EC', 'BO'];
  const malariaRisk = ['KE', 'TZ', 'UG', 'GH', 'NG', 'SN', 'IN', 'KH', 'LA', 'MM'];

  const vaccines: string[] = [];
  const warnings: string[] = [];

  if (tropicalCountries.includes(countryCode)) {
    vaccines.push('Hepatitis A & B', 'Typhoid');
    warnings.push('Drink bottled water only');
  }
  if (malariaRisk.includes(countryCode)) {
    vaccines.push('Malaria prophylaxis recommended');
    warnings.push('Use insect repellent and mosquito nets');
  }

  return { vaccines, warnings };
}
