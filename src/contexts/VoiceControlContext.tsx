import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';

interface VoiceCommand {
  patterns: RegExp[];
  action: string;
  description: string;
}

interface VoiceControlContextType {
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  lastCommand: string;
  lastFeedback: string;
  startGlobalListening: () => void;
  stopGlobalListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  toggleVoice: () => void;
  sttSupported: boolean;
  ttsSupported: boolean;
}

const VoiceControlContext = createContext<VoiceControlContextType | null>(null);

export const useVoiceControl = () => {
  const ctx = useContext(VoiceControlContext);
  if (!ctx) throw new Error('useVoiceControl must be used within VoiceControlProvider');
  return ctx;
};

// Build the full voice command map — every section in the app
const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation — Main tabs
  { patterns: [/\b(go\s+)?(home|dashboard|main)\b/i], action: 'nav:dashboard', description: 'Go to dashboard' },
  { patterns: [/\b(go\s+to\s+)?track(ing)?\b/i, /\btax\s*(tracking|compliance)?\b/i], action: 'nav:tax', description: 'Open tracking' },
  { patterns: [/\b(go\s+to\s+)?emergenc(y|ies)\b/i, /\bsos\b/i], action: 'nav:emergency', description: 'Open emergency' },
  { patterns: [/\b(go\s+to\s+)?a\.?i\.?\s*(section|tools|advisors)?\b/i], action: 'nav:ai', description: 'Open AI section' },
  { patterns: [/\b(go\s+to\s+)?(my\s+)?profile\b/i], action: 'nav:profile', description: 'Open profile' },

  // Tax & Compliance
  { patterns: [/\btax\s*(residency|hub|dashboard)?\b/i], action: 'section:tax-residency', description: 'Tax residency' },
  { patterns: [/\bcountry\s*track(er|ing)?\b/i], action: 'section:tax-residency', description: 'Country tracker' },
  { patterns: [/\bvisa\s*(manager|tracking)?\b/i], action: 'section:visas', description: 'Visa manager' },
  { patterns: [/\bdocument(s)?\s*(vault|tracker)?\b/i], action: 'section:documents', description: 'Documents' },
  { patterns: [/\bgovernment\s*apps?\b/i], action: 'section:gov-apps', description: 'Government apps' },

  // Travel Essentials
  { patterns: [/\btransport(ation)?\b/i, /\bbus(es)?\b/i, /\btrain(s)?\b/i, /\bmetro\b/i], action: 'section:public-transport', description: 'Public transport' },
  { patterns: [/\btaxi(s)?\b/i, /\bride\s*(hailing|share|sharing)?\b/i, /\buber\b/i], action: 'section:taxis', description: 'Taxi services' },
  { patterns: [/\bcar\s*(rent|rental|lease)?\b/i], action: 'section:car-rent-lease', description: 'Car rental' },
  { patterns: [/\be\-?sim\b/i], action: 'section:esim', description: 'eSIM services' },
  { patterns: [/\bvpn\b/i, /\bemail\s*service\b/i], action: 'section:vpn-email', description: 'VPN & Email' },
  { patterns: [/\binsurance\b/i], action: 'section:travel-insurance', description: 'Travel insurance' },

  // AI Advisors
  { patterns: [/\b(ai\s+)?doctor\b/i, /\bhealth\s*advis(or|er)\b/i, /\bmedical\s*ai\b/i], action: 'section:ai-doctor', description: 'AI Health Advisor' },
  { patterns: [/\b(ai\s+)?lawyer\b/i, /\blegal\s*advis(or|er)\b/i, /\blegal\s*ai\b/i], action: 'section:ai-lawyer', description: 'AI Legal Advisor' },
  { patterns: [/\b(ai\s+)?planner\b/i, /\btravel\s*plan(ner|ning)?\b/i], action: 'section:ai-planner', description: 'AI Travel Planner' },
  { patterns: [/\btax\s*advis(or|ers)\b/i], action: 'section:tax-advisors', description: 'Tax advisors' },

  // Premium / Safety
  { patterns: [/\bthreat(s)?\s*(intelligence|dashboard)?\b/i], action: 'section:threats', description: 'Threat intelligence' },
  { patterns: [/\bguardian\b/i], action: 'section:guardian', description: 'SuperNomad Guardian' },
  { patterns: [/\bambass(y|ies|ador)\b/i, /\bconsulate\b/i], action: 'section:embassy', description: 'Embassy directory' },
  { patterns: [/\bsos\s*service\b/i], action: 'section:sos-services', description: 'SOS services' },
  { patterns: [/\bprivate\s*(protection|security)\b/i, /\bbodyguard\b/i], action: 'section:private-protection', description: 'Private protection' },
  { patterns: [/\bcyber\b/i, /\bhack(ed|ing)?\b/i], action: 'section:cyber-helpline', description: 'Cyber helpline' },
  { patterns: [/\bbusiness\s*cent(er|re)s?\b/i, /\bcowork(ing)?\b/i], action: 'section:business-centers', description: 'Business centers' },
  { patterns: [/\blounge(s)?\b/i, /\bairport\s*lounge\b/i], action: 'section:airport-lounges', description: 'Airport lounges' },
  { patterns: [/\bclub(s)?\b/i, /\bprivate\s*club\b/i], action: 'section:private-clubs', description: 'Private clubs' },

  // Local Living
  { patterns: [/\bcity\s*service(s)?\b/i], action: 'section:global-city-services', description: 'City services' },
  { patterns: [/\blanguage\s*(learn(ing)?|course)?\b/i], action: 'section:language-learning', description: 'Language learning' },
  { patterns: [/\blocal\s*nomad(s)?\b/i], action: 'section:local-nomads', description: 'Local nomads' },
  { patterns: [/\blocal\s*(life|events?|explore)\b/i], action: 'section:explore-local', description: 'Local events' },
  { patterns: [/\bfamily\s*service(s)?\b/i, /\bnanny\b/i, /\bbabysit(ter|ting)?\b/i], action: 'section:family-services', description: 'Family services' },
  { patterns: [/\bpet\s*service(s)?\b/i, /\bvet(erinarian)?\b/i], action: 'section:pet-services', description: 'Pet services' },
  { patterns: [/\bmoving\s*(service)?s?\b/i, /\brelocation\b/i], action: 'section:moving-services', description: 'Moving services' },
  { patterns: [/\bmarketplace\b/i, /\bbuy\s*(and|&)?\s*sell\b/i], action: 'section:marketplace', description: 'Marketplace' },
  { patterns: [/\bsocial\b/i, /\bvibe\b/i, /\bmeet\s*(people|nomads)?\b/i], action: 'section:social-chat', description: 'Social chat' },
  { patterns: [/\bpulse\b/i, /\bcommunity\s*chat\b/i], action: 'section:nomad-chat', description: 'Community pulse' },
  { patterns: [/\bnews\b/i], action: 'section:news', description: 'News' },
  { patterns: [/\bdeliver(y|ies)\b/i], action: 'section:delivery-services', description: 'Delivery services' },

  // Finance
  { patterns: [/\bdigital\s*bank(s|ing)?\b/i], action: 'section:digital-banks', description: 'Digital banks' },
  { patterns: [/\bmoney\s*transfer(s)?\b/i, /\bsend\s*money\b/i], action: 'section:money-transfers', description: 'Money transfers' },
  { patterns: [/\bcrypto\b/i, /\bdigital\s*money\b/i], action: 'section:crypto-cash', description: 'Crypto' },
  { patterns: [/\bcurrency\s*(convert(er)?|exchange)?\b/i, /\bexchange\s*rate\b/i], action: 'section:currency-converter', description: 'Currency converter' },
  { patterns: [/\bcredit\s*card(s)?\b/i, /\bemergency\s*card\b/i], action: 'section:emergency-cards', description: 'Emergency cards' },

  // Misc
  { patterns: [/\bweather\b/i, /\bforecast\b/i], action: 'section:weather', description: 'Weather' },
  { patterns: [/\bwi-?fi\b/i, /\bhotspot\b/i, /\binternet\b/i], action: 'section:wifi-finder', description: 'WiFi finder' },
  { patterns: [/\bstudent(s)?\b/i], action: 'section:students', description: 'Students' },
  { patterns: [/\broadside\b/i, /\btow(ing)?\b/i], action: 'section:roadside', description: 'Roadside assistance' },
  { patterns: [/\bsetting(s)?\b/i, /\bpreference(s)?\b/i], action: 'section:settings', description: 'Settings' },
  { patterns: [/\baward(s)?\b/i, /\bachievement(s)?\b/i], action: 'section:my-travel-awards', description: 'Awards' },
  { patterns: [/\bvaccinat(ion|e|ions)\b/i, /\bhealth\s*(record|tracker)\b/i], action: 'section:health', description: 'Vaccinations' },
  { patterns: [/\boffer(s)?\b/i, /\bdeal(s)?\b/i], action: 'section:super-offers', description: 'Super offers' },

  // Voice control meta
  { patterns: [/\bstop\s*(talking|speaking)?\b/i, /\bshut\s*up\b/i, /\bquiet\b/i, /\bsilence\b/i], action: 'voice:stop', description: 'Stop speaking' },
  { patterns: [/\b(enable|turn\s*on)\s*voice\b/i, /\bspeak\s*(to\s*me|back)\b/i], action: 'voice:enable', description: 'Enable voice responses' },
  { patterns: [/\b(disable|turn\s*off)\s*voice\b/i, /\bmute\b/i], action: 'voice:disable', description: 'Disable voice responses' },
  { patterns: [/\bwhat\s*can\s*(you|i)\s*(do|say)\b/i, /\bhelp\b/i, /\bcommands?\b/i], action: 'voice:help', description: 'List voice commands' },
];

