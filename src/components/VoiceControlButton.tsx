import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useVoiceControl } from '@/contexts/VoiceControlContext';
import { cn } from '@/lib/utils';

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

  const [showFeedback, setShowFeedback] = useState(false);

  if (!sttSupported && !ttsSupported) return null;

  const handleMicClick = () => {
    if (isListening) {
      stopGlobalListening();
    } else {
      startGlobalListening();
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 5000);
    }
  };

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      toggleVoice();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
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
            <TooltipContent side="bottom">
              <p>{isSpeaking ? 'Click to stop' : voiceEnabled ? 'Voice ON — click to mute' : 'Enable voice responses'}</p>
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
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-md border-2 border-destructive animate-ping opacity-30" />
                  </>
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              {isListening ? (
                <p className="font-medium">🎙️ Listening... speak a command</p>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium">Voice Control</p>
                  <p className="text-xs text-muted-foreground">Say "SuperNomad" for all commands</p>
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
