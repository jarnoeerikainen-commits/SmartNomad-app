import React, { useState } from 'react';
import { Upload, Sparkles, DollarSign, MapPin, Clock, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/use-toast';
import { ItemCategory, ItemCondition, CATEGORY_INFO, CONDITION_INFO, Urgency } from '@/types/marketplace';
import { DEMO_SELLERS } from '@/data/marketplaceData';

interface ItemListingWizardProps {
  open: boolean;
  onClose: () => void;
}

const ItemListingWizard: React.FC<ItemListingWizardProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const { getAIPricing, generateAIDescription, aiPricingLoading, aiDescriptionLoading, addListing } = useMarketplace();
  const { toast } = useToast();

  // Form state
  const [category, setCategory] = useState<ItemCategory | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<ItemCondition | ''>('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [city, setCity] = useState('Barcelona');
  const [neighborhood, setNeighborhood] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('flexible');
  const [availableUntil, setAvailableUntil] = useState('');
  
  // AI suggestions
  const [aiPriceSuggestion, setAiPriceSuggestion] = useState<number | null>(null);
  const [aiDescription, setAiDescription] = useState<string | null>(null);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleAIPricing = async () => {
    if (!category || !condition || !title) {
      toast({
        title: "Missing Information",
        description: "Please fill in category, title, and condition first",
        variant: "destructive"
      });
      return;
    }

    const result = await getAIPricing({
      category: category as ItemCategory,
      condition: condition as ItemCondition,
      title,
      description,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      location: city
    });

    if (result) {
      setAiPriceSuggestion(result.suggestedPrice);
      setPrice(result.suggestedPrice.toString());
    }
  };

  const handleAIDescription = async () => {
    if (!category || !condition || !title) {
      toast({
        title: "Missing Information",
        description: "Please fill in category, title, and condition first",
        variant: "destructive"
      });
      return;
    }

    const result = await generateAIDescription({
      category: category as ItemCategory,
      condition: condition as ItemCondition,
      title
    });

    if (result) {
      setAiDescription(result.description);
      setDescription(result.description);
    }
  };

  const handleSubmit = () => {
    if (!category || !title || !description || !condition || !price || !neighborhood || !availableUntil) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addListing({
      seller: DEMO_SELLERS[0],
      category: category as ItemCategory,
      title,
      description,
      condition: condition as ItemCondition,
      price: {
        amount: parseFloat(price),
        currency: 'EUR',
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        priceConfidence: aiPriceSuggestion ? 92 : undefined
      },
      location: {
        city,
        neighborhood,
        exactLocation: 'approximate'
      },
      availability: {
        availableFrom: new Date(),
        availableUntil: new Date(availableUntil),
        urgency
      },
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      tags: [category, condition],
      offers: [],
      aiFeatures: {
        pricingSuggestion: aiPriceSuggestion || undefined,
        demandScore: 75,
        descriptionQuality: aiDescription ? 95 : 70,
        aiGenerated: !!aiDescription
      }
    });

    onClose();
    // Reset form
    setStep(1);
    setCategory('');
    setTitle('');
    setDescription('');
    setCondition('');
    setPrice('');
    setOriginalPrice('');
    setNeighborhood('');
    setUrgency('flexible');
    setAvailableUntil('');
    setAiPriceSuggestion(null);
    setAiDescription(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            🏷️ List Your Item - AI Assisted
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps} • AI will help optimize your listing
          </DialogDescription>
          <Progress value={progress} className="mt-2" />
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Category & Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Category *</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as ItemCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.emoji} {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Item Title *</Label>
                <Input
                  placeholder="e.g., Nespresso Coffee Machine - Like New"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Condition *</Label>
                <Select value={condition} onValueChange={(val) => setCondition(val as ItemCondition)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONDITION_INFO).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.label} - {info.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Description *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAIDescription}
                  disabled={aiDescriptionLoading}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {aiDescriptionLoading ? 'Generating...' : 'AI Generate'}
                </Button>
              </div>
              <Textarea
                placeholder="Describe your item in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
              {aiDescription && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <p className="text-sm flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                      <span>AI-generated description applied! Feel free to customize it.</span>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Original Price (Optional)</Label>
                <Input
                  type="number"
                  placeholder="299"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>Your Price (EUR) *</Label>
                  <Input
                    type="number"
                    placeholder="180"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAIPricing}
                  disabled={aiPricingLoading}
                  className="gradient-success"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {aiPricingLoading ? 'Analyzing...' : 'AI Price'}
                </Button>
              </div>

              {aiPriceSuggestion && (
                <Card className="gradient-card-subtle">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">AI Pricing Suggestion</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                          €{aiPriceSuggestion}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on market data, condition, and local demand
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Location & Availability */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    placeholder="Barcelona"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Neighborhood *</Label>
                  <Input
                    placeholder="Eixample"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Available Until *</Label>
                <Input
                  type="date"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label>Urgency</Label>
                <Select value={urgency} onValueChange={(val) => setUrgency(val as Urgency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible - No rush</SelectItem>
                    <SelectItem value="moderate">Moderate - Within 2 weeks</SelectItem>
                    <SelectItem value="urgent">🔥 Urgent - ASAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Ready to List!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your listing will be visible to potential buyers immediately
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(Math.min(totalSteps, step + 1))}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="gradient-success"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                List Item
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemListingWizard;
