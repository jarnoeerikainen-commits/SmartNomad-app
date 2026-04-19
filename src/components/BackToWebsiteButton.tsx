import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

/**
 * Floating pill that appears inside the app and lets demo users
 * jump back to the marketing landing page at "/".
 */
const BackToWebsiteButton: React.FC = () => {
  return (
    <Link
      to="/"
      aria-label="Back to SuperNomad website"
      className="fixed bottom-20 left-3 md:bottom-4 md:left-4 z-[60] inline-flex items-center gap-1.5 rounded-full border border-[hsl(43_96%_56%/0.4)] bg-[hsl(220_22%_10%/0.85)] backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white hover:bg-[hsl(220_22%_14%)] hover:border-[hsl(var(--gold))] transition-all shadow-lg"
    >
      <Globe className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
      Website
    </Link>
  );
};

export default BackToWebsiteButton;
