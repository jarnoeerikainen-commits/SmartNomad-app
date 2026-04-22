import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
  /** Minimum score (0-4) required to consider the password "acceptable". Default 3. */
  minScore?: number;
  className?: string;
}

interface Rule {
  label: string;
  passed: boolean;
}

/**
 * Compute a 0-4 strength score and the list of rule pass/fails.
 * Pure function so it can be reused by the parent (e.g. to disable submit).
 */
export function evaluatePassword(password: string): { score: 0 | 1 | 2 | 3 | 4; rules: Rule[] } {
  const rules: Rule[] = [
    { label: 'At least 10 characters', passed: password.length >= 10 },
    { label: 'Upper & lowercase letters', passed: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'A number', passed: /\d/.test(password) },
    { label: 'A symbol (e.g. ! @ # $)', passed: /[^A-Za-z0-9]/.test(password) },
  ];
  // Long passphrases (>=16 chars) get a bonus even without symbols.
  const long = password.length >= 16;
  const passed = rules.filter(r => r.passed).length + (long ? 1 : 0);
  const score = Math.max(0, Math.min(4, passed)) as 0 | 1 | 2 | 3 | 4;
  return { score, rules };
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'] as const;
const COLORS = ['bg-destructive', 'bg-destructive', 'bg-warning', 'bg-primary', 'bg-success'] as const;

/**
 * PasswordStrengthMeter — visual feedback at signup time.
 * Demo / guest flows do not see this; only rendered when the parent calls it
 * (i.e. inside the real signup form).
 */
const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  minScore = 3,
  className,
}) => {
  const { score, rules } = useMemo(() => evaluatePassword(password), [password]);
  if (!password) return null;

  return (
    <div className={cn('space-y-2 mt-1', className)} aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              score > i ? COLORS[score] : 'bg-muted',
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Password strength</span>
        <span
          className={cn(
            'font-medium',
            score < minScore ? 'text-destructive' : 'text-success',
          )}
        >
          {LABELS[score]}
        </span>
      </div>
      <ul className="space-y-1 text-xs">
        {rules.map(r => (
          <li
            key={r.label}
            className={cn(
              'flex items-center gap-1.5',
              r.passed ? 'text-success' : 'text-muted-foreground',
            )}
          >
            {r.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
