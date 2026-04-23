import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Briefcase } from 'lucide-react';

/**
 * Floating pills shown inside the app for demo users:
 *  • "Website" — back to the marketing landing page
 *  • "Back Office" — straight to the staff/investor admin shell
 *
 * Desktop only (md+). On mobile these links are rendered inline inside
 * the Concierge top bar via <ConciergeQuickLinks /> to avoid covering
 * the chat input area.
 */
const BackToWebsiteButton: React.FC = () => {
  return (
    <div className="hidden md:flex fixed md:bottom-4 md:left-4 z-[60] flex-col gap-2">
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

/**
 * Compact icon-only versions of the Website / Back Office links, designed
 * to live inline inside the mobile Concierge top bar (next to the settings
 * gear). Keeps the buttons accessible without obstructing the chat input.
 */
export const ConciergeQuickLinks: React.FC = () => {
  return (
    <>
      <Link
        to="/admin"
        aria-label="Open SuperNomad Back Office"
        title="Back Office"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
      >
        <Briefcase className="h-4 w-4 text-[hsl(var(--gold))]" />
      </Link>
      <Link
        to="/"
        aria-label="Back to SuperNomad website"
        title="Website"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
      >
        <Globe className="h-4 w-4 text-[hsl(var(--gold))]" />
      </Link>
    </>
  );
};

export default BackToWebsiteButton;
