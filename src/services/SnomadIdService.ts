// SnomadIdService — pseudonymous public identifier for users
// Format: SN-XXXX-XXXX-XXXX (Crockford base32, ~60 bits entropy)
// Used in support tickets, partner APIs, analytics — never names/emails.

import { supabase } from '@/integrations/supabase/client';

const LOCAL_KEY = 'supernomad_snomad_id';
const LOCAL_GUEST_KEY = 'supernomad_snomad_id_guest';

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // no I/L/O/U

function generateLocal(): string {
  const groups: string[] = [];
  for (let g = 0; g < 3; g++) {
    let chunk = '';
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * ALPHABET.length);
      chunk += ALPHABET[idx];
    }
    groups.push(chunk);
  }
  return `SN-${groups.join('-')}`;
}

export const SnomadIdService = {
  /** Returns the cached snomad_id for the current user (or guest). */
  getCached(): string | null {
    return localStorage.getItem(LOCAL_KEY) || localStorage.getItem(LOCAL_GUEST_KEY);
  },

  /** Generates a guest-only id (used pre-auth for support tickets, analytics). */
  getOrCreateGuest(): string {
    let id = localStorage.getItem(LOCAL_GUEST_KEY);
    if (!id) {
      id = generateLocal();
      localStorage.setItem(LOCAL_GUEST_KEY, id);
    }
    return id;
  },

  /** Fetches the authoritative snomad_id from DB for the signed-in user. */
  async fetchMine(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getCached();

      const { data, error } = await supabase
        .from('profiles')
        .select('snomad_id')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data?.snomad_id) return null;
      localStorage.setItem(LOCAL_KEY, data.snomad_id);
      return data.snomad_id;
    } catch {
      return this.getCached();
    }
  },

  /** Returns auth-user snomad_id if available, otherwise guest. Always returns something. */
  async getEffective(): Promise<string> {
    const fromDb = await this.fetchMine();
    if (fromDb) return fromDb;
    return this.getOrCreateGuest();
  },

  /** Format check */
  isValid(id: string): boolean {
    return /^SN-[0-9A-HJ-NP-TV-Z]{4}-[0-9A-HJ-NP-TV-Z]{4}-[0-9A-HJ-NP-TV-Z]{4}$/.test(id);
  },

  clearLocal() {
    localStorage.removeItem(LOCAL_KEY);
  },
};
