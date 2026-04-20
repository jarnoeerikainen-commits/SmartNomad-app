// Respect Protocol — shared cultural/dietary/vice rules for AI Concierge.
// Mirror of supabase/functions/_shared/respectProtocol.ts. Keep in sync.

export interface CulturalContext {
  countryOfBirth?: string;
  continentOfBirth?: string;
  religion?: string;
  religiousObservance?: string;
  vice?: {
    alcohol?: string;
    favoriteDrinks?: string[];
    cigars?: string;
    favoriteCigarBrands?: string[];
  };
  respectMode?: {
    autoAdaptToDestination?: boolean;
    politeTone?: boolean;
    avoidTopics?: string[];
  };
}

// Conservative destinations where AI must auto-adapt (dress, alcohol public visibility, prayer)
const CONSERVATIVE_DESTINATIONS = new Set([
  'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain',
  'Iran', 'Iraq', 'Yemen', 'Afghanistan', 'Pakistan', 'Brunei', 'Maldives',
  'Indonesia', 'Malaysia', 'Bangladesh', 'Sudan', 'Mauritania', 'Algeria',
  'Libya', 'Morocco', 'Egypt', 'Jordan', 'Syria',
]);

const ALCOHOL_RESTRICTED = new Set([
  'Saudi Arabia', 'Kuwait', 'Iran', 'Libya', 'Sudan', 'Yemen', 'Afghanistan', 'Brunei',
]);

export function buildRespectProtocol(
  cultural: CulturalContext | undefined,
  destination?: { country?: string; city?: string },
  lifestyleContext?: string,
): string {
  const c = cultural || {};
  const lines: string[] = [];

  // Always-on baseline
  lines.push('**🤝 RESPECT PROTOCOL (always active):**');
  lines.push('- Be polite, warm, helpful, respectful. Treat the user with dignity at all times.');
  lines.push('- Help others, encourage good manners. Never mock cultures, religions, beliefs, or choices.');
  lines.push('- **Tobacco & cigarettes: NEVER mention, suggest, or recommend** — under any circumstance.');

  // Cigars — opt-in only
  const cigars = c.vice?.cigars;
  if (cigars && cigars !== 'never') {
    const brands = c.vice?.favoriteCigarBrands?.length ? ` Favorites: ${c.vice.favoriteCigarBrands.join(', ')}.` : '';
    lines.push(`- Cigars: user enjoys cigars (${cigars}).${brands} You may recommend cigar lounges, tobacconists, cigar-friendly bars and restaurants when relevant.`);
  } else {
    lines.push('- Cigars: do not mention unless the user explicitly asks.');
  }

  // Alcohol — profile-driven
  const alc = c.vice?.alcohol;
  const drinks = c.vice?.favoriteDrinks?.join(', ');
  if (!alc || alc === 'never' || alc === 'forbidden') {
    lines.push('- Alcohol: do NOT proactively suggest bars, champagne, wine pairings, rooftop drinks, breweries or alcohol-themed venues. If the user explicitly asks, answer factually but briefly without enthusiasm. Suggest alcohol-free alternatives where natural.');
  } else if (alc === 'rarely' || alc === 'social-only') {
    lines.push(`- Alcohol: user drinks ${alc.replace('-', ' ')}. Mention only when contextually relevant (e.g., the user asks about a restaurant, event, or rooftop). Do not push.`);
  } else {
    lines.push(`- Alcohol: user ${alc}s alcohol${drinks ? ` (favorites: ${drinks})` : ''}. Engage openly — recommend pairings, top bars, champagne lounges, rooftops, sommeliers, and curated experiences with confidence.`);
  }

  // Religion / observance
  if (c.religion && c.religion !== 'prefer-not-to-say' && c.religion !== 'atheist' && c.religion !== 'agnostic') {
    const obs = c.religiousObservance ? ` (${c.religiousObservance})` : '';
    lines.push(`- Faith: user identifies as ${c.religion}${obs}. Respect dietary laws (halal/kosher/vegetarian as applicable), prayer times, religious holidays, and modest-dress norms. Don't preach or moralize.`);
    if (c.religion === 'islam') lines.push('  · Default to halal-friendly venues. Be mindful during Ramadan (fasting hours).');
    if (c.religion === 'judaism') lines.push('  · Default to kosher-friendly options. Respect Shabbat (Friday sundown → Saturday sundown).');
    if (c.religion === 'hinduism') lines.push('  · Many Hindus avoid beef and may be vegetarian. Default to veg-friendly when uncertain.');
    if (c.religion === 'buddhism') lines.push('  · Many practitioners prefer vegetarian options.');
  }

  // Background — only used silently for context, never mentioned unless asked
  if (c.countryOfBirth || c.continentOfBirth) {
    lines.push(`- Background context (silent): user born in ${c.countryOfBirth || c.continentOfBirth}. Use to anticipate cultural references, language nuance, and homesickness moments. Do not bring up unless the user does.`);
  }

  // Avoid topics
  if (c.respectMode?.avoidTopics?.length) {
    lines.push(`- Avoid these topics unless user raises them: ${c.respectMode.avoidTopics.join(', ')}.`);
  }

  // Destination-aware adaptation (silent — only act when destination requires)
  const dest = destination?.country;
  if (dest) {
    if (CONSERVATIVE_DESTINATIONS.has(dest)) {
      lines.push(`- **Destination alert (${dest}):** conservative cultural norms — advise modest dress (especially women: covered shoulders/knees, headscarf where applicable), public behavior, photography restrictions, and prayer-time pauses for businesses. Mention only when the user's request actually intersects (e.g., packing, dining, dress code).`);
    }
    if (ALCOHOL_RESTRICTED.has(dest)) {
      lines.push(`- **Destination alert (${dest}):** alcohol is restricted or banned in public. Only suggest hotel-licensed venues or private clubs if alcohol is truly required, and warn the user about local law.`);
    }
  }

  if (lifestyleContext && lifestyleContext.trim()) {
    lines.push('');
    lines.push(lifestyleContext.trim());
  }

  return lines.join('\n');
}

export function getCulturalContextFromProfile(profile: any): CulturalContext | undefined {
  if (!profile?.cultural) return undefined;
  return profile.cultural as CulturalContext;
}
