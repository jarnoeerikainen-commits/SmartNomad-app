import { describe, it, expect } from 'vitest';
import { parseCalendarBlocks } from '@/utils/calendarProposalParser';

describe('parseCalendarBlocks', () => {
  it('extracts a single proposal and replaces with token', () => {
    const md = [
      'Sure — adding it now.',
      '```calendar',
      '{ "title": "Padel with Marcus", "start": "2026-04-25T18:00", "category": "sport", "location": "Hurlingham Club" }',
      '```',
      'Anything else?',
    ].join('\n');

    const { text, proposals } = parseCalendarBlocks(md);
    expect(proposals).toHaveLength(1);
    expect(proposals[0]).toHaveLength(1);
    expect(proposals[0][0].title).toBe('Padel with Marcus');
    expect(proposals[0][0].category).toBe('sport');
    expect(text).toContain('{{CALENDAR_PROPOSAL_0}}');
    expect(text).not.toContain('```calendar');
  });

  it('parses an array of proposals in one block', () => {
    const md = [
      '```calendar',
      JSON.stringify([
        { title: 'BA117 LHR→JFK', start: '2026-05-10T08:30', category: 'travel' },
        { title: 'Le Bernardin 8pm', start: '2026-05-10T20:00', category: 'meal' },
      ]),
      '```',
    ].join('\n');

    const { proposals } = parseCalendarBlocks(md);
    expect(proposals[0]).toHaveLength(2);
    expect(proposals[0][1].category).toBe('meal');
  });

  it('tolerates trailing commas in the JSON block', () => {
    const md = [
      '```calendar',
      '{ "title": "Yoga", "start": "2026-04-30T07:00", "category": "wellness", }',
      '```',
    ].join('\n');

    const { proposals } = parseCalendarBlocks(md);
    expect(proposals[0][0].title).toBe('Yoga');
  });

  it('drops blocks missing required fields', () => {
    const md = [
      '```calendar',
      '{ "category": "sport" }',
      '```',
    ].join('\n');

    const { proposals } = parseCalendarBlocks(md);
    expect(proposals).toHaveLength(0);
  });

  it('normalises a date-only start to 09:00', () => {
    const md = [
      '```calendar',
      '{ "title": "Visa appointment", "start": "2026-06-12", "category": "legal" }',
      '```',
    ].join('\n');

    const { proposals } = parseCalendarBlocks(md);
    expect(proposals[0][0].start).toBe('2026-06-12T09:00');
  });
});
