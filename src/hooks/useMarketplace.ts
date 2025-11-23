import { useState, useEffect, useMemo } from 'react';
import { MarketplaceItem, MarketplaceFilters, AIPricingRequest, AIPricingResponse, AIDescriptionRequest, AIDescriptionResponse, ItemOffer } from '@/types/marketplace';
import { DEMO_MARKETPLACE_ITEMS } from '@/data/marketplaceData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMarketplace = () => {
  const [items, setItems] = useState<MarketplaceItem[]>(DEMO_MARKETPLACE_ITEMS);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [loading, setLoading] = useState(false);
  const [aiPricingLoading, setAiPricingLoading] = useState(false);
  const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false);
  const { toast } = useToast();

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(item => item.price.amount >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(item => item.price.amount <= filters.maxPrice!);
    }

    // Condition filter
    if (filters.condition && filters.condition.length > 0) {
      filtered = filtered.filter(item => filters.condition!.includes(item.condition));
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item => 
        item.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        item.location.neighborhood.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Urgency filter
    if (filters.urgency && filters.urgency.length > 0) {
      filtered = filtered.filter(item => filters.urgency!.includes(item.availability.urgency));
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views + b.favorites * 2) - (a.views + a.favorites * 2));
        break;
      case 'ai-match':
        filtered.sort((a, b) => (b.aiFeatures.demandScore || 0) - (a.aiFeatures.demandScore || 0));
        break;
      default:
        // Default to recent
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return filtered;
  }, [items, filters]);

  // AI Pricing Assistant
  const getAIPricing = async (request: AIPricingRequest): Promise<AIPricingResponse | null> => {
    setAiPricingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('marketplace-ai', {
        body: {
          action: 'pricing',
          data: request
        }
      });

      if (error) throw error;

      toast({
        title: "AI Pricing Generated",
        description: `Suggested price: ${data.suggestedPrice} ${request.location === 'Barcelona' ? 'EUR' : 'USD'}`,
      });

      return data;
    } catch (error) {
      console.error('AI pricing error:', error);
      toast({
        title: "AI Pricing Unavailable",
        description: "Using default pricing estimate",
        variant: "destructive"
      });
      
      // Fallback pricing logic
      const basePrice = request.originalPrice || 100;
      const conditionMultiplier = {
        'new': 0.85,
        'like-new': 0.75,
        'good': 0.55,
        'fair': 0.35,
        'needs-repair': 0.15
      }[request.condition];

      return {
        suggestedPrice: Math.round(basePrice * conditionMultiplier),
        confidence: 65,
        reasoning: 'Estimated based on condition and original price',
        comparables: [],
        marketDemand: 'medium'
      };
    } finally {
      setAiPricingLoading(false);
    }
  };

  // AI Description Generator
  const generateAIDescription = async (request: AIDescriptionRequest): Promise<AIDescriptionResponse | null> => {
    setAiDescriptionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('marketplace-ai', {
        body: {
          action: 'description',
          data: request
        }
      });

      if (error) throw error;

      toast({
        title: "AI Description Generated",
        description: "Professional description created successfully",
      });

      return data;
    } catch (error) {
      console.error('AI description error:', error);
      toast({
        title: "AI Description Unavailable",
        description: "Please write your own description",
        variant: "destructive"
      });
      return null;
    } finally {
      setAiDescriptionLoading(false);
    }
  };

  // Add new listing
  const addListing = (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites' | 'status'>) => {
    const newItem: MarketplaceItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      favorites: 0,
      status: 'active'
    };

    setItems(prev => [newItem, ...prev]);
    
    toast({
      title: "Item Listed Successfully",
      description: "Your item is now visible to potential buyers",
    });

    return newItem;
  };

  // Update filters
  const updateFilters = (newFilters: Partial<MarketplaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
  };

  return {
    items: filteredItems,
    allItems: items,
    filters,
    loading,
    aiPricingLoading,
    aiDescriptionLoading,
    updateFilters,
    clearFilters,
    getAIPricing,
    generateAIDescription,
    addListing
  };
};
