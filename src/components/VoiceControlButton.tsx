import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceControl } from '@/contexts/VoiceControlContext';
import { cn } from '@/lib/utils';

const VOICE_TIPS_KEY = 'supernomad_voice_tips_seen';

export const VoiceControlButton: React.FC = () => {
  const {
    isListening,
    isSpeaking,
    voiceEnabled,
    lastCommand,
    lastFeedback,
    startGlobalListening,
    stopGlobalListening,
    stopSpeaking,
    toggleVoice,
    sttSupported,
    ttsSupported,
  } = useVoiceControl();

  const [showOnboardBubble, setShowOnboardBubble] = useState(false);

  // Show onboarding bubble once for new users
  useEffect(() => {
    if (!sttSupported && !ttsSupported) return;
    const seen = localStorage.getItem(VOICE_TIPS_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShowOnboardBubble(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [sttSupported, ttsSupported]);

  const dismissOnboardBubble = () => {
    setShowOnboardBubble(false);
    localStorage.setItem(VOICE_TIPS_KEY, 'true');
  };

  if (!sttSupported && !ttsSupported) return null;

  const handleMicClick = () => {
    dismissOnboardBubble();
    if (isListening) {
      stopGlobalListening();
    } else {
      startGlobalListening();
    }
  };

  const handleSpeakerClick = () => {
    dismissOnboardBubble();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      toggleVoice();
    }
  };

  return (
    <TooltipProvider>
      <div className="relative flex items-center gap-1">
        {/* Onboarding Speech Bubble */}
        {showOnboardBubble && (
          <div className="absolute top-full right-0 mt-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative bg-primary text-primary-foreground rounded-xl px-4 py-3 shadow-lg max-w-[260px]">
              {/* Speech bubble arrow */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-primary rotate-45 rounded-sm" />
              <button onClick={dismissOnboardBubble} className="absolute top-1.5 right-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="text-xs font-semibold mb-1.5">🎙️ Voice Control</p>
              <ul className="text-[10px] space-y-1 leading-relaxed opacity-90">
                <li>🔊 <strong>Speaker</strong> — Toggle app voice responses</li>
                <li>🎤 <strong>Mic</strong> — Speak commands hands-free</li>
                <li>💬 Say <strong>"SuperNomad"</strong> for all commands</li>
                <li>🗣️ Try: <em>"weather service"</em>, <em>"visa"</em>, <em>"doctor"</em></li>
              </ul>
            </div>
          </div>
        )}

        {/* Voice Responses Toggle */}
        {ttsSupported && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeakerClick}
                className={cn(
                  "relative transition-all",
                  voiceEnabled && "text-primary",
                  isSpeaking && "text-accent animate-pulse"
                )}
                aria-label={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
              >
                {voiceEnabled ? (
                  <Volume2 className={cn("h-5 w-5", isSpeaking && "animate-pulse")} />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">
              <p className="font-medium text-xs">{isSpeaking ? '🔊 Speaking… click to stop' : voiceEnabled ? '🔊 Voice ON — app speaks responses' : '🔇 Enable voice — app will speak aloud'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Microphone — Voice Commands */}
        {sttSupported && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? "destructive" : "ghost"}
                size="sm"
                onClick={handleMicClick}
                className={cn(
                  "relative transition-all",
                  isListening && "shadow-lg shadow-destructive/30"
                )}
                aria-label={isListening ? 'Stop listening' : 'Start voice command'}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    <span className="absolute inset-0 rounded-md border-2 border-destructive animate-ping opacity-30" />
                  </>
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[220px]">
              {isListening ? (
                <p className="font-medium text-xs">🎙️ Listening… speak a command now</p>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium text-xs">🎤 Voice Navigation</p>
                  <p className="text-[10px] text-muted-foreground">Click & say any section name.<br/>Try: <em>"weather"</em>, <em>"visa"</em>, <em>"doctor"</em></p>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Feedback toast */}
        {(isListening || lastFeedback) && (
          <div className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-card border shadow-lg rounded-xl px-4 py-3 max-w-sm transition-all duration-300",
            isListening ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          )}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Mic className="h-5 w-5 text-destructive" />
                <span className="absolute -inset-1 rounded-full border-2 border-destructive animate-ping opacity-40" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {lastCommand ? `"${lastCommand}"` : 'Listening...'}
                </p>
                {lastFeedback && (
                  <p className="text-xs text-muted-foreground mt-0.5">{lastFeedback.slice(0, 80)}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
