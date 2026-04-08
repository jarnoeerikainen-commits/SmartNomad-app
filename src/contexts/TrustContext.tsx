import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// --- Types ---

export type ConfidenceLevel = 'verified' | 'predictive' | 'needs_review';
export type TrustLevel = 'info' | 'advisory' | 'actionable' | 'high_stakes';

export interface ThinkingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done';
  timestamp: number;
}

export interface UndoableAction {
  id: string;
  label: string;
  onUndo: () => void;
  expiresAt: number;
}

export interface SovereignConfirmation {
  id: string;
  title: string;
  description: string;
  details: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

// --- Context ---

interface TrustContextType {
  // Thinking log
  thinkingSteps: ThinkingStep[];
  isThinking: boolean;
  addThinkingStep: (label: string) => string;
  completeThinkingStep: (id: string) => void;
  clearThinking: () => void;

  // Undo buffer
  undoableActions: UndoableAction[];
  registerUndoable: (label: string, onUndo: () => void, durationMs?: number) => string;
  executeUndo: (id: string) => void;

  // Sovereign confirmation
  pendingConfirmation: SovereignConfirmation | null;
  requestConfirmation: (title: string, description: string, details: string[]) => Promise<boolean>;

  // Confidence
  getConfidenceColor: (level: ConfidenceLevel) => string;
  getConfidenceLabel: (level: ConfidenceLevel) => string;
}

const TrustContext = createContext<TrustContextType | null>(null);

export function TrustProvider({ children }: { children: React.ReactNode }) {
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [undoableActions, setUndoableActions] = useState<UndoableAction[]>([]);
  const [pendingConfirmation, setPendingConfirmation] = useState<SovereignConfirmation | null>(null);
  const undoTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const confirmResolve = useRef<((v: boolean) => void) | null>(null);

  // --- Thinking ---
  const addThinkingStep = useCallback((label: string): string => {
    const id = `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setIsThinking(true);
    setThinkingSteps(prev => [...prev, { id, label, status: 'active', timestamp: Date.now() }]);
    return id;
  }, []);

  const completeThinkingStep = useCallback((id: string) => {
    setThinkingSteps(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, status: 'done' as const } : s);
      if (updated.every(s => s.status === 'done')) {
        setTimeout(() => setIsThinking(false), 800);
      }
      return updated;
    });
  }, []);

  const clearThinking = useCallback(() => {
    setThinkingSteps([]);
    setIsThinking(false);
  }, []);

  // --- Undo ---
  const registerUndoable = useCallback((label: string, onUndo: () => void, durationMs = 60000): string => {
    const id = `undo-${Date.now()}`;
    const expiresAt = Date.now() + durationMs;
    setUndoableActions(prev => [...prev, { id, label, onUndo, expiresAt }]);

    toast(`${label}`, {
      description: 'Tap to undo',
      duration: Math.min(durationMs, 10000),
      action: {
        label: 'Undo',
        onClick: () => {
          onUndo();
          setUndoableActions(prev => prev.filter(a => a.id !== id));
          toast.success('Action undone');
        },
      },
    });

    const timer = setTimeout(() => {
      setUndoableActions(prev => prev.filter(a => a.id !== id));
      undoTimers.current.delete(id);
    }, durationMs);
    undoTimers.current.set(id, timer);
    return id;
  }, []);

  const executeUndo = useCallback((id: string) => {
    setUndoableActions(prev => {
      const action = prev.find(a => a.id === id);
      if (action) {
        action.onUndo();
        toast.success('Action undone');
      }
      return prev.filter(a => a.id !== id);
    });
    const timer = undoTimers.current.get(id);
    if (timer) { clearTimeout(timer); undoTimers.current.delete(id); }
  }, []);

  // --- Sovereign Confirmation ---
  const requestConfirmation = useCallback((title: string, description: string, details: string[]): Promise<boolean> => {
    return new Promise(resolve => {
      confirmResolve.current = resolve;
      setPendingConfirmation({
        id: `confirm-${Date.now()}`,
        title,
        description,
        details,
        onConfirm: () => { resolve(true); setPendingConfirmation(null); },
        onCancel: () => { resolve(false); setPendingConfirmation(null); },
      });
    });
  }, []);

  // --- Confidence helpers ---
  const getConfidenceColor = useCallback((level: ConfidenceLevel) => {
    switch (level) {
      case 'verified': return 'hsl(142, 76%, 36%)';     // green
      case 'predictive': return 'hsl(45, 93%, 47%)';     // amber
      case 'needs_review': return 'hsl(0, 84%, 60%)';    // red
    }
  }, []);

  const getConfidenceLabel = useCallback((level: ConfidenceLevel) => {
    switch (level) {
      case 'verified': return 'Verified Logic';
      case 'predictive': return 'Predictive Guess';
      case 'needs_review': return 'Needs Review';
    }
  }, []);

  return (
    <TrustContext.Provider value={{
      thinkingSteps, isThinking, addThinkingStep, completeThinkingStep, clearThinking,
      undoableActions, registerUndoable, executeUndo,
      pendingConfirmation, requestConfirmation,
      getConfidenceColor, getConfidenceLabel,
    }}>
      {children}
    </TrustContext.Provider>
  );
}

export function useTrust() {
  const ctx = useContext(TrustContext);
  if (!ctx) throw new Error('useTrust must be used within TrustProvider');
  return ctx;
}
