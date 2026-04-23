// Concierge Memory Distillation System
// Stores durable preferences learned from conversations

const MEMORY_KEY = 'concierge_memory';
const MAX_MEMORIES = 100;

export interface MemoryEntry {
  id: string;
  fact: string;
  category: 'travel' | 'food' | 'accommodation' | 'transport' | 'health' | 'work' | 'family' | 'finance' | 'lifestyle' | 'general';
  durability: 'transient' | 'durable';
  learnedAt: string;
  source: string; // what conversation context produced this
}

export function getMemories(): MemoryEntry[] {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addMemory(entry: Omit<MemoryEntry, 'id' | 'learnedAt'>): void {
  const memories = getMemories();
  // Deduplicate by similar fact
  const exists = memories.some(m => m.fact.toLowerCase() === entry.fact.toLowerCase());
  if (exists) return;

  memories.push({
    ...entry,
    id: crypto.randomUUID?.() || Date.now().toString(),
    learnedAt: new Date().toISOString(),
  });

  // Keep only the most recent MAX_MEMORIES
  if (memories.length > MAX_MEMORIES) {
    memories.splice(0, memories.length - MAX_MEMORIES);
  }

  localStorage.setItem(MEMORY_KEY, JSON.stringify(memories));
}

export function clearMemories(): void {
  localStorage.removeItem(MEMORY_KEY);
}

/**
 * Builds a concise text summary of all learned memories for the AI context
 */
export function getMemoryContext(): string {
  const memories = getMemories().filter(m => m.durability === 'durable');
  if (memories.length === 0) return '';

  const grouped: Record<string, string[]> = {};
  for (const m of memories) {
    if (!grouped[m.category]) grouped[m.category] = [];
    grouped[m.category].push(m.fact);
  }

  let context = '**🧠 LEARNED USER PREFERENCES (from past conversations):**\n';
  for (const [cat, facts] of Object.entries(grouped)) {
    context += `- **${cat}:** ${facts.join('; ')}\n`;
  }
  return context;
}

/**
 * Gathers comprehensive app state for the AI to be fully synced
 */
export function gatherFullAppContext(): Record<string, any> {
  const context: Record<string, any> = {};

  // Enhanced profile
  try {
    const ep = localStorage.getItem('enhancedProfile');
    if (ep) context.enhancedProfile = JSON.parse(ep);
  } catch { }

  // User profile (basic)
  try {
    const up = localStorage.getItem('userProfile');
    if (up) context.userProfile = JSON.parse(up);
  } catch { }

  // Tracked countries
  try {
    const tc = localStorage.getItem('trackedCountries');
    if (tc) {
      const countries = JSON.parse(tc);
      if (countries.length > 0) {
        context.trackedCountries = countries.map((c: any) => ({
          name: c.name,
          code: c.code,
          daysSpent: c.daysSpent,
          dayLimit: c.dayLimit,
          yearlyDaysSpent: c.yearlyDaysSpent,
          status: c.daysSpent >= c.dayLimit ? 'LIMIT_REACHED' : c.daysSpent >= c.dayLimit * 0.8 ? 'WARNING' : 'OK'
        }));
      }
    }
  } catch { }

  // Demo calendar
  try {
    const cal = localStorage.getItem('demoCalendar');
    if (cal) context.calendar = JSON.parse(cal);
  } catch { }

  // Subscription tier
  try {
    const sub = localStorage.getItem('subscription');
    if (sub) {
      const parsed = JSON.parse(sub);
      context.subscriptionTier = parsed.tier;
      context.aiRequestsRemaining = parsed.aiRequestsRemaining;
    }
  } catch { }

  // Expenses — Phase 1: legacy localStorage fallback (kept for offline drafts).
  // The richer Supabase-backed summary is hydrated asynchronously by the
  // Concierge context builder via ExpenseHubService.getConciergeSummary().
  try {
    const exp = localStorage.getItem('expenses');
    if (exp) {
      const expenses = JSON.parse(exp);
      if (expenses.length > 0) {
        const total = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
        const categories = [...new Set(expenses.map((e: any) => e.category))];
        context.expenseSummary = { totalExpenses: expenses.length, totalAmount: total, categories };
      }
    }
  } catch { }

  // Concierge learned memories
  const memoryContext = getMemoryContext();
  if (memoryContext) context.learnedMemories = memoryContext;

  return context;
}

/**
 * Builds a compact text summary of the full profile for AI context injection
 */
export function buildProfileSummary(profile: any): string {
  if (!profile) return '';
  const parts: string[] = [];

  // Core
  const core = profile.core?.personal;
  if (core) {
    const items: string[] = [];
    if (core.firstName) items.push(`Name: ${core.firstName} ${core.lastName || ''}`);
    if (core.age) items.push(`Age: ${core.age}`);
    if (core.bio) items.push(`Bio: ${core.bio}`);
    if (items.length) parts.push(`**Identity:** ${items.join(', ')}`);
  }

  // Professional
  const pro = profile.lifestyle?.professional;
  if (pro) {
    const items: string[] = [];
    if (pro.jobTitle) items.push(pro.jobTitle);
    if (pro.company) items.push(`at ${pro.company}`);
    if (pro.industry) items.push(`(${pro.industry})`);
    if (pro.incomeBracket) items.push(`Income: ${pro.incomeBracket}`);
    if (items.length) parts.push(`**Work:** ${items.join(' ')}`);
  }

  // Family
  const fam = profile.lifestyle?.family;
  if (fam) {
    const items: string[] = [];
    if (fam.maritalStatus) items.push(`Status: ${fam.maritalStatus}`);
    if (fam.dependents?.children) items.push(`${fam.dependents.children} children (ages: ${fam.dependents.ages?.join(', ') || 'unknown'})`);
    if (items.length) parts.push(`**Family:** ${items.join(', ')}`);
  }

  // Travel
  const travel = profile.travel?.preferences;
  if (travel) {
    const items: string[] = [];
    if (travel.favoriteDestinations?.cities?.length) items.push(`Favorites: ${travel.favoriteDestinations.cities.join(', ')}`);
    if (travel.budget?.transportation) items.push(`Flight class: ${travel.budget.transportation}`);
    if (travel.budget?.accommodation) items.push(`Hotels: ${travel.budget.accommodation}`);
    if (travel.travelStyle?.purpose?.length) items.push(`Style: ${travel.travelStyle.purpose.join(', ')}`);
    if (items.length) parts.push(`**Travel:** ${items.join(', ')}`);
  }

  // Aviation & Hotels (from demo persona enhanced profile)
  if (profile.aviation) {
    const items: string[] = [];
    if (profile.aviation.preferredAirlines?.length) items.push(`Airlines: ${profile.aviation.preferredAirlines.join(', ')}`);
    if (profile.aviation.seatPreference) items.push(`Seat: ${profile.aviation.seatPreference}`);
    if (profile.aviation.mealPreference) items.push(`Meal: ${profile.aviation.mealPreference}`);
    if (items.length) parts.push(`**Aviation:** ${items.join(', ')}`);
  }

  if (profile.hotels) {
    const items: string[] = [];
    if (profile.hotels.preferredChains?.length) items.push(`Chains: ${profile.hotels.preferredChains.join(', ')}`);
    if (profile.hotels.roomPreference) items.push(`Room: ${profile.hotels.roomPreference}`);
    if (items.length) parts.push(`**Hotels:** ${items.join(', ')}`);
  }

  // Personal preferences
  const personal = profile.personal;
  if (personal) {
    const items: string[] = [];
    if (personal.sports?.active?.length) items.push(`Sports: ${personal.sports.active.join(', ')}`);
    if (personal.dietary?.favoriteCuisines?.length) items.push(`Cuisines: ${personal.dietary.favoriteCuisines.join(', ')}`);
    if (personal.dietary?.alcoholPreference) items.push(`Drinks: ${personal.dietary.alcoholPreference}`);
    if (personal.dietary?.cookingHabits) items.push(`Eating: ${personal.dietary.cookingHabits}`);
    if (items.length) parts.push(`**Lifestyle:** ${items.join(', ')}`);
  }

  // Accommodation must-haves
  if (profile.personal?.accommodation?.amenities?.length) {
    parts.push(`**Must-haves:** ${profile.personal.accommodation.amenities.join(', ')}`);
  }

  // Rewards
  if (profile.rewards) {
    const items: string[] = [];
    if (profile.rewards.programs?.length) {
      items.push(profile.rewards.programs.map((p: any) => `${p.name}: ${p.tier}`).join(', '));
    }
    if (items.length) parts.push(`**Loyalty:** ${items.join(', ')}`);
  }

  return parts.length > 0 ? parts.join('\n') : '';
}
