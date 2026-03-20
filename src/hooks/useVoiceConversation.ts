import { useState, useCallback, useRef, useEffect } from 'react';
import { createSpeechAnalyzer, type SpeechAnalyzerController } from './voice/audioAnalysis';
import {
  buildSpeechWordCues,
  estimateSpeechDurationMs,
  getWordAtCharIndex,
  sanitizeSpeechText,
} from './voice/speechText';

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
  micPermission: 'granted' | 'denied' | 'prompt' | 'unsupported';
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

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const getWordShapeLevel = (word: string) => {
  const sample = word.toLowerCase();
  if (!sample) return 0.14;

  const vowels = (sample.match(/[aeiouyäöüáéíóú]/g) || []).length;
  const openVowels = (sample.match(/[aáàäåoóòö]/g) || []).length;
  const plosives = (sample.match(/[bmp]/g) || []).length;
  const fricatives = (sample.match(/[fvszxhj]/g) || []).length;

  return clamp(0.12 + vowels * 0.08 + openVowels * 0.08 + fricatives * 0.03 - plosives * 0.12, 0.08, 0.9);
};

export const useVoiceConversation = (initialLang = 'en'): UseVoiceConversationReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [spokenText, setSpokenText] = useState('');
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');

  const recognitionRef = useRef<any>(null);
  const langRef = useRef(initialLang);
  const voiceGenderRef = useRef<'woman' | 'man'>('woman');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const analyzerRef = useRef<SpeechAnalyzerController | null>(null);
  const speechSessionRef = useRef(0);
  const wordFrameRef = useRef<number>(0);
  const wordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mouthFallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sttSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const ttsSupported = true;

  // Check mic permission on mount
  useEffect(() => {
    if (!sttSupported) {
      setMicPermission('unsupported');
      return;
    }
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((status) => {
        setMicPermission(status.state as 'granted' | 'denied' | 'prompt');
        status.onchange = () => setMicPermission(status.state as 'granted' | 'denied' | 'prompt');
      }).catch(() => {
        // permissions API not available for mic (e.g. Safari) — keep as 'prompt'
      });
    }
  }, [sttSupported]);


  const stopWordAnimation = useCallback(() => {
    if (wordFrameRef.current) {
      cancelAnimationFrame(wordFrameRef.current);
      wordFrameRef.current = 0;
    }
    if (wordIntervalRef.current) {
      clearInterval(wordIntervalRef.current);
      wordIntervalRef.current = null;
    }
    setCurrentWord('');
  }, []);

  const stopFallbackMouthAnimation = useCallback(() => {
    if (mouthFallbackIntervalRef.current) {
      clearInterval(mouthFallbackIntervalRef.current);
      mouthFallbackIntervalRef.current = null;
    }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    analyzerRef.current?.stop();
    analyzerRef.current = null;
    setMouthOpenness(0);
  }, []);

  const cleanupAudioElement = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onplaying = null;
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }

    audioRef.current = null;

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const clearSpeechState = useCallback((onComplete?: () => void) => {
    stopAudioAnalysis();
    stopWordAnimation();
    stopFallbackMouthAnimation();
    cleanupAudioElement();
    setIsSpeaking(false);
    setSpokenText('');
    setMouthOpenness(0);
    onComplete?.();
  }, [cleanupAudioElement, stopAudioAnalysis, stopFallbackMouthAnimation, stopWordAnimation]);

  const setLanguage = useCallback((lang: string) => {
    langRef.current = lang;
  }, []);

  const setVoiceGender = useCallback((gender: 'woman' | 'man') => {
    voiceGenderRef.current = gender;
  }, []);

  const startTimedWordAnimation = useCallback((text: string, getProgress: () => number) => {
    stopWordAnimation();

    const cues = buildSpeechWordCues(text);
    if (!cues.length) return;

    const totalWeight = cues.reduce((sum, cue) => sum + cue.weight, 0);

    const update = () => {
      const progress = clamp(getProgress());
      const targetWeight = progress * totalWeight;
      let accumulated = 0;
      let nextWord = cues[cues.length - 1].word;

      for (const cue of cues) {
        accumulated += cue.weight;
        if (targetWeight <= accumulated) {
          nextWord = cue.word;
          break;
        }
      }

      setCurrentWord(nextWord);
      wordFrameRef.current = requestAnimationFrame(update);
    };

    wordFrameRef.current = requestAnimationFrame(update);
  }, [stopWordAnimation]);

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (!sttSupported) return;

    clearSpeechState();

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
      }, 1800);
    };

    recognition.onerror = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [clearSpeechState, sttSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const fallbackBrowserTTS = useCallback((text: string, onComplete?: () => void) => {
    if (!('speechSynthesis' in window)) {
      clearSpeechState(onComplete);
      return;
    }

    const sessionId = ++speechSessionRef.current;
    const utterance = new SpeechSynthesisUtterance(text);
    const locale = LANG_TO_LOCALE[langRef.current] || 'en-US';
    const gender = voiceGenderRef.current;
    const cues = buildSpeechWordCues(text);

    window.speechSynthesis.cancel();

    utterance.lang = locale;
    utterance.rate = gender === 'man' ? 0.9 : 1.0;
    utterance.pitch = gender === 'man' ? 0.5 : 1.08;

    const localePrefix = locale.split('-')[0].toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    const genderHint = gender === 'man' ? /(male|man|david|george|daniel|liam|alex)/i : /(female|woman|samantha|victoria|karen|zira|sofia)/i;
    const preferredVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(localePrefix) && genderHint.test(voice.name))
      || voices.find((voice) => voice.lang.toLowerCase().startsWith(localePrefix));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (sessionId !== speechSessionRef.current) return;
      setSpokenText(text);
      setIsSpeaking(true);
      stopWordAnimation();
      stopFallbackMouthAnimation();
      mouthFallbackIntervalRef.current = setInterval(() => {
        setMouthOpenness((prev) => {
          const pulse = currentWord ? getWordShapeLevel(currentWord) : 0.2 + Math.random() * 0.35;
          const next = pulse * (0.72 + Math.random() * 0.3);
          return prev > next ? prev * 0.72 : next;
        });
      }, 70);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (sessionId !== speechSessionRef.current || typeof event.charIndex !== 'number') return;
      const word = getWordAtCharIndex(cues, event.charIndex);
      setCurrentWord(word);
      setMouthOpenness(getWordShapeLevel(word));
    };

    utterance.onend = () => {
      if (sessionId !== speechSessionRef.current) return;
      clearSpeechState(onComplete);
    };

    utterance.onerror = () => {
      if (sessionId !== speechSessionRef.current) return;
      clearSpeechState(onComplete);
    };

    setSpokenText(text);
    window.speechSynthesis.speak(utterance);
  }, [clearSpeechState, currentWord, stopFallbackMouthAnimation, stopWordAnimation]);

  const speak = useCallback(async (text: string, onComplete?: () => void) => {
    if (!voiceEnabled) {
      onComplete?.();
      return;
    }

    const clean = sanitizeSpeechText(text);
    if (!clean) {
      onComplete?.();
      return;
    }

    speechSessionRef.current += 1;
    clearSpeechState();
    setSpokenText(clean);

    try {
      const gender = voiceGenderRef.current;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: clean, gender }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      if (!audioBlob.size) {
        throw new Error('TTS returned empty audio');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      const estimatedDuration = estimateSpeechDurationMs(clean);
      let hasStarted = false;

      audioRef.current = audio;
      audioUrlRef.current = audioUrl;
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      

      const beginPlayback = async () => {
        if (hasStarted) return;
        hasStarted = true;
        setIsSpeaking(true);

        analyzerRef.current = createSpeechAnalyzer(audio, (level) => {
          setMouthOpenness((prev) => (level > prev ? level : prev * 0.78));
        });
        await analyzerRef.current.resume();

        startTimedWordAnimation(clean, () => {
          const durationMs = Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration * 1000
            : estimatedDuration;
          return durationMs > 0 ? (audio.currentTime * 1000) / durationMs : 0;
        });
      };

      audio.onplaying = () => {
        void beginPlayback();
      };

      audio.onended = () => {
        clearSpeechState(onComplete);
      };

      audio.onerror = () => {
        console.error('[Voice] Audio playback error, falling back to browser TTS');
        clearSpeechState();
        fallbackBrowserTTS(clean, onComplete);
      };

      await audio.play();
      await beginPlayback();
    } catch (error) {
      console.error('[Voice] ElevenLabs TTS failed, falling back to browser TTS:', error);
      clearSpeechState();
      fallbackBrowserTTS(clean, onComplete);
    }
  }, [clearSpeechState, fallbackBrowserTTS, startTimedWordAnimation, voiceEnabled]);

  const stopSpeaking = useCallback(() => {
    speechSessionRef.current += 1;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearSpeechState();
  }, [clearSpeechState]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      if (prev) {
        speechSessionRef.current += 1;
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        clearSpeechState();
      }
      return !prev;
    });
  }, [clearSpeechState]);

  useEffect(() => () => {
    speechSessionRef.current += 1;
    recognitionRef.current?.stop?.();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearSpeechState();
  }, [clearSpeechState]);

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
    micPermission,
    setLanguage,
    setVoiceGender,
  };
};
