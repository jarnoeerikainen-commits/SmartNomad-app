import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

/**
 * Floating website shortcut shown inside the app.
 *
 * Desktop only (md+). On mobile these links are rendered inline inside
 * the Concierge top bar via <ConciergeQuickLinks /> to avoid covering
 * the chat input area.
 */
const BackToWebsiteButton: React.FC = () => {
  return (
    <div className="hidden md:flex fixed md:bottom-4 md:left-4 z-[60] flex-col gap-2">
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
 * Compact icon-only website link, designed
 * to live inline inside the mobile Concierge top bar (next to the settings
 * gear). Keeps the buttons accessible without obstructing the chat input.
 */
export const ConciergeQuickLinks: React.FC = () => {
  return (
    <>
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
