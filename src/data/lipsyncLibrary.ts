/**
 * Lip-Sync Video Library
 * 
 * Pre-generated lip-sync videos mapped to common concierge phrases.
 * Videos are generated via ElevenLabs Omnihuman 1.5 or similar lip-sync API,
 * then stored as publicly accessible URLs.
 * 
 * The system matches AI responses to pre-generated clips by keyword/phrase
 * and plays the video instead of the CSS animation avatar.
 */

export interface LipsyncClip {
  id: string;
  /** Trigger keywords/phrases that activate this clip */
  triggers: string[];
  /** Category for organization */
  category: 'greeting' | 'farewell' | 'help' | 'travel' | 'weather' | 'safety' | 'general';
  /** Video URL for female avatar (Sofia) */
  femaleVideoUrl: string;
  /** Video URL for male avatar (Marcus) */
  maleVideoUrl: string;
  /** Duration in seconds */
  durationSeconds: number;
  /** Spoken text in the video */
  spokenText: string;
  /** Language code */
  language: string;
  /** Priority (higher = preferred when multiple clips match) */
  priority: number;
}

/**
 * Pre-generated lip-sync clips library.
 * 
 * To add clips:
 * 1. Generate TTS audio via ElevenLabs
 * 2. Feed audio + avatar image into Omnihuman 1.5 (ElevenLabs Image & Video)
 * 3. Upload resulting MP4 to a hosting service
 * 4. Add entry here with the public URL
 * 
 * Or use the lipsync-generator edge function for programmatic generation.
 */
export const LIPSYNC_CLIPS: LipsyncClip[] = [
  // These are placeholder entries — replace URLs with actual generated videos
  {
    id: 'greeting-welcome',
    triggers: ['welcome', 'hello', 'hi there', 'hey', 'good morning', 'good afternoon', 'good evening'],
    category: 'greeting',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 4,
    spokenText: "Hi there! I'm your personal travel concierge. How can I help you today?",
    language: 'en',
    priority: 10,
  },
  {
    id: 'greeting-welcome-back',
    triggers: ['welcome back', 'back again', 'good to see you'],
    category: 'greeting',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 5,
    spokenText: "Welcome back! Great to see you again. What can I help you with today?",
    language: 'en',
    priority: 9,
  },
  {
    id: 'farewell-goodbye',
    triggers: ['goodbye', 'bye', 'see you', 'take care', 'good night'],
    category: 'farewell',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 4,
    spokenText: "Safe travels! Don't hesitate to reach out if you need anything.",
    language: 'en',
    priority: 10,
  },
  {
    id: 'help-flights',
    triggers: ['find flights', 'book a flight', 'flight search', 'cheapest flights', 'airline'],
    category: 'travel',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 6,
    spokenText: "I'd love to help you find the perfect flight! Let me know your destination, dates, and preferences.",
    language: 'en',
    priority: 8,
  },
  {
    id: 'help-hotels',
    triggers: ['find hotel', 'book hotel', 'accommodation', 'where to stay', 'hostel', 'airbnb'],
    category: 'travel',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 5,
    spokenText: "Looking for accommodation? Tell me the city, your budget, and must-haves — I'll find the best options!",
    language: 'en',
    priority: 8,
  },
  {
    id: 'help-visa',
    triggers: ['visa', 'visa requirements', 'do i need a visa', 'entry requirements'],
    category: 'travel',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 5,
    spokenText: "Let me check the visa requirements for you. Which country are you planning to visit?",
    language: 'en',
    priority: 8,
  },
  {
    id: 'help-weather',
    triggers: ['weather', 'temperature', 'rain', 'forecast', 'climate'],
    category: 'weather',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 4,
    spokenText: "I can check the weather for any destination. Which city would you like to know about?",
    language: 'en',
    priority: 7,
  },
  {
    id: 'help-safety',
    triggers: ['is it safe', 'safety', 'danger', 'crime', 'emergency', 'sos'],
    category: 'safety',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 5,
    spokenText: "Safety is my top priority. Let me pull up the latest intelligence for your location.",
    language: 'en',
    priority: 9,
  },
  {
    id: 'help-insurance',
    triggers: ['travel insurance', 'insurance', 'health insurance', 'coverage'],
    category: 'travel',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 5,
    spokenText: "Travel insurance is essential! Let me compare the best options based on your trip details.",
    language: 'en',
    priority: 7,
  },
  {
    id: 'help-esim',
    triggers: ['esim', 'sim card', 'mobile data', 'internet abroad', 'roaming'],
    category: 'travel',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 5,
    spokenText: "I can recommend the best eSIM options for your destination. Staying connected is key!",
    language: 'en',
    priority: 7,
  },
  {
    id: 'help-tax',
    triggers: ['tax', 'tax residency', 'tax tracking', 'schengen', 'days count'],
    category: 'travel',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 5,
    spokenText: "Tax tracking is crucial for digital nomads. Let me review your current residency status.",
    language: 'en',
    priority: 8,
  },
  {
    id: 'general-thinking',
    triggers: ['let me think', 'one moment', 'checking', 'searching'],
    category: 'general',
    femaleVideoUrl: '',
    maleVideoUrl: '',
    durationSeconds: 3,
    spokenText: "Let me look into that for you right away...",
    language: 'en',
    priority: 5,
  },
];

