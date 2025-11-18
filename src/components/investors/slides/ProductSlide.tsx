import { PitchDeckSlide } from '../PitchDeckSlide';
import { ProductData } from '@/types/pitchDeck';
import { Package } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ProductSlideProps {
  data: ProductData;
  onUpdate: (updates: Partial<ProductData>) => void;
}

export const ProductSlide = ({ data, onUpdate }: ProductSlideProps) => {
  return (
    <PitchDeckSlide>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Package className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">Product Features</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {data.features.map((feature, i) => {
            const IconComponent = (LucideIcons as any)[feature.icon] || Package;
            return (
              <div
                key={i}
                className="bg-accent/10 rounded-xl p-6 space-y-3 hover:bg-accent/20 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PitchDeckSlide>
  );
};
