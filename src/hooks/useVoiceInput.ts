import { useState, useCallback, useRef } from 'react';

const LANG_TO_LOCALE: Record<string, string> = {
  en: 'en-US', es: 'es-ES', pt: 'pt-BR', zh: 'zh-CN', fr: 'fr-FR',
  de: 'de-DE', ar: 'ar-SA', ja: 'ja-JP', it: 'it-IT', ko: 'ko-KR',
  hi: 'hi-IN', ru: 'ru-RU', tr: 'tr-TR',
};

interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  isSupported: boolean;
}

export const useVoiceInput = (language = 'en'): UseVoiceInputReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef<((text: string) => void) | null>(null);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback((onResult?: (text: string) => void) => {
    if (!isSupported) return;

    callbackRef.current = onResult || null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = LANG_TO_LOCALE[language] || 'en-US';

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      callbackRef.current?.(text);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported, language]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, isSupported };
};
