import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { classifyBirthYear } from '@/utils/mobileEntry';

export default function DeferredAgeAccess({ onVerified }: { onVerified: () => void }) {
  const [year, setYear] = useState('');
  const [group, setGroup] = useState<string | null>(() => localStorage.getItem('ageGroup'));
  const verify = () => {
    const result = classifyBirthYear(Number(year), new Date().getFullYear());
    if (!result) return;
    localStorage.setItem('ageGroup', result);
    setGroup(result);
    if (result === 'adult') onVerified();
  };
  return (
    <section className="mx-auto max-w-sm space-y-4 py-8">
      <h2 className="text-xl font-semibold">{group === 'child' ? 'Parental consent required' : 'Age verification'}</h2>
      {group === 'child' || group === 'teen' ? (
        <p className="text-muted-foreground">{group === 'child' ? 'Access requires a parent or guardian’s consent.' : 'This feature is available to adults only. Travel utilities remain available.'}</p>
      ) : (
        <form onSubmit={(event) => { event.preventDefault(); verify(); }} className="space-y-3">
          <label htmlFor="access-birth-year">Birth year</label>
          <Input id="access-birth-year" type="number" min={1920} max={new Date().getFullYear()} value={year} onChange={(event) => setYear(event.target.value)} />
          <Button type="submit" disabled={!classifyBirthYear(Number(year), new Date().getFullYear())}>Continue</Button>
        </form>
      )}
    </section>
  );
}