import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminAgentLive from '../AdminAgentLive';
import { AdminAgentActivityService } from '@/services/AdminAgentActivityService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(async () => ({ data: { ok: true }, error: null })),
    },
  },
}));

describe('AdminAgentLive slow-response resilience', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    localStorage.setItem('demoPersona', JSON.stringify({ id: 'john', name: 'John Demo' }));
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    localStorage.clear();
  });

  it('keeps a slow concierge run visible as running, then updates to completed without crashing', () => {
    const errors: unknown[] = [];
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => errors.push(args));

    render(<AdminAgentLive />);

    let runId = '';
    act(() => {
      runId = AdminAgentActivityService.startRun({
        surface: 'Concierge AI',
        command: 'John asks for verified hotel recommendations with websites and reviews',
        functionName: 'travel-assistant',
      });
    });

    expect(screen.getByText('AI Agent Workstream')).toBeInTheDocument();
    expect(screen.getByText('RUNNING')).toBeInTheDocument();
    expect(screen.getByText(/John asks for verified hotel recommendations/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2_500);
    });

    expect(screen.getByText('RUNNING')).toBeInTheDocument();
    expect(screen.getAllByText(/Source verifier|Context builder|Intent router/i).length).toBeGreaterThan(0);

    act(() => {
      AdminAgentActivityService.completeRun(runId, 'Completed after slow verified-source checks.', {
        responseExcerpt: 'Verified concierge response: use Hotel Example only after checking https://example.com and verified review sources. Unknown items are disclosed.',
        answerAgents: ['Concierge Governor', 'Source Verifier', 'Hotel Specialist'],
        answerSources: ['Official website', 'Verified review source', 'Zero-hallucination truth protocol'],
        websites: ['https://example.com/hotel'],
        verificationNote: 'Slow response completed without stuck UI.',
      });
    });

    expect(screen.getAllByText('COMPLETED').length).toBeGreaterThan(0);
    expect(screen.getByText('Concierge response')).toBeInTheDocument();
    expect(screen.getByText(/Verified concierge response/i)).toBeInTheDocument();
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.getByText(/Slow response completed/i)).toBeInTheDocument();
    expect(errors).toHaveLength(0);

    errorSpy.mockRestore();
  });
});
