import { useState, useEffect } from 'react';
import { usePitchDeckData } from '@/hooks/usePitchDeckData';
import { PitchDeckNavigation } from './PitchDeckNavigation';
import { FinancialModelingPanel } from './FinancialModelingPanel';
import { CoverSlide } from './slides/CoverSlide';
import { ProblemSlide } from './slides/ProblemSlide';
import { SolutionSlide } from './slides/SolutionSlide';
import { MarketSlide } from './slides/MarketSlide';
import { ProductSlide } from './slides/ProductSlide';
import { BusinessModelSlide } from './slides/BusinessModelSlide';
import { TractionSlide } from './slides/TractionSlide';
import { TechnologySlide } from './slides/TechnologySlide';
import { CompetitionSlide } from './slides/CompetitionSlide';
import { GoToMarketSlide } from './slides/GoToMarketSlide';
import { FinancialsSlide } from './slides/FinancialsSlide';
import { TeamSlide } from './slides/TeamSlide';
import { AskSlide } from './slides/AskSlide';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InvestorsPitchDeck = () => {
  const { data, updateData, resetData } = usePitchDeckData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [showFinancialPanel, setShowFinancialPanel] = useState(false);
  const { toast } = useToast();
  const totalSlides = 12;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (e.key === 'Escape') {
      setIsPresentationMode(false);
    }
  };

  useEffect(() => {
    if (isPresentationMode) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [currentSlide, isPresentationMode]);

  const handleReset = () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      resetData();
      toast({
        title: 'Reset Complete',
        description: 'All pitch deck data restored to defaults.',
      });
    }
  };

  const slides = [
    <CoverSlide key={0} data={data.cover} onUpdate={(u) => updateData('cover', u)} />,
    <ProblemSlide key={1} data={data.problem} onUpdate={(u) => updateData('problem', u)} />,
    <SolutionSlide key={2} data={data.solution} onUpdate={(u) => updateData('solution', u)} />,
    <MarketSlide key={3} data={data.market} onUpdate={(u) => updateData('market', u)} />,
    <TractionSlide key={4} data={data.traction} onUpdate={(u) => updateData('traction', u)} />,
    <BusinessModelSlide key={5} data={data.businessModel} onUpdate={(u) => updateData('businessModel', u)} />,
    <TechnologySlide key={6} />,
    <GoToMarketSlide key={7} data={data.goToMarket} onUpdate={(u) => updateData('goToMarket', u)} />,
    <TeamSlide key={8} data={data.team} onUpdate={(u) => updateData('team', u)} />,
    <CompetitionSlide key={9} data={data.competition} onUpdate={(u) => updateData('competition', u)} />,
    <FinancialsSlide
      key={10}
      data={data.financials}
      onUpdate={(u) => updateData('financials', u)}
      onOpenModeling={() => setShowFinancialPanel(true)}
    />,
    <AskSlide key={11} data={data.ask} onUpdate={(u) => updateData('ask', u)} />,
  ];

  if (isPresentationMode) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <Button
          onClick={() => setIsPresentationMode(false)}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-7xl">{slides[currentSlide]}</div>
        </div>
        <div className="border-t bg-card/50 backdrop-blur-sm">
          <PitchDeckNavigation
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onPrevious={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            onNext={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
            onSlideSelect={setCurrentSlide}
            onPresentationMode={() => {}}
            onReset={handleReset}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Investor Pitch Deck</h1>
        <p className="text-muted-foreground">
          Click any text to edit • Adjust financial model in real-time • Present mode ready
        </p>
      </div>

      <div className="relative">
        {slides[currentSlide]}
        {showFinancialPanel && (
          <FinancialModelingPanel
            assumptions={data.financials.assumptions}
            onUpdate={(assumptions) => updateData('financials', { ...data.financials, assumptions })}
            onClose={() => setShowFinancialPanel(false)}
          />
        )}
      </div>

      <PitchDeckNavigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrevious={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
        onNext={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
        onSlideSelect={setCurrentSlide}
        onPresentationMode={() => setIsPresentationMode(true)}
        onReset={handleReset}
      />
    </div>
  );
};
