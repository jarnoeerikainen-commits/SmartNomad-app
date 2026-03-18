import { useState, useCallback, useRef } from 'react';

// Map app language codes to BCP-47 locale codes for STT/TTS
const LANG_TO_LOCALE: Record<string, string> = {
  en: 'en-US', es: 'es-ES', pt: 'pt-BR', zh: 'zh-CN', fr: 'fr-FR',
  de: 'de-DE', ar: 'ar-SA', ja: 'ja-JP', it: 'it-IT', ko: 'ko-KR',
  hi: 'hi-IN', ru: 'ru-RU', tr: 'tr-TR',
};

interface UseVoiceConversationReturn {
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string, onComplete?: () => void) => void;
  stopSpeaking: () => void;
  toggleVoice: () => void;
  sttSupported: boolean;
  ttsSupported: boolean;
  setLanguage: (lang: string) => void;
  setVoiceGender: (gender: 'woman' | 'man') => void;
}

export const useVoiceConversation = (initialLang = 'en'): UseVoiceConversationReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const langRef = useRef(initialLang);
  const voiceGenderRef = useRef<'woman' | 'man'>('woman');

  const sttSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const setLanguage = useCallback((lang: string) => {
    langRef.current = lang;
  }, []);

  const setVoiceGender = useCallback((gender: 'woman' | 'man') => {
    voiceGenderRef.current = gender;
  }, []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!sttSupported) return;

    // Stop any ongoing speech first
    if (ttsSupported) window.speechSynthesis.cancel();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = LANG_TO_LOCALE[langRef.current] || 'en-US';

    let finalTranscript = '';
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      // Reset silence timer on every result – gives user 2s of silence before auto-stop
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        const result = finalTranscript.trim() || interim.trim();
        if (result) onResult(result);
        recognition.stop();
      }, 2000);
    };

    recognition.onerror = () => { if (silenceTimer) clearTimeout(silenceTimer); setIsListening(false); };
    recognition.onend = () => { if (silenceTimer) clearTimeout(silenceTimer); setIsListening(false); };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [sttSupported, ttsSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string, onComplete?: () => void) => {
    if (!ttsSupported || !voiceEnabled) {
      onComplete?.();
      return;
    }

    window.speechSynthesis.cancel();

    // Smart filtering: strip booking blocks, URLs, domains, markdown for natural speech
    const clean = text
      .replace(/```(?:json|booking)[\s\S]*?```/g, '')
      .replace(/\[?\{[^{}]*"url"[^{}]*\}[\s,\]]*/g, '')
      .replace(/https?:\/\/[^\s)]+/g, '')
      .replace(/www\.[^\s)]+/g, '')
      .replace(/[a-zA-Z0-9-]+\.(com|org|net|io|co|app|dev|travel)[^\s)]*\b/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[*_~`#]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^.*(?:Search on|Open in|Book (?:on|via|at)).*$/gm, '')
      .replace(/[🔗🌐💻📱]/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (!clean) { onComplete?.(); return; }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1;
    utterance.pitch = 1;

    const locale = LANG_TO_LOCALE[langRef.current] || 'en-US';
    const langPrefix = locale.split('-')[0];

    // Wait for voices to load if empty (Chrome loads async)
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>(resolve => {
        const onVoices = () => { resolve(); window.speechSynthesis.removeEventListener('voiceschanged', onVoices); };
        window.speechSynthesis.addEventListener('voiceschanged', onVoices);
        setTimeout(resolve, 500); // fallback timeout
      });
      voices = window.speechSynthesis.getVoices();
    }

    const gender = voiceGenderRef.current;
    
    // Comprehensive gender-aware voice matching — ordered by priority
    const femaleNames = ['Samantha', 'Karen', 'Moira', 'Victoria', 'Zira', 'Tessa', 'Fiona', 'Allison', 'Ava', 'Susan', 'Catherine', 'Paulina', 'Monica', 'Luciana', 'Amelie', 'Anna', 'Milena', 'Yuna', 'Kyoko', 'Lekha', 'Meijia', 'Tingting'];
    const maleNames = ['David', 'James', 'Daniel', 'Mark', 'Fred', 'Alex', 'Tom', 'Oliver', 'Aaron', 'Gordon', 'Jorge', 'Thomas', 'Jacques', 'Luca', 'Yuri', 'Ichiro', 'Rishi'];
    const femaleKeywords = ['Female', 'Woman', 'female', 'woman'];
    const maleKeywords = ['Male', 'Man', 'male', 'man'];
    
    const nameHints = gender === 'man' ? maleNames : femaleNames;
    const keywordHints = gender === 'man' ? maleKeywords : femaleKeywords;
    const antiKeywords = gender === 'man' ? femaleKeywords : maleKeywords;
    
    // Filter voices matching the language
    const langVoices = voices.filter(v => v.lang.startsWith(langPrefix));
    
    // Priority 1: exact name match + right language
    let preferred = langVoices.find(v => nameHints.some(n => v.name.includes(n)));
    
    // Priority 2: keyword match (e.g., "Google UK English Male")
    if (!preferred) {
      preferred = langVoices.find(v => keywordHints.some(k => v.name.includes(k)));
    }
    
    // Priority 3: exclude wrong-gender voices, pick first remaining
    if (!preferred && langVoices.length > 1) {
      const filtered = langVoices.filter(v => !antiKeywords.some(k => v.name.includes(k)));
      preferred = filtered[0] || langVoices[0];
    }
    
    // Priority 4: any voice in the language
    if (!preferred) {
      preferred = langVoices[0];
    }

    if (preferred) {
      utterance.voice = preferred;
      utterance.lang = preferred.lang;
    } else {
      utterance.lang = locale;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); onComplete?.(); };
    utterance.onerror = () => { setIsSpeaking(false); onComplete?.(); };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsSupported, voiceEnabled]);

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [ttsSupported]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev && ttsSupported) window.speechSynthesis.cancel();
      return !prev;
    });
  }, [ttsSupported]);

  return {
    isListening,
    isSpeaking,
    voiceEnabled,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    toggleVoice,
    sttSupported,
    ttsSupported,
    setLanguage,
    setVoiceGender,
  };
};
