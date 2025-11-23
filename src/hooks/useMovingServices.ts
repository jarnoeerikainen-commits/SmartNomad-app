import { useState, useCallback } from 'react';
import { MovingServiceProvider, MovingRequest, MovingFilters, AIMovingAssessment, RoomInventory } from '@/types/movingServices';
import { movingProviders } from '@/data/movingServicesData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useMovingServices() {
  const [providers, setProviders] = useState<MovingServiceProvider[]>(movingProviders);
  const [filters, setFilters] = useState<MovingFilters>({});
  const [loading, setLoading] = useState(false);

  const applyFilters = useCallback((newFilters: MovingFilters) => {
    setFilters(newFilters);
    
    let filtered = [...movingProviders];

    if (newFilters.type) {
      filtered = filtered.filter(p => p.type === newFilters.type || p.type === 'both');
    }

    if (newFilters.minRating) {
      filtered = filtered.filter(p => p.rating >= newFilters.minRating!);
    }

    if (newFilters.maxBudget) {
      filtered = filtered.filter(p => p.priceRange.min <= newFilters.maxBudget!);
    }

    if (newFilters.services && newFilters.services.length > 0) {
      filtered = filtered.filter(p => 
        newFilters.services!.some(s => p.services.includes(s))
      );
    }

    setProviders(filtered);
  }, []);

  const getAIInventoryAssessment = useCallback(async (rooms: RoomInventory[]): Promise<AIMovingAssessment | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('moving-ai-assistant', {
        body: { 
          action: 'assess-inventory',
          rooms 
        }
      });

      if (error) throw error;
      return data as AIMovingAssessment;
    } catch (error) {
      console.error('AI assessment error:', error);
      toast.error('Failed to get AI assessment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAIPricing = useCallback(async (moveRequest: Partial<MovingRequest>): Promise<any> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('moving-ai-assistant', {
        body: { 
          action: 'estimate-pricing',
          moveRequest 
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI pricing error:', error);
      toast.error('Failed to get pricing estimate');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestQuotes = useCallback(async (moveRequest: MovingRequest): Promise<boolean> => {
    try {
      setLoading(true);
      toast.loading('Requesting quotes from moving companies...');
      
      // Simulate quote request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Quote requests sent! You should receive responses within 24-48 hours.');
      return true;
    } catch (error) {
      console.error('Quote request error:', error);
      toast.error('Failed to request quotes');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setProviders(movingProviders);
  }, []);

  return {
    providers,
    filters,
    loading,
    applyFilters,
    clearFilters,
    getAIInventoryAssessment,
    getAIPricing,
    requestQuotes
  };
}
