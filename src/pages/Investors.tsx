import { InvestorsPitchDeck } from '@/components/investors/InvestorsPitchDeck';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Investors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export feature coming soon. Use browser Print to PDF for now (Ctrl+P or Cmd+P).",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">SuperNomad</span> · Investor Pitch Deck
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
            <div className="text-xs text-muted-foreground">
              $650K Raise @ $1.1M Pre-Money · 37% Equity
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <InvestorsPitchDeck />
      </div>
    </div>
  );
};

export default Investors;
