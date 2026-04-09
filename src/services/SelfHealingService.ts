/**
 * Self-Healing API Call Service
 * Provides retry logic with auto-diagnosis and parameter correction
 * for all Supabase Edge Function calls. Inspired by Composio's self-healing pattern.
 */

import { supabase } from '@/integrations/supabase/client';

interface CallOptions {
  /** Max retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in ms between retries (doubles each attempt) */
  baseDelay?: number;
  /** Timeout per attempt in ms (default: 30000) */
  timeout?: number;
  /** Whether to auto-fix common parameter issues */
  autoFix?: boolean;
  /** Callback for retry events (for UI feedback) */
  onRetry?: (attempt: number, error: string, fix?: string) => void;
}

interface CallResult<T> {
  data: T | null;
  error: string | null;
  attempts: number;
  fixes: string[];
  latencyMs: number;
}

// Common error patterns and their auto-fix strategies
const ERROR_FIXES: Array<{
  pattern: RegExp;
  fix: (params: Record<string, any>, error: string) => { params: Record<string, any>; description: string } | null;
}> = [
  // Missing required field → provide sensible default
  {
    pattern: /missing.*(?:device_id|deviceId)/i,
    fix: (params) => {
      const deviceId = localStorage.getItem('snomad_device_id') || 'demo-device';
      return { params: { ...params, device_id: deviceId }, description: 'Auto-injected device_id from local session' };
    },
  },
  // Invalid date format → normalize to ISO
  {
    pattern: /invalid.*date|date.*format/i,
    fix: (params) => {
      const fixed = { ...params };
      for (const key of Object.keys(fixed)) {
        if (key.includes('date') && typeof fixed[key] === 'string') {
          try {
            fixed[key] = new Date(fixed[key]).toISOString().split('T')[0];
          } catch { /* ignore */ }
        }
      }
      return { params: fixed, description: 'Normalized date fields to ISO format' };
    },
  },
  // Rate limited → exponential backoff handled automatically
  {
    pattern: /rate.?limit|too many requests|429/i,
    fix: () => null, // Just retry with backoff
  },
  // JSON parse error → trim and re-serialize
  {
    pattern: /json|parse|syntax/i,
    fix: (params) => {
      const cleaned = { ...params };
      for (const key of Object.keys(cleaned)) {
        if (typeof cleaned[key] === 'string') {
          cleaned[key] = cleaned[key].trim();
        }
      }
      return { params: cleaned, description: 'Cleaned string parameters' };
    },
  },
  // Empty or null field that's required
  {
    pattern: /required|cannot be null|empty/i,
    fix: (params) => {
      const fixed = { ...params };
      for (const key of Object.keys(fixed)) {
        if (fixed[key] === null || fixed[key] === undefined || fixed[key] === '') {
          if (key.includes('language')) fixed[key] = 'en';
          else if (key.includes('limit')) fixed[key] = 10;
          else if (key.includes('page')) fixed[key] = 1;
        }
      }
      return { params: fixed, description: 'Filled empty required fields with defaults' };
    },
  },
  // Timeout → reduce payload size
  {
    pattern: /timeout|timed out|deadline/i,
    fix: (params) => {
      const fixed = { ...params };
      // Reduce message history if present
      if (Array.isArray(fixed.messages) && fixed.messages.length > 10) {
        fixed.messages = [
          fixed.messages[0], // system prompt
          ...fixed.messages.slice(-6), // keep last 6 messages
        ];
        return { params: fixed, description: 'Trimmed conversation history to reduce payload' };
      }
      return null;
    },
  },
];

/**
 * Attempt to auto-fix parameters based on error message
 */
function tryAutoFix(
  params: Record<string, any>,
  errorMessage: string
): { params: Record<string, any>; description: string } | null {
  for (const { pattern, fix } of ERROR_FIXES) {
    if (pattern.test(errorMessage)) {
      const result = fix(params, errorMessage);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Self-healing edge function invocation.
 * Automatically retries with exponential backoff and parameter correction.
 */
export async function invokeWithHealing<T = any>(
  functionName: string,
  params: Record<string, any>,
  options: CallOptions = {}
): Promise<CallResult<T>> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    timeout = 30000,
    autoFix = true,
    onRetry,
  } = options;

  const startTime = Date.now();
  let currentParams = { ...params };
  const fixes: string[] = [];
  let lastError = '';

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: currentParams,
      });

      clearTimeout(timeoutId);

      if (error) {
        lastError = error.message || String(error);
        throw new Error(lastError);
      }

      return {
        data: data as T,
        error: null,
        attempts: attempt,
        fixes,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);

      if (attempt > maxRetries) break;

      // Try auto-fix
      if (autoFix) {
        const fix = tryAutoFix(currentParams, lastError);
        if (fix) {
          currentParams = fix.params;
          fixes.push(fix.description);
          onRetry?.(attempt, lastError, fix.description);
        } else {
          onRetry?.(attempt, lastError);
        }
      } else {
        onRetry?.(attempt, lastError);
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    data: null,
    error: `Failed after ${maxRetries + 1} attempts. Last error: ${lastError}`,
    attempts: maxRetries + 1,
    fixes,
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Wrapper for common AI function calls with built-in healing.
 */
export async function invokeAI(
  functionName: string,
  params: Record<string, any>,
  onRetry?: (attempt: number, error: string, fix?: string) => void
): Promise<CallResult<any>> {
  return invokeWithHealing(functionName, params, {
    maxRetries: 2,
    baseDelay: 1500,
    timeout: 45000,
    autoFix: true,
    onRetry,
  });
}

/**
 * Health check for edge functions — useful for status dashboards
 */
export async function checkFunctionHealth(functionName: string): Promise<{
  healthy: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const { error } = await supabase.functions.invoke(functionName, {
      body: { healthCheck: true },
    });
    return {
      healthy: !error,
      latencyMs: Date.now() - start,
      error: error?.message,
    };
  } catch (err) {
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