/**
 * Find the best matching lip-sync clip for a given AI response text.
 * Returns null if no suitable match found.
 */
export function findMatchingClip(
  responseText: string,
  face: 'female' | 'male',
  language = 'en'
): LipsyncClip | null {
  const text = responseText.toLowerCase();
  
  const candidates = LIPSYNC_CLIPS
    .filter(clip => {
      // Must have a video URL for the selected face
      const url = face === 'female' ? clip.femaleVideoUrl : clip.maleVideoUrl;
      if (!url) return false;
      
      // Must match language
      if (clip.language !== language) return false;
      
      // Must match at least one trigger
      return clip.triggers.some(trigger => text.includes(trigger.toLowerCase()));
    })
    .sort((a, b) => {
      // Sort by priority (higher first), then by number of trigger matches
      if (b.priority !== a.priority) return b.priority - a.priority;
      
      const aMatches = a.triggers.filter(t => text.includes(t.toLowerCase())).length;
      const bMatches = b.triggers.filter(t => text.includes(t.toLowerCase())).length;
      return bMatches - aMatches;
    });
  
  return candidates[0] || null;
}

/**
 * Get a custom lip-sync video from localStorage registry.
 * Users can add custom videos via the management interface.
 */
export function getCustomClips(): LipsyncClip[] {
  try {
    const stored = localStorage.getItem('supernomad_custom_lipsync_clips');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save a custom lip-sync clip to localStorage.
 */
export function saveCustomClip(clip: LipsyncClip): void {
  const existing = getCustomClips();
  const updated = existing.filter(c => c.id !== clip.id);
  updated.push(clip);
  localStorage.setItem('supernomad_custom_lipsync_clips', JSON.stringify(updated));
}

/**
 * Remove a custom lip-sync clip.
 */
export function removeCustomClip(clipId: string): void {
  const existing = getCustomClips();
  const updated = existing.filter(c => c.id !== clipId);
  localStorage.setItem('supernomad_custom_lipsync_clips', JSON.stringify(updated));
}

/**
 * Find matching clip from both built-in and custom libraries.
 */
export function findBestClip(
  responseText: string,
  face: 'female' | 'male',
  language = 'en'
): LipsyncClip | null {
  // Check custom clips first (user-generated take priority)
  const customClips = getCustomClips();
  const allClips = [...customClips, ...LIPSYNC_CLIPS];
  
  const text = responseText.toLowerCase();
  
  const candidates = allClips
    .filter(clip => {
      const url = face === 'female' ? clip.femaleVideoUrl : clip.maleVideoUrl;
      if (!url) return false;
      if (clip.language !== language) return false;
      return clip.triggers.some(trigger => text.includes(trigger.toLowerCase()));
    })
    .sort((a, b) => b.priority - a.priority);
  
  return candidates[0] || null;
}
