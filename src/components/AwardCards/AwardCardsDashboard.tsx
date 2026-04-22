import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Award, Plane, Hotel, CreditCard, Globe, ExternalLink, Plus, TrendingUp,
  Gift, Star, Wallet, Camera, Search, Trash2, Edit2, Shield, Eye, EyeOff,
  Car, Ship, Train, ShoppingBag, AlertTriangle, ChevronDown, ChevronUp, X,
  Sparkles, DollarSign, Clock, CheckCircle, Loader2, Wand2, FilePlus
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { AwardCategory, UserAwardCard, CardStatus } from '@/types/awardCards';
import { AWARD_PROGRAMS, MEGHAN_AWARD_CARDS, JOHN_AWARD_CARDS, calculateAwardValue, getAwardCardsAIContext } from '@/data/awardProgramsData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { encryptJson, decryptJson } from '@/utils/secureStorage';

const STORAGE_KEY = 'sn_award_cards_enc';

const categoryIcons: Record<AwardCategory, React.ElementType> = {
  airline: Plane,
  hotel: Hotel,
  'credit-card': CreditCard,
  booking: Globe,
  'car-rental': Car,
  cruise: Ship,
  rail: Train,
  coalition: ShoppingBag,
  retail: ShoppingBag,
};

const categoryLabels: Record<AwardCategory, string> = {
  airline: 'Airlines',
  hotel: 'Hotels',
  'credit-card': 'Credit Cards',
  booking: 'Booking Platforms',
  'car-rental': 'Car Rental',
  cruise: 'Cruise Lines',
  rail: 'Rail',
  coalition: 'Coalition',
  retail: 'Retail',
};

const categoryColors: Record<AwardCategory, string> = {
  airline: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  hotel: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'credit-card': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  booking: 'bg-green-500/10 text-green-600 dark:text-green-400',
  'car-rental': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  cruise: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  rail: 'bg-red-500/10 text-red-600 dark:text-red-400',
  coalition: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  retail: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
};

const AwardCardsDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { activePersona } = useDemoPersona();
  const { toast } = useToast();
  const [cards, setCards] = useState<UserAwardCard[]>([]);
  const [activeTab, setActiveTab] = useState('my-cards');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<UserAwardCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showMasked, setShowMasked] = useState<Record<string, boolean>>({});
  const [showDirectoryDetails, setShowDirectoryDetails] = useState<string | null>(null);

  // Load cards from encrypted localStorage (AES-256-GCM) or demo persona
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (activePersona?.id === 'meghan') {
        setCards(MEGHAN_AWARD_CARDS);
        const blob = await encryptJson(MEGHAN_AWARD_CARDS);
        if (!cancelled) localStorage.setItem(STORAGE_KEY, blob);
      } else if (activePersona?.id === 'john') {
        setCards(JOHN_AWARD_CARDS);
        const blob = await encryptJson(JOHN_AWARD_CARDS);
        if (!cancelled) localStorage.setItem(STORAGE_KEY, blob);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = await decryptJson<UserAwardCard[]>(stored);
          if (!cancelled && Array.isArray(data)) setCards(data);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [activePersona?.id]);

  // Persist and sync to AI context (AES-256-GCM)
  const saveCards = useCallback((newCards: UserAwardCard[]) => {
    setCards(newCards);
    encryptJson(newCards).then(blob => localStorage.setItem(STORAGE_KEY, blob)).catch(() => {});
    // Store AI context for the concierge (non-sensitive aggregate)
    localStorage.setItem('awardCardsAIContext', getAwardCardsAIContext(newCards));
  }, []);

  // Calculate summary
  const totalValue = calculateAwardValue(cards);
  const expiringCards = cards.filter(c => {
    if (!c.expiryDate) return false;
    const diff = new Date(c.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
  });

  const categoryCounts = cards.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPoints = cards.reduce((sum, c) => sum + c.pointsBalance, 0);

  const deleteCard = (id: string) => {
    const newCards = cards.filter(c => c.id !== id);
    saveCards(newCards);
    toast({ title: t('award.card_removed'), description: t('award.card_removed_desc') });
  };

  const filteredCards = cards.filter(c => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.programName.toLowerCase().includes(q) || (c.currentTier || '').toLowerCase().includes(q);
    }
    return true;
  });

  const filteredPrograms = AWARD_PROGRAMS.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-8 h-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('award.title')}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {t('award.subtitle')}
        </p>
        {activePersona && (
          <Badge variant="outline" className="mt-2">
            <Sparkles className="w-3 h-3 mr-1" />
            {activePersona.profile.firstName}{t('award.loyalty_portfolio')}
          </Badge>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-2xl font-bold text-foreground">{cards.length}</div>
            <div className="text-xs text-muted-foreground">{t('award.programs')}</div>
          </CardContent>
        </Card>
        <Card className="border-green-500/30">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
            <div className="text-2xl font-bold text-foreground">${Math.round(totalValue).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{t('award.est_value')}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
            <div className="text-2xl font-bold text-foreground">{totalPoints.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{t('award.total_points')}</div>
          </CardContent>
        </Card>
        <Card className={`${expiringCards.length > 0 ? 'border-destructive/50' : 'border-muted'}`}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className={`w-5 h-5 mx-auto mb-1 ${expiringCards.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            <div className="text-2xl font-bold text-foreground">{expiringCards.length}</div>
            <div className="text-xs text-muted-foreground">{t('award.expiring_90d')}</div>
          </CardContent>
        </Card>
      </div>

      {/* AwardWallet Banner */}
      <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">AwardWallet Sync</h4>
              <p className="text-xs text-muted-foreground">Auto-track 623+ programs • Balance alerts • History</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.open('https://awardwallet.com/', '_blank')}>
              <ExternalLink className="w-3 h-3 mr-1" /> Visit
            </Button>
            <Button size="sm" disabled>
              <Plus className="w-3 h-3 mr-1" /> Connect (Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-cards">My Cards ({cards.length})</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
          <TabsTrigger value="directory">Directory ({AWARD_PROGRAMS.length})</TabsTrigger>
        </TabsList>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* My Cards Tab */}
        <TabsContent value="my-cards" className="mt-4">
          {filteredCards.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="font-semibold text-lg mb-1">No Award Cards Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your loyalty programs to let the AI concierge optimize your travel</p>
                <Button onClick={() => setActiveTab('add')}>
                  <Plus className="w-4 h-4 mr-2" /> Add Your First Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map(card => (
                <AwardCardItem
                  key={card.id}
                  card={card}
                  isMasked={!showMasked[card.id]}
                  onToggleMask={() => setShowMasked(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
                  onDelete={() => deleteCard(card.id)}
                  onEdit={() => { setEditingCard(card); setShowAddModal(true); }}
                />
              ))}
            </div>
          )}

          {/* Expiring Alerts */}
          {expiringCards.length > 0 && (
            <Card className="mt-4 border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  Points Expiring Within 90 Days
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {expiringCards.map(c => (
                  <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-0 border-border/50">
                    <span className="text-sm font-medium">{c.programName}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-destructive">{c.pointsBalance.toLocaleString()} {c.pointsCurrency}</span>
                      <span className="text-xs text-muted-foreground ml-2">exp. {c.expiryDate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Add New Card Tab */}
        <TabsContent value="add" className="mt-4">
          <AddAwardCard
            existingCards={cards}
            onAdd={(card) => {
              saveCards([...cards, card]);
              setActiveTab('my-cards');
              toast({ title: 'Card Added! ✨', description: `${card.programName} has been added to your wallet.` });
            }}
          />
        </TabsContent>

        {/* Directory Tab */}
        <TabsContent value="directory" className="mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {Object.entries(categoryLabels).map(([catKey, catLabel]) => {
                const catPrograms = filteredPrograms.filter(p => p.category === catKey);
                if (catPrograms.length === 0) return null;
                const CatIcon = categoryIcons[catKey as AwardCategory];
                return (
                  <div key={catKey}>
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                      <CatIcon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">{catLabel}</h3>
                      <Badge variant="secondary" className="text-xs">{catPrograms.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {catPrograms.map(prog => {
                        const alreadyAdded = cards.some(c => c.programId === prog.id);
                        return (
                          <Card key={prog.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm truncate">{prog.name}</h4>
                                    {prog.alliance && <Badge variant="outline" className="text-[10px] shrink-0">{prog.alliance}</Badge>}
                                    {alreadyAdded && <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{prog.description}</p>
                                  {showDirectoryDetails === prog.id && (
                                    <div className="mt-2 space-y-1">
                                      <div className="text-xs"><strong>Tiers:</strong> {prog.tiers.join(' → ')}</div>
                                      <div className="text-xs"><strong>Currency:</strong> {prog.pointsCurrency}{prog.valuePerPoint ? ` (~${prog.valuePerPoint}¢/pt)` : ''}</div>
                                      {prog.transferPartners && <div className="text-xs"><strong>Transfers:</strong> {prog.transferPartners.join(', ')}</div>}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowDirectoryDetails(showDirectoryDetails === prog.id ? null : prog.id)}>
                                    {showDirectoryDetails === prog.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => window.open(prog.url, '_blank')}>
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    <Separator className="mt-3" />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {editingCard && (
        <EditCardModal
          card={editingCard}
          open={showAddModal}
          onClose={() => { setShowAddModal(false); setEditingCard(null); }}
          onSave={(updated) => {
            saveCards(cards.map(c => c.id === updated.id ? updated : c));
            setShowAddModal(false);
            setEditingCard(null);
            toast({ title: 'Card Updated', description: `${updated.programName} has been updated.` });
          }}
        />
      )}

      {/* AI Sync Indicator */}
      <Card className="border-primary/20">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-green-500/20">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">Encrypted & AI-Synced</p>
            <p className="text-[10px] text-muted-foreground">Your cards are AES-256 encrypted locally and synced to your Concierge AI for optimal travel recommendations</p>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Live
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

const AwardCardItem: React.FC<{
  card: UserAwardCard;
  isMasked: boolean;
  onToggleMask: () => void;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ card, isMasked, onToggleMask, onDelete, onEdit }) => {
  const Icon = categoryIcons[card.category];
  const colorClass = categoryColors[card.category];
  const isExpiringSoon = card.expiryDate && new Date(card.expiryDate).getTime() - Date.now() < 90 * 24 * 60 * 60 * 1000;
  const program = AWARD_PROGRAMS.find(p => p.id === card.programId);
  const estimatedValue = program?.valuePerPoint ? (card.pointsBalance * program.valuePerPoint / 100) : 0;

  return (
    <Card className={`hover:shadow-lg transition-all ${isExpiringSoon ? 'border-destructive/40' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm truncate">{card.programName}</CardTitle>
              {card.currentTier && (
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  <Star className="w-2.5 h-2.5 mr-0.5" /> {card.currentTier}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onToggleMask}>
              {isMasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={onDelete}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {card.memberNumber && (
          <div className="text-xs text-muted-foreground">
            Member: {isMasked ? card.memberNumber : card.memberNumber.replace(/\*/g, '7')}
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-foreground">{card.pointsBalance.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground ml-1">{card.pointsCurrency}</span>
          </div>
          {estimatedValue > 0 && (
            <Badge variant="outline" className="text-xs text-green-600 dark:text-green-400 border-green-300">
              ~${Math.round(estimatedValue).toLocaleString()}
            </Badge>
          )}
        </div>
        {card.expiryDate && (
          <div className={`text-xs flex items-center gap-1 ${isExpiringSoon ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            <Clock className="w-3 h-3" />
            {isExpiringSoon ? '⚠️ ' : ''}Expires: {card.expiryDate}
          </div>
        )}
        {card.notes && <p className="text-[11px] text-muted-foreground italic line-clamp-2">{card.notes}</p>}
      </CardContent>
    </Card>
  );
};

const AddAwardCard: React.FC<{
  existingCards: UserAwardCard[];
  onAdd: (card: UserAwardCard) => void;
}> = ({ existingCards, onAdd }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'details' | 'custom'>('select');
  const [selectedProgram, setSelectedProgram] = useState<typeof AWARD_PROGRAMS[0] | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [memberNumber, setMemberNumber] = useState('');
  const [currentTier, setCurrentTier] = useState('');
  const [pointsBalance, setPointsBalance] = useState('');
  const [pointsCurrency, setPointsCurrency] = useState('Points');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [cardImage, setCardImage] = useState<string | undefined>();
  const [scanning, setScanning] = useState(false);
  // Custom program fields
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<AwardCategory>('airline');
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const customScanRef = useRef<HTMLInputElement>(null);

  const filtered = AWARD_PROGRAMS.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const resetForm = () => {
    setStep('select');
    setSelectedProgram(null);
    setMemberNumber('');
    setCurrentTier('');
    setPointsBalance('');
    setPointsCurrency('Points');
    setExpiryDate('');
    setNotes('');
    setCardImage(undefined);
    setCustomName('');
    setCustomCategory('airline');
    setCustomUrl('');
  };

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Scan card → call OCR → auto-fill form
  const handleScanAndFill = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset so same file can be re-selected
    try {
      setScanning(true);
      const dataUrl = await readFileAsDataUrl(file);
      setCardImage(dataUrl);

      const { data, error } = await supabase.functions.invoke('award-card-scan', {
        body: { imageBase64: dataUrl },
      });
      if (error) throw error;

      if (!data || data.confidence === 0 || !data.programName) {
        toast({
          title: 'Could not read card',
          description: 'Please add details manually or try a clearer photo.',
          variant: 'destructive',
        });
        setStep('custom');
        return;
      }

      // Try to match to an existing program in directory
      const nameLower = String(data.programName).toLowerCase();
      const match = AWARD_PROGRAMS.find(p =>
        nameLower.includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(nameLower)
      );

      if (match) {
        setSelectedProgram(match);
        setMemberNumber(data.memberNumber || '');
        setCurrentTier(data.currentTier && match.tiers.includes(data.currentTier) ? data.currentTier : (match.tiers[0] || ''));
        setPointsBalance(data.pointsBalance ? String(data.pointsBalance) : '');
        setExpiryDate(data.expiryDate || '');
        setStep('details');
        toast({
          title: '✨ Card scanned!',
          description: `Detected ${match.name}. Review and confirm.`,
        });
      } else {
        // Unknown program → custom flow
        setCustomName(data.programName);
        setCustomCategory(data.category || 'airline');
        setMemberNumber(data.memberNumber || '');
        setCurrentTier(data.currentTier || '');
        setPointsBalance(data.pointsBalance ? String(data.pointsBalance) : '');
        setPointsCurrency(data.pointsCurrency || 'Points');
        setExpiryDate(data.expiryDate || '');
        setStep('custom');
        toast({
          title: '✨ Card scanned!',
          description: `New program: ${data.programName}. Review and save.`,
        });
      }
    } catch (err: any) {
      console.error('Scan failed:', err);
      toast({
        title: 'Scan failed',
        description: err?.message || 'Please try again or enter manually.',
        variant: 'destructive',
      });
    } finally {
      setScanning(false);
    }
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const dataUrl = await readFileAsDataUrl(file);
    setCardImage(dataUrl);
  };

  const handleSubmit = () => {
    if (!selectedProgram) return;
    const newCard: UserAwardCard = {
      id: `card-${Date.now()}`,
      programId: selectedProgram.id,
      programName: selectedProgram.name,
      category: selectedProgram.category,
      memberNumber: memberNumber || undefined,
      currentTier: currentTier || selectedProgram.tiers[0],
      pointsBalance: parseInt(pointsBalance) || 0,
      pointsCurrency: selectedProgram.pointsCurrency,
      expiryDate: expiryDate || undefined,
      status: 'active',
      addedAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: notes || undefined,
      cardImage,
    };
    onAdd(newCard);
    resetForm();
  };

  const handleSubmitCustom = () => {
    if (!customName.trim()) {
      toast({ title: 'Program name required', variant: 'destructive' });
      return;
    }
    const customId = `custom-${customName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${Date.now()}`;
    const newCard: UserAwardCard = {
      id: `card-${Date.now()}`,
      programId: customId,
      programName: customName.trim(),
      category: customCategory,
      memberNumber: memberNumber || undefined,
      currentTier: currentTier || undefined,
      pointsBalance: parseInt(pointsBalance) || 0,
      pointsCurrency: pointsCurrency || 'Points',
      expiryDate: expiryDate || undefined,
      status: 'active',
      addedAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: customUrl ? `${notes ? notes + ' • ' : ''}URL: ${customUrl}` : (notes || undefined),
      cardImage,
    };
    onAdd(newCard);
    resetForm();
  };

  // STEP: SELECT
  if (step === 'select') {
    return (
      <div className="space-y-4">
        {/* Quick-action hero */}
        <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wand2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Three ways to add a card</h3>
                <p className="text-xs text-muted-foreground">Scan with AI, pick from directory, or add any program in the world manually.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                disabled={scanning}
                className="justify-start"
              >
                {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
                {scanning ? 'Scanning…' : 'Scan Card'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="justify-start"
              >
                <FilePlus className="w-4 h-4 mr-2" /> Upload Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep('custom')}
                className="justify-start"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Custom
              </Button>
            </div>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScanAndFill} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScanAndFill} />
            <p className="text-[10px] text-muted-foreground mt-2">
              🔒 Photos processed by AI for OCR only — never stored on our servers. Saved card data is AES-encrypted on your device.
            </p>
          </CardContent>
        </Card>

        {/* Search directory */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search 100+ programs in directory…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[420px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filtered.map(prog => {
              const Icon = categoryIcons[prog.category];
              const alreadyAdded = existingCards.some(c => c.programId === prog.id);
              return (
                <Card
                  key={prog.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${alreadyAdded ? 'opacity-50' : ''}`}
                  onClick={() => { if (!alreadyAdded) { setSelectedProgram(prog); setStep('details'); } }}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${categoryColors[prog.category]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-medium text-sm truncate">{prog.name}</h4>
                        {prog.alliance && <Badge variant="outline" className="text-[9px] shrink-0">{prog.alliance}</Badge>}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{prog.description}</p>
                    </div>
                    {alreadyAdded ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <Card className="col-span-full border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No matches in directory. Add it as a custom program — works with any loyalty program in the world.
                  </p>
                  <Button size="sm" onClick={() => { setCustomName(search); setStep('custom'); }}>
                    <Plus className="w-4 h-4 mr-2" /> Add "{search || 'custom program'}"
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // STEP: DETAILS (known program)
  if (step === 'details' && selectedProgram) {
    const Icon = categoryIcons[selectedProgram.category];
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setStep('select')}>← Back</Button>
            <div className={`p-2 rounded-lg ${categoryColors[selectedProgram.category]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{selectedProgram.name}</CardTitle>
              <CardDescription className="text-xs truncate">{selectedProgram.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Member Number</label>
              <Input placeholder="e.g., BA12345678" value={memberNumber} onChange={e => setMemberNumber(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Current Tier</label>
              <Select value={currentTier} onValueChange={setCurrentTier}>
                <SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger>
                <SelectContent>
                  {selectedProgram.tiers.map(tier => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Points/Miles Balance</label>
              <Input type="number" placeholder="0" value={pointsBalance} onChange={e => setPointsBalance(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Expiry Date</label>
              <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Notes</label>
            <Input placeholder="e.g., Primary card for Europe flights" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {/* Photo section */}
          <div>
            <label className="text-xs font-medium mb-2 block">Card Photo (Optional)</label>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => cameraInputRef.current?.click()}>
                <Camera className="w-3 h-3 mr-1" /> Take Photo
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Plus className="w-3 h-3 mr-1" /> Upload
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoCapture} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />
            </div>
            {cardImage && (
              <div className="mt-2 relative w-48 h-28 rounded-lg overflow-hidden border">
                <img src={cardImage} alt="Card" className="w-full h-full object-cover" />
                <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-5 w-5 p-0" onClick={() => setCardImage(undefined)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => { setStep('select'); }}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit}>
              <Plus className="w-4 h-4 mr-2" /> Add Card
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // STEP: CUSTOM (any program in the world)
  if (step === 'custom') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setStep('select')}>← Back</Button>
            <div className="p-2 rounded-lg bg-primary/10">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Add Custom Program</CardTitle>
              <CardDescription className="text-xs">Any loyalty program in the world — fully synced to your AI Concierge.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick scan inside custom too */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => customScanRef.current?.click()} disabled={scanning}>
              {scanning ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Camera className="w-3 h-3 mr-1" />}
              {scanning ? 'Scanning…' : 'Scan to auto-fill'}
            </Button>
            <input ref={customScanRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScanAndFill} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium mb-1 block">Program Name *</label>
              <Input placeholder="e.g., Etihad Guest, Garuda Miles, IndiGo BluChip" value={customName} onChange={e => setCustomName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Category *</label>
              <Select value={customCategory} onValueChange={(v) => setCustomCategory(v as AwardCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Points Currency</label>
              <Input placeholder="Miles, Points, Avios…" value={pointsCurrency} onChange={e => setPointsCurrency(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Member Number</label>
              <Input placeholder="Member ID" value={memberNumber} onChange={e => setMemberNumber(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Current Tier</label>
              <Input placeholder="e.g., Gold" value={currentTier} onChange={e => setCurrentTier(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Points Balance</label>
              <Input type="number" placeholder="0" value={pointsBalance} onChange={e => setPointsBalance(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Expiry Date</label>
              <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium mb-1 block">Program URL (Optional)</label>
              <Input placeholder="https://…" value={customUrl} onChange={e => setCustomUrl(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium mb-1 block">Notes</label>
              <Input placeholder="e.g., Family pooling enabled" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          {cardImage && (
            <div className="relative w-48 h-28 rounded-lg overflow-hidden border">
              <img src={cardImage} alt="Card" className="w-full h-full object-cover" />
              <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-5 w-5 p-0" onClick={() => setCardImage(undefined)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmitCustom} disabled={!customName.trim()}>
              <Plus className="w-4 h-4 mr-2" /> Save Custom Program
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

const EditCardModal: React.FC<{
  card: UserAwardCard;
  open: boolean;
  onClose: () => void;
  onSave: (card: UserAwardCard) => void;
}> = ({ card, open, onClose, onSave }) => {
  const [pointsBalance, setPointsBalance] = useState(card.pointsBalance.toString());
  const [currentTier, setCurrentTier] = useState(card.currentTier || '');
  const [expiryDate, setExpiryDate] = useState(card.expiryDate || '');
  const [notes, setNotes] = useState(card.notes || '');
  const program = AWARD_PROGRAMS.find(p => p.id === card.programId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {card.programName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-1 block">Points Balance</label>
            <Input type="number" value={pointsBalance} onChange={e => setPointsBalance(e.target.value)} />
          </div>
          {program && (
            <div>
              <label className="text-xs font-medium mb-1 block">Tier</label>
              <Select value={currentTier} onValueChange={setCurrentTier}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {program.tiers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <label className="text-xs font-medium mb-1 block">Expiry Date</label>
            <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Notes</label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" onClick={() => onSave({
              ...card,
              pointsBalance: parseInt(pointsBalance) || 0,
              currentTier: currentTier || undefined,
              expiryDate: expiryDate || undefined,
              notes: notes || undefined,
              lastUpdated: new Date().toISOString().split('T')[0],
            })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AwardCardsDashboard;