interface VoiceControlProviderProps {
  children: React.ReactNode;
  onNavigate?: (section: string) => void;
  onTabChange?: (tab: string) => void;
}

export const VoiceControlProvider: React.FC<VoiceControlProviderProps> = ({ children, onNavigate, onTabChange }) => {
  const voice = useVoiceConversation();
  const [lastCommand, setLastCommand] = useState('');
  const [lastFeedback, setLastFeedback] = useState('');
  const onNavigateRef = useRef(onNavigate);
  const onTabChangeRef = useRef(onTabChange);

  useEffect(() => { onNavigateRef.current = onNavigate; }, [onNavigate]);
  useEffect(() => { onTabChangeRef.current = onTabChange; }, [onTabChange]);

  const processCommand = useCallback((transcript: string) => {
    const text = transcript.toLowerCase().trim();
    setLastCommand(transcript);

    for (const cmd of VOICE_COMMANDS) {
      for (const pattern of cmd.patterns) {
        if (pattern.test(text)) {
          const [type, value] = cmd.action.split(':');

          if (type === 'nav') {
            // Bottom nav tabs
            const tabMap: Record<string, string> = {
              'dashboard': 'home', 'tax': 'tracking', 'emergency': 'emergency', 'ai': 'ai', 'profile': 'profile'
            };
            const tab = tabMap[value] || 'home';
            onTabChangeRef.current?.(tab);
            const feedback = `Opening ${cmd.description}`;
            setLastFeedback(feedback);
            voice.speak(feedback);
            return;
          }

          if (type === 'section') {
            onNavigateRef.current?.(value);
            const feedback = `Opening ${cmd.description}`;
            setLastFeedback(feedback);
            voice.speak(feedback);
            return;
          }

          if (type === 'voice') {
            if (value === 'stop') {
              voice.stopSpeaking();
              setLastFeedback('Stopped speaking');
              return;
            }
            if (value === 'enable') {
              if (!voice.voiceEnabled) voice.toggleVoice();
              const feedback = 'Voice responses enabled. I will speak all responses aloud.';
              setLastFeedback(feedback);
              // Force speak even if was just enabled
              setTimeout(() => voice.speak(feedback), 100);
              return;
            }
            if (value === 'disable') {
              if (voice.voiceEnabled) voice.toggleVoice();
              setLastFeedback('Voice responses disabled');
              return;
            }
            if (value === 'help') {
              const categories = [
                'You can say: Go home, Open tracking, Emergency, AI section, Profile.',
                'Navigate to: Tax, Visa manager, Documents, eSIM, Weather, WiFi, Currency converter.',
                'AI advisors: Doctor, Lawyer, Travel planner, Tax advisor.',
                'Safety: Threats, Guardian, Embassy, SOS, Cyber helpline.',
                'Social: Community pulse, Social vibe, Marketplace, Local events.',
                'Also: Enable voice, Disable voice, Stop talking.',
              ];
              const helpText = categories.join(' ');
              setLastFeedback(helpText);
              voice.speak(helpText);
              return;
            }
          }
        }
      }
    }

    // No match found
    const feedback = `I didn't understand "${transcript}". Say "help" to hear available commands.`;
    setLastFeedback(feedback);
    voice.speak(feedback);
  }, [voice]);

  const startGlobalListening = useCallback(() => {
    voice.startListening(processCommand);
  }, [voice, processCommand]);

  return (
    <VoiceControlContext.Provider value={{
      isListening: voice.isListening,
      isSpeaking: voice.isSpeaking,
      voiceEnabled: voice.voiceEnabled,
      lastCommand,
      lastFeedback,
      startGlobalListening,
      stopGlobalListening: voice.stopListening,
      speak: voice.speak,
      stopSpeaking: voice.stopSpeaking,
      toggleVoice: voice.toggleVoice,
      sttSupported: voice.sttSupported,
      ttsSupported: voice.ttsSupported,
    }}>
      {children}
    </VoiceControlContext.Provider>
  );
};
