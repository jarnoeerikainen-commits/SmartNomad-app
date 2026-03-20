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
  currentWord: string;
  mouthOpenness: number;
  spokenText: string;
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
  const [currentWord, setCurrentWord] = useState('');
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [spokenText, setSpokenText] = useState('');
  const recognitionRef = useRef<any>(null);
  const langRef = useRef(initialLang);
  const voiceGenderRef = useRef<'woman' | 'man'>('woman');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const wordAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sttSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const ttsSupported = true; // ElevenLabs is always available

  const setLanguage = useCallback((lang: string) => {
    langRef.current = lang;
  }, []);

  const setVoiceGender = useCallback((gender: 'woman' | 'man') => {
    voiceGenderRef.current = gender;
  }, []);

  // Analyze audio for mouth openness using Web Audio API
  const startAudioAnalysis = useCallback((audio: HTMLAudioElement) => {
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const analyze = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Focus on speech frequencies (300Hz-3000Hz) for mouth mapping
        // With 44100Hz sample rate and 256 FFT, each bin = ~172Hz
        // Speech range bins: ~2 to ~17
        let speechEnergy = 0;
        let count = 0;
        for (let i = 2; i < 18; i++) {
          speechEnergy += dataArray[i];
          count++;
        }
        const avgEnergy = speechEnergy / count / 255;

        // Map energy to mouth openness with natural curve
        // Apply a power curve for more natural feel
        const openness = Math.pow(Math.min(avgEnergy * 2.5, 1), 0.7);
        setMouthOpenness(openness);

        animFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (e) {
      console.warn('[Voice] Audio analysis failed, using fallback animation', e);
    }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    setMouthOpenness(0);
  }, []);

  // Simulate word progression for visual display
  const startWordAnimation = useCallback((text: string) => {
    const words = text.split(/\s+/);
    let idx = 0;
    // Approximate ~150 words per minute for ElevenLabs
    const msPerWord = 400;

    if (wordAnimRef.current) clearInterval(wordAnimRef.current);
    wordAnimRef.current = setInterval(() => {
      if (idx >= words.length) {
        idx = 0; // loop if speech is still going
      }
      setCurrentWord(words[idx] || '');
      idx++;
    }, msPerWord);
  }, []);

  const stopWordAnimation = useCallback(() => {
    if (wordAnimRef.current) {
      clearInterval(wordAnimRef.current);
      wordAnimRef.current = null;
    }
    setCurrentWord('');
  }, []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!sttSupported) return;

    // Stop any current speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

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
  }, [sttSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback(async (text: string, onComplete?: () => void) => {
    if (!voiceEnabled) {
      onComplete?.();
      return;
    }

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    stopAudioAnalysis();
    stopWordAnimation();

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

    setSpokenText(clean);
    setIsSpeaking(true);
    startWordAnimation(clean);

    try {
      const gender = voiceGenderRef.current;
      const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

      const response = await fetch(TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: clean, gender }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      audio.oncanplay = () => {
        startAudioAnalysis(audio);
        audio.play().catch(console.error);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        stopAudioAnalysis();
        stopWordAnimation();
        setSpokenText('');
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        onComplete?.();
      };

      audio.onerror = () => {
        console.error('[Voice] Audio playback error, falling back to browser TTS');
        stopAudioAnalysis();
        stopWordAnimation();
        audioRef.current = null;
        // Fallback to browser TTS
        fallbackBrowserTTS(clean, onComplete);
      };
    } catch (error) {
      console.error('[Voice] ElevenLabs TTS failed, falling back to browser TTS:', error);
      // Fallback to browser TTS
      fallbackBrowserTTS(clean, onComplete);
    }
  }, [voiceEnabled, startAudioAnalysis, stopAudioAnalysis, startWordAnimation, stopWordAnimation]);

  // Fallback browser TTS if ElevenLabs fails
  const fallbackBrowserTTS = useCallback((text: string, onComplete?: () => void) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setSpokenText('');
      onComplete?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const gender = voiceGenderRef.current;
    utterance.rate = gender === 'man' ? 0.85 : 1.0;
    utterance.pitch = gender === 'man' ? 0.45 : 1.15;

    // Simple internal mouth animation for fallback
    let animInterval: ReturnType<typeof setInterval> | null = null;

    utterance.onstart = () => {
      animInterval = setInterval(() => {
        setMouthOpenness(0.1 + Math.random() * 0.7);
      }, 80);
    };

    utterance.onend = () => {
      if (animInterval) clearInterval(animInterval);
      setIsSpeaking(false);
      stopWordAnimation();
      setMouthOpenness(0);
      setSpokenText('');
      onComplete?.();
    };

    utterance.onerror = () => {
      if (animInterval) clearInterval(animInterval);
      setIsSpeaking(false);
      stopWordAnimation();
      setMouthOpenness(0);
      setSpokenText('');
      onComplete?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [stopWordAnimation]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopAudioAnalysis();
    stopWordAnimation();
    setIsSpeaking(false);
    setSpokenText('');
  }, [stopAudioAnalysis, stopWordAnimation]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        stopAudioAnalysis();
        stopWordAnimation();
      }
      return !prev;
    });
  }, [stopAudioAnalysis, stopWordAnimation]);

  return {
    isListening,
    isSpeaking,
    voiceEnabled,
    currentWord,
    mouthOpenness,
    spokenText,
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
