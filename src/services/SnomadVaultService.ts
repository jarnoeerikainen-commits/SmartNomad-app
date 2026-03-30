import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/utils/deviceId';

// ═══════════════════════════════════════════════════════════
// Snomad ID — Vectorized Knowledge Graph + Identity Vault
// Web Crypto API encryption for sensitive data
// ═══════════════════════════════════════════════════════════

const VAULT_KEY_NAME = 'snomad-vault-key';

class SnomadVaultService {
  private deviceId: string;
  private cryptoKey: CryptoKey | null = null;

  constructor() {
    this.deviceId = getDeviceId();
  }

  // ─── Web Crypto Encryption ──────────────────────────────
  private async getOrCreateKey(): Promise<CryptoKey> {
    if (this.cryptoKey) return this.cryptoKey;

    const stored = localStorage.getItem(VAULT_KEY_NAME);
    if (stored) {
      const rawKey = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
      this.cryptoKey = await crypto.subtle.importKey(
        'raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']
      );
      return this.cryptoKey;
    }

    // Generate new AES-256-GCM key
    this.cryptoKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
    );
    const exported = await crypto.subtle.exportKey('raw', this.cryptoKey);
    localStorage.setItem(VAULT_KEY_NAME, btoa(String.fromCharCode(...new Uint8Array(exported))));
    return this.cryptoKey;
  }

  async encrypt(data: any): Promise<string> {
    const key = await this.getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    
    // Combine IV + ciphertext for storage
    const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(encrypted: string): Promise<any> {
    try {
      const key = await this.getOrCreateKey();
      const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch {
      console.warn('Decryption failed — data may be corrupted');
      return null;
    }
  }

  // ─── Identity Vault CRUD ────────────────────────────────
  async getProfile(): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('snomad_profiles' as any)
        .select('*')
        .eq('device_id', this.deviceId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (e) {
      console.warn('Get profile failed:', e);
      return null;
    }
  }

  async saveIdentity(identityData: {
    passports?: any[];
    visas?: any[];
    medicalId?: any;
    biometricHash?: string;
  }): Promise<boolean> {
    try {
      const encrypted = await this.encrypt(identityData);
      const { error } = await supabase
        .from('snomad_profiles' as any)
        .upsert({
          device_id: this.deviceId,
          encrypted_identity: { data: encrypted },
        } as any, { onConflict: 'device_id' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Save identity failed:', e);
      return false;
    }
  }

  async getIdentity(): Promise<any | null> {
    const profile = await this.getProfile();
    if (!profile || !(profile as any).encrypted_identity?.data) return null;
    return this.decrypt((profile as any).encrypted_identity.data);
  }

  async savePreferences(preferences: Record<string, any>): Promise<boolean> {
    try {
      const count = this.countPreferences(preferences);
      const completeness = Math.min(count / 100, 1.0); // 100 prefs = 100%

      const { error } = await supabase
        .from('snomad_profiles' as any)
        .upsert({
          device_id: this.deviceId,
          preferences: preferences,
          preference_count: count,
          completeness_score: completeness,
          last_synced_at: new Date().toISOString(),
        } as any, { onConflict: 'device_id' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Save preferences failed:', e);
      return false;
    }
  }

  private countPreferences(obj: any, depth = 0): number {
    if (depth > 5) return 0;
    let count = 0;
    for (const key in obj) {
      const val = obj[key];
      if (val === null || val === undefined || val === '') continue;
      if (Array.isArray(val)) {
        count += val.length;
      } else if (typeof val === 'object') {
        count += this.countPreferences(val, depth + 1);
      } else {
        count++;
      }
    }
    return count;
  }

  // ─── Travel History ─────────────────────────────────────
  async addTravelEntry(entry: {
    countryCode: string;
    countryName: string;
    city?: string;
    entryDate: string;
    exitDate?: string;
    purpose?: string;
    visaType?: string;
    source?: string;
    coordinates?: { lat: number; lng: number };
    notes?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('travel_history' as any)
        .insert({
          device_id: this.deviceId,
          country_code: entry.countryCode,
          country_name: entry.countryName,
          city: entry.city || null,
          entry_date: entry.entryDate,
          exit_date: entry.exitDate || null,
          purpose: entry.purpose || 'leisure',
          visa_type: entry.visaType || null,
          source: entry.source || 'manual',
          entry_coordinates: entry.coordinates ? { lat: entry.coordinates.lat, lng: entry.coordinates.lng } : null,
          notes: entry.notes || null,
        } as any);
      if (error) throw error;

      // Auto-create knowledge graph edges
      await this.createTravelEdges(entry);
      return true;
    } catch (e) {
      console.warn('Add travel entry failed:', e);
      return false;
    }
  }

  async getTravelHistory(limit = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('travel_history' as any)
        .select('*')
        .eq('device_id', this.deviceId)
        .order('entry_date', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data as any[]) || [];
    } catch {
      return [];
    }
  }

  async getTravelStats(): Promise<{
    totalCountries: number;
    totalTrips: number;
    topCountries: { code: string; name: string; visits: number }[];
    totalDaysAbroad: number;
  }> {
    const history = await this.getTravelHistory(500);
    const countryMap: Record<string, { name: string; visits: number }> = {};
    let totalDays = 0;

    for (const trip of history) {
      const code = trip.country_code;
      if (!countryMap[code]) countryMap[code] = { name: trip.country_name, visits: 0 };
      countryMap[code].visits++;

      if (trip.entry_date && trip.exit_date) {
        const days = Math.ceil(
          (new Date(trip.exit_date).getTime() - new Date(trip.entry_date).getTime()) / 86400000
        );
        totalDays += Math.max(days, 1);
      }
    }

    const topCountries = Object.entries(countryMap)
      .map(([code, data]) => ({ code, ...data }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    return {
      totalCountries: Object.keys(countryMap).length,
      totalTrips: history.length,
      topCountries,
      totalDaysAbroad: totalDays,
    };
  }

  // ─── Knowledge Graph ────────────────────────────────────
  private async createTravelEdges(entry: {
    countryCode: string;
    countryName: string;
    purpose?: string;
  }): Promise<void> {
    const edges: any[] = [];
    const sourceId = `travel-${entry.countryCode}-${Date.now()}`;

    // Travel → Tax Rule connection
    edges.push({
      device_id: this.deviceId,
      source_type: 'travel',
      source_id: sourceId,
      target_type: 'tax-rule',
      target_id: `tax-${entry.countryCode}`,
      relationship: 'triggers',
      weight: 0.9,
      metadata: { country: entry.countryCode, reason: 'Travel may affect tax residency' },
    });

    // Travel → Threat Alert connection
    edges.push({
      device_id: this.deviceId,
      source_type: 'travel',
      source_id: sourceId,
      target_type: 'threat-alert',
      target_id: `threat-${entry.countryCode}`,
      relationship: 'triggers',
      weight: 0.8,
      metadata: { country: entry.countryCode, reason: 'Check security advisories' },
    });

    // Travel → Visa Requirement connection
    edges.push({
      device_id: this.deviceId,
      source_type: 'travel',
      source_id: sourceId,
      target_type: 'visa-requirement',
      target_id: `visa-${entry.countryCode}`,
      relationship: 'requires',
      weight: 0.85,
      metadata: { country: entry.countryCode },
    });

    // Travel → Health Alert connection
    edges.push({
      device_id: this.deviceId,
      source_type: 'travel',
      source_id: sourceId,
      target_type: 'health-alert',
      target_id: `health-${entry.countryCode}`,
      relationship: 'triggers',
      weight: 0.7,
      metadata: { country: entry.countryCode, reason: 'Check vaccination requirements' },
    });

    try {
      await supabase.from('knowledge_graph_edges' as any).insert(edges as any);
    } catch (e) {
      console.warn('Create travel edges failed:', e);
    }
  }

  async getKnowledgeGraphEdges(sourceType?: string, limit = 50): Promise<any[]> {
    try {
      let query = supabase
        .from('knowledge_graph_edges' as any)
        .select('*')
        .eq('device_id', this.deviceId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (sourceType) {
        query = query.eq('source_type', sourceType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as any[]) || [];
    } catch {
      return [];
    }
  }

  async traverseGraph(sourceType: string, sourceId: string, maxDepth = 2): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('traverse_knowledge_graph', {
        p_device_id: this.deviceId,
        p_source_type: sourceType,
        p_source_id: sourceId,
        p_max_depth: maxDepth,
      } as any);
      if (error) throw error;
      return (data as any[]) || [];
    } catch {
      return [];
    }
  }

  // ─── Sync local profile to vault ────────────────────────
  async syncLocalProfileToVault(): Promise<boolean> {
    try {
      // Read from all localStorage profile sources
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const enhancedProfile = JSON.parse(localStorage.getItem('enhancedProfile') || '{}');
      const conciergePrefs = JSON.parse(localStorage.getItem('concierge_prefs') || '{}');
      const trackedCountries = JSON.parse(localStorage.getItem('trackedCountries') || '[]');

      const preferences = {
        ...userProfile,
        ...enhancedProfile,
        concierge: conciergePrefs,
        trackedCountries: trackedCountries.map((c: any) => ({
          code: c.code, name: c.name, days: c.daysSpent
        })),
      };

      await this.savePreferences(preferences);

      // Sync identity data if available
      const passportData = enhancedProfile?.passports || userProfile?.passportCountries;
      if (passportData) {
        await this.saveIdentity({
          passports: Array.isArray(passportData) ? passportData : [passportData],
        });
      }

      console.log('🔐 Snomad ID synced to vault');
      return true;
    } catch (e) {
      console.warn('Vault sync failed:', e);
      return false;
    }
  }

  // ─── Vault Stats ────────────────────────────────────────
  async getVaultStats(): Promise<{
    preferenceCount: number;
    completenessScore: number;
    travelEntries: number;
    graphEdges: number;
    lastSynced: string | null;
  }> {
    const profile = await this.getProfile();
    const travelHistory = await this.getTravelHistory(1000);
    const edges = await this.getKnowledgeGraphEdges(undefined, 1000);

    return {
      preferenceCount: (profile as any)?.preference_count || 0,
      completenessScore: (profile as any)?.completeness_score || 0,
      travelEntries: travelHistory.length,
      graphEdges: edges.length,
      lastSynced: (profile as any)?.last_synced_at || null,
    };
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}

export const snomadVaultService = new SnomadVaultService();
