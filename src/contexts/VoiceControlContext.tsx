import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';
import { useLanguage } from '@/contexts/LanguageContext';

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
// Supports English + multilingual patterns for key commands
const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation — Main tabs (multilingual)
  { patterns: [/\b(go\s+)?(home|dashboard|main)\b/i, /\b(inicio|panel|tablero)\b/i, /\b(accueil|tableau)\b/i, /\b(startseite|hauptseite)\b/i, /\b(ホーム|ダッシュボード)\b/i, /\b(홈|대시보드)\b/i, /\b(главная|панель)\b/i, /\b(início|painel)\b/i, /\b(الرئيسية)\b/i, /\b(ana\s*sayfa)\b/i, /\b(首页|主页)\b/i, /\b(होम)\b/i], action: 'nav:dashboard', description: 'Go to dashboard' },
  { patterns: [/\b(go\s+to\s+)?track(ing)?\b/i, /\btax\s*(tracking|compliance)?\b/i, /\b(rastreo|seguimiento)\b/i, /\b(suivi|tracking)\b/i, /\b(追跡|トラッキング)\b/i, /\b(추적)\b/i, /\b(отслеживание)\b/i, /\b(rastreamento)\b/i, /\b(التتبع)\b/i, /\b(takip)\b/i, /\b(追踪)\b/i, /\b(ट्रैकिंग)\b/i], action: 'nav:tax', description: 'Open tracking' },
  { patterns: [/\b(go\s+to\s+)?emergenc(y|ies)\b/i, /\bsos\b/i, /\b(emergencia)\b/i, /\b(urgence)\b/i, /\b(notfall)\b/i, /\b(緊急)\b/i, /\b(긴급)\b/i, /\b(экстренно)\b/i, /\b(emergência)\b/i, /\b(طوارئ)\b/i, /\b(acil)\b/i, /\b(紧急)\b/i, /\b(आपातकाल)\b/i], action: 'nav:emergency', description: 'Open emergency' },
  { patterns: [/\b(go\s+to\s+)?a\.?i\.?\s*(section|tools|advisors)?\b/i, /\b(inteligencia\s*artificial)\b/i, /\b(IA|KI|ИИ|YZ)\b/i], action: 'nav:ai', description: 'Open AI section' },
  { patterns: [/\b(go\s+to\s+)?(my\s+)?profile\b/i, /\b(perfil|profil|profilo)\b/i, /\b(プロフィール)\b/i, /\b(프로필)\b/i, /\b(профиль)\b/i, /\b(الملف)\b/i, /\b(प्रोफ़ाइल)\b/i], action: 'nav:profile', description: 'Open profile' },

  // Tax & Compliance
  { patterns: [/\btax\s*(residency|hub|dashboard)?\b/i, /\b(impuestos|fiscal)\b/i, /\b(vergi)\b/i, /\b(税|税務)\b/i, /\b(세금)\b/i, /\b(налог)\b/i, /\b(الضرائب)\b/i, /\b(कर)\b/i], action: 'section:tax-residency', description: 'Tax residency' },
  { patterns: [/\bcountry\s*track(er|ing)?\b/i], action: 'section:tax-residency', description: 'Country tracker' },
  { patterns: [/\bvisa\s*(manager|tracking)?\b/i, /\b(vize|visto|виза|비자|वीज़ा|تأشيرة)\b/i], action: 'section:visas', description: 'Visa manager' },
  { patterns: [/\bdocument(s)?\s*(vault|tracker)?\b/i, /\b(documentos|documenti|belgeler|文書|문서|документы|مستندات|दस्तावेज़)\b/i], action: 'section:documents', description: 'Documents' },
  { patterns: [/\bgovernment\s*apps?\b/i], action: 'section:gov-apps', description: 'Government apps' },

  // Travel Essentials
  { patterns: [/\btransport(ation)?\b/i, /\bbus(es)?\b/i, /\btrain(s)?\b/i, /\bmetro\b/i, /\b(transporte|trasporti|ulaşım|交通|교통|транспорт|المواصلات|परिवहन)\b/i], action: 'section:public-transport', description: 'Public transport' },
  { patterns: [/\btaxi(s)?\b/i, /\bride\s*(hailing|share|sharing)?\b/i, /\buber\b/i], action: 'section:taxis', description: 'Taxi services' },
  { patterns: [/\bcar\s*(rent|rental|lease)?\b/i], action: 'section:car-rent-lease', description: 'Car rental' },
  { patterns: [/\be\-?sim\b/i], action: 'section:esim', description: 'eSIM services' },
  { patterns: [/\bvpn\b/i, /\bemail\s*service\b/i], action: 'section:vpn-email', description: 'VPN & Email' },
  { patterns: [/\binsurance\b/i, /\b(seguro|assurance|versicherung|保険|보험|страховка|تأمين|बीमा|sigorta)\b/i], action: 'section:travel-insurance', description: 'Travel insurance' },

  // AI Advisors
  { patterns: [/\b(ai\s+)?doctor\b/i, /\bhealth\s*advis(or|er)\b/i, /\bmedical\s*ai\b/i, /\b(médico|médecin|arzt|医者|의사|врач|طبيب|डॉक्टर|doktor)\b/i], action: 'section:ai-doctor', description: 'AI Health Advisor' },
  { patterns: [/\b(ai\s+)?lawyer\b/i, /\blegal\s*advis(or|er)\b/i, /\blegal\s*ai\b/i, /\b(abogado|avocat|anwalt|弁護士|변호사|юрист|محامي|वकील|avukat)\b/i], action: 'section:ai-lawyer', description: 'AI Legal Advisor' },
  { patterns: [/\b(ai\s+)?planner\b/i, /\btravel\s*plan(ner|ning)?\b/i], action: 'section:ai-planner', description: 'AI Travel Planner' },
  { patterns: [/\btax\s*advis(or|ers)\b/i], action: 'section:tax-advisors', description: 'Tax advisors' },

  // Premium / Safety
  { patterns: [/\bthreat(s)?\s*(intelligence|dashboard)?\b/i], action: 'section:threats', description: 'Threat intelligence' },
  { patterns: [/\bguardian\b/i], action: 'section:guardian', description: 'SuperNomad Guardian' },
  { patterns: [/\bambass(y|ies|ador)\b/i, /\bconsulate\b/i, /\b(embajada|ambassade|botschaft|大使館|대사관|посольство|سفارة|दूतावास|büyükelçilik)\b/i], action: 'section:embassy', description: 'Embassy directory' },
  { patterns: [/\bsos\s*service\b/i], action: 'section:sos-services', description: 'SOS services' },
  { patterns: [/\bprivate\s*(protection|security)\b/i, /\bbodyguard\b/i], action: 'section:private-protection', description: 'Private protection' },
  { patterns: [/\bcyber\b/i, /\bhack(ed|ing)?\b/i], action: 'section:cyber-helpline', description: 'Cyber helpline' },
  { patterns: [/\bbusiness\s*cent(er|re)s?\b/i, /\bcowork(ing)?\b/i], action: 'section:business-centers', description: 'Business centers' },
  { patterns: [/\blounge(s)?\b/i, /\bairport\s*lounge\b/i], action: 'section:airport-lounges', description: 'Airport lounges' },
  { patterns: [/\bclub(s)?\b/i, /\bprivate\s*club\b/i], action: 'section:private-clubs', description: 'Private clubs' },

  // Local Living
  { patterns: [/\bcity\s*service(s)?\b/i], action: 'section:global-city-services', description: 'City services' },
  { patterns: [/\blanguage\s*(learn(ing)?|course)?\b/i, /\b(idiomas|langues|sprachen|語学|언어|языки|لغات|भाषा|dil)\b/i], action: 'section:language-learning', description: 'Language learning' },
  { patterns: [/\blocal\s*nomad(s)?\b/i], action: 'section:local-nomads', description: 'Local nomads' },
  { patterns: [/\blocal\s*(life|events?|explore)\b/i], action: 'section:explore-local', description: 'Local events' },
  { patterns: [/\bfamily\s*service(s)?\b/i, /\bnanny\b/i, /\bbabysit(ter|ting)?\b/i], action: 'section:family-services', description: 'Family services' },
  { patterns: [/\bpet\s*service(s)?\b/i, /\bvet(erinarian)?\b/i], action: 'section:pet-services', description: 'Pet services' },
  { patterns: [/\bmoving\s*(service)?s?\b/i, /\brelocation\b/i], action: 'section:moving-services', description: 'Moving services' },
  { patterns: [/\bmarketplace\b/i, /\bbuy\s*(and|&)?\s*sell\b/i], action: 'section:marketplace', description: 'Marketplace' },
  { patterns: [/\bsocial\b/i, /\bvibe\b/i, /\bmeet\s*(people|nomads)?\b/i], action: 'section:social-chat', description: 'Social chat' },
  { patterns: [/\bpulse\b/i, /\bcommunity\s*chat\b/i], action: 'section:nomad-chat', description: 'Community pulse' },
  { patterns: [/\bnews\b/i, /\b(noticias|nouvelles|nachrichten|ニュース|뉴스|новости|أخبار|समाचार|haberler)\b/i], action: 'section:news', description: 'News' },
  { patterns: [/\bdeliver(y|ies)\b/i], action: 'section:delivery-services', description: 'Delivery services' },

  // Finance
  { patterns: [/\bdigital\s*bank(s|ing)?\b/i], action: 'section:digital-banks', description: 'Digital banks' },
  { patterns: [/\bmoney\s*transfer(s)?\b/i, /\bsend\s*money\b/i], action: 'section:money-transfers', description: 'Money transfers' },
  { patterns: [/\bcrypto\b/i, /\bdigital\s*money\b/i], action: 'section:crypto-cash', description: 'Crypto' },
  { patterns: [/\bcurrency\s*(convert(er)?|exchange)?\b/i, /\bexchange\s*rate\b/i], action: 'section:currency-converter', description: 'Currency converter' },
  { patterns: [/\bcredit\s*card(s)?\b/i, /\bemergency\s*card\b/i], action: 'section:emergency-cards', description: 'Emergency cards' },
  { patterns: [/\bpayment\s*(option|method)s?\b/i, /\b(opciones\s*de\s*pago|options\s*de\s*paiement|zahlungsoptionen|支払い|결제|оплат|الدفع|भुगतान|ödeme)\b/i], action: 'section:payment-options', description: 'Payment options' },
  { patterns: [/\baward\s*card(s)?\b/i, /\bloyalty\s*(card|program)s?\b/i, /\b(tarjetas?\s*de\s*premios?|cartes?\s*de\s*fidélité|prämienkarten|アワードカード|리워드|лояльност|مكافآت|पुरस्कार|ödül\s*kart)\b/i], action: 'section:award-cards', description: 'Award cards' },
  { patterns: [/\bhelp\b/i, /\bsupport\b/i, /\b(ayuda|aide|hilfe|ヘルプ|도움|помощь|مساعدة|सहायता|yardım)\b/i], action: 'section:help', description: 'Help & Support' },

  // Misc
  { patterns: [/\bweather\b/i, /\bforecast\b/i, /\b(clima|météo|wetter|天気|날씨|погода|طقس|मौसम|hava)\b/i], action: 'section:weather', description: 'Weather' },
  { patterns: [/\bwi-?fi\b/i, /\bhotspot\b/i, /\binternet\b/i], action: 'section:wifi-finder', description: 'WiFi finder' },
  { patterns: [/\bstudent(s)?\b/i], action: 'section:students', description: 'Students' },
  { patterns: [/\broadside\b/i, /\btow(ing)?\b/i], action: 'section:roadside', description: 'Roadside assistance' },
  { patterns: [/\bsetting(s)?\b/i, /\bpreference(s)?\b/i, /\b(configuración|paramètres|einstellungen|設定|설정|настройки|إعدادات|सेटिंग्स|ayarlar)\b/i], action: 'section:settings', description: 'Settings' },
  { patterns: [/\baward(s)?\b/i, /\bachievement(s)?\b/i], action: 'section:my-travel-awards', description: 'Awards' },
  { patterns: [/\bvaccinat(ion|e|ions)\b/i, /\bhealth\s*(record|tracker)\b/i], action: 'section:health', description: 'Vaccinations' },
  { patterns: [/\boffer(s)?\b/i, /\bdeal(s)?\b/i], action: 'section:super-offers', description: 'Super offers' },

  // Voice control meta (multilingual)
  { patterns: [/\bstop\s*(talking|speaking)?\b/i, /\bshut\s*up\b/i, /\bquiet\b/i, /\bsilence\b/i, /\b(para|detente|arrête|stopp|止めて|멈춰|стоп|توقف|रुको|dur)\b/i], action: 'voice:stop', description: 'Stop speaking' },
  { patterns: [/\b(enable|turn\s*on)\s*voice\b/i, /\bspeak\s*(to\s*me|back)\b/i, /\b(activar\s*voz|activer\s*voix|stimme\s*an|音声オン|음성\s*켜|включить\s*голос|تفعيل\s*الصوت|आवाज़\s*चालू|sesi\s*aç)\b/i], action: 'voice:enable', description: 'Enable voice responses' },
  { patterns: [/\b(disable|turn\s*off)\s*voice\b/i, /\bmute\b/i, /\b(desactivar\s*voz|désactiver\s*voix|stimme\s*aus|音声オフ|음성\s*꺼|выключить\s*голос|كتم\s*الصوت|आवाज़\s*बंद|sesi\s*kapat)\b/i], action: 'voice:disable', description: 'Disable voice responses' },
  { patterns: [/\bwhat\s*can\s*(you|i)\s*(do|say)\b/i, /\bsuper\s*nomad\b/i, /\bcommands?\b/i, /\b(comandos|commandes|befehle|コマンド|명령|команды|أوامر|कमांड|komutlar)\b/i], action: 'voice:help', description: 'List voice commands' },
];

