import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Briefcase } from 'lucide-react';

/**
 * Floating pills shown inside the app for demo users:
 *  • "Website" — back to the marketing landing page
 *  • "Back Office" — straight to the staff/investor admin shell
 *
 * Always visible on mobile and desktop, positioned above the bottom nav.
 */
const BackToWebsiteButton: React.FC = () => {
  return (
    <div
      className="fixed left-3 md:bottom-4 md:left-4 z-[60] flex flex-col gap-2"
      style={{
        bottom:
          typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
            ? 'calc(env(safe-area-inset-bottom, 0px) + 9rem)'
            : undefined,
      }}
    >
      <Link
        to="/admin"
        aria-label="Open SuperNomad Back Office"
        className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(43_96%_56%/0.5)] bg-[hsl(220_22%_10%/0.9)] backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white hover:bg-[hsl(220_22%_14%)] hover:border-[hsl(var(--gold))] transition-all shadow-lg"
      >
        <Briefcase className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
        Back Office
      </Link>
      <Link
        to="/"
        aria-label="Back to SuperNomad website"
        className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(43_96%_56%/0.4)] bg-[hsl(220_22%_10%/0.85)] backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white hover:bg-[hsl(220_22%_14%)] hover:border-[hsl(var(--gold))] transition-all shadow-lg"
      >
        <Globe className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
        Website
      </Link>
    </div>
  );
};

export default BackToWebsiteButton;