// Feedback messages per language
const FEEDBACK_MESSAGES: Record<string, { opening: string; notUnderstood: string; helpIntro: string; voiceOn: string; voiceOff: string; stopped: string }> = {
  en: { opening: 'Opening', notUnderstood: "I didn't understand", helpIntro: 'You can say:', voiceOn: 'Voice responses enabled. I will speak all responses aloud.', voiceOff: 'Voice responses disabled', stopped: 'Stopped speaking' },
  es: { opening: 'Abriendo', notUnderstood: 'No entendí', helpIntro: 'Puedes decir:', voiceOn: 'Respuestas de voz activadas.', voiceOff: 'Respuestas de voz desactivadas', stopped: 'Dejé de hablar' },
  pt: { opening: 'Abrindo', notUnderstood: 'Não entendi', helpIntro: 'Você pode dizer:', voiceOn: 'Respostas por voz ativadas.', voiceOff: 'Respostas por voz desativadas', stopped: 'Parei de falar' },
  zh: { opening: '正在打开', notUnderstood: '我没听懂', helpIntro: '你可以说：', voiceOn: '语音回复已启用。', voiceOff: '语音回复已禁用', stopped: '已停止朗读' },
  fr: { opening: 'Ouverture de', notUnderstood: "Je n'ai pas compris", helpIntro: 'Vous pouvez dire :', voiceOn: 'Réponses vocales activées.', voiceOff: 'Réponses vocales désactivées', stopped: "J'ai arrêté de parler" },
  de: { opening: 'Öffne', notUnderstood: 'Ich habe nicht verstanden', helpIntro: 'Du kannst sagen:', voiceOn: 'Sprachantworten aktiviert.', voiceOff: 'Sprachantworten deaktiviert', stopped: 'Ich habe aufgehört zu sprechen' },
  ar: { opening: 'جاري فتح', notUnderstood: 'لم أفهم', helpIntro: 'يمكنك قول:', voiceOn: 'تم تفعيل الردود الصوتية.', voiceOff: 'تم إيقاف الردود الصوتية', stopped: 'توقفت عن الكلام' },
  ja: { opening: '開いています', notUnderstood: '理解できませんでした', helpIntro: '次のように言えます：', voiceOn: '音声応答が有効になりました。', voiceOff: '音声応答が無効になりました', stopped: '読み上げを停止しました' },
  it: { opening: 'Apertura di', notUnderstood: 'Non ho capito', helpIntro: 'Puoi dire:', voiceOn: 'Risposte vocali attivate.', voiceOff: 'Risposte vocali disattivate', stopped: 'Ho smesso di parlare' },
  ko: { opening: '열고 있습니다', notUnderstood: '이해하지 못했습니다', helpIntro: '다음과 같이 말할 수 있습니다:', voiceOn: '음성 응답이 활성화되었습니다.', voiceOff: '음성 응답이 비활성화되었습니다', stopped: '말하기를 중지했습니다' },
  hi: { opening: 'खोल रहा है', notUnderstood: 'मुझे समझ नहीं आया', helpIntro: 'आप कह सकते हैं:', voiceOn: 'आवाज़ प्रतिक्रिया सक्षम।', voiceOff: 'आवाज़ प्रतिक्रिया अक्षम', stopped: 'बोलना बंद कर दिया' },
  ru: { opening: 'Открываю', notUnderstood: 'Я не понял', helpIntro: 'Вы можете сказать:', voiceOn: 'Голосовые ответы включены.', voiceOff: 'Голосовые ответы отключены', stopped: 'Перестал говорить' },
  tr: { opening: 'Açılıyor', notUnderstood: 'Anlayamadım', helpIntro: 'Şunları söyleyebilirsiniz:', voiceOn: 'Sesli yanıtlar etkinleştirildi.', voiceOff: 'Sesli yanıtlar devre dışı', stopped: 'Konuşmayı durdurdum' },
};

interface VoiceControlProviderProps {
  children: React.ReactNode;
  onNavigate?: (section: string) => void;
  onTabChange?: (tab: string) => void;
}

export const VoiceControlProvider: React.FC<VoiceControlProviderProps> = ({ children, onNavigate, onTabChange }) => {
  const { currentLanguage } = useLanguage();
  const voice = useVoiceConversation(currentLanguage);
  const [lastCommand, setLastCommand] = useState('');
  const [lastFeedback, setLastFeedback] = useState('');
  const onNavigateRef = useRef(onNavigate);
  const onTabChangeRef = useRef(onTabChange);

  useEffect(() => { onNavigateRef.current = onNavigate; }, [onNavigate]);
  useEffect(() => { onTabChangeRef.current = onTabChange; }, [onTabChange]);

  // Keep voice hook in sync with language changes
  useEffect(() => {
    voice.setLanguage(currentLanguage);
  }, [currentLanguage, voice.setLanguage]);

  const fb = FEEDBACK_MESSAGES[currentLanguage] || FEEDBACK_MESSAGES.en;

  const processCommand = useCallback((transcript: string) => {
    const text = transcript.toLowerCase().trim();
    setLastCommand(transcript);

    for (const cmd of VOICE_COMMANDS) {
      for (const pattern of cmd.patterns) {
        if (pattern.test(text)) {
          const [type, value] = cmd.action.split(':');

          if (type === 'nav') {
            const tabMap: Record<string, string> = {
              'dashboard': 'home', 'tax': 'tracking', 'emergency': 'emergency', 'ai': 'ai', 'profile': 'profile'
            };
            const tab = tabMap[value] || 'home';
            onTabChangeRef.current?.(tab);
            const feedback = `${fb.opening} ${cmd.description}`;
            setLastFeedback(feedback);
            voice.speak(feedback);
            return;
          }

          if (type === 'section') {
            onNavigateRef.current?.(value);
            const feedback = `${fb.opening} ${cmd.description}`;
            setLastFeedback(feedback);
            voice.speak(feedback);
            return;
          }

          if (type === 'voice') {
            if (value === 'stop') {
              voice.stopSpeaking();
              setLastFeedback(fb.stopped);
              return;
            }
            if (value === 'enable') {
              if (!voice.voiceEnabled) voice.toggleVoice();
              setLastFeedback(fb.voiceOn);
              setTimeout(() => voice.speak(fb.voiceOn), 100);
              return;
            }
            if (value === 'disable') {
              if (voice.voiceEnabled) voice.toggleVoice();
              setLastFeedback(fb.voiceOff);
              return;
            }
            if (value === 'help') {
              const helpText = `${fb.helpIntro} Home, Tracking, Emergency, AI, Profile, Tax, Visa, Documents, Doctor, Lawyer, Weather, Settings.`;
              setLastFeedback(helpText);
              voice.speak(helpText);
              return;
            }
          }
        }
      }
    }

    // No match found
    const feedback = `${fb.notUnderstood} "${transcript}". Say "SuperNomad" ${fb.helpIntro}`;
    setLastFeedback(feedback);
    voice.speak(feedback);
  }, [voice, fb]);

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
