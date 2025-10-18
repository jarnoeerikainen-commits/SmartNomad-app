import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, Heart, Sparkles, Leaf, CheckCircle2 } from 'lucide-react';
import { TrustBadge as TrustBadgeType } from '@/services/TrustFilterService';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  badge: string | TrustBadgeType;
  className?: string;
  showIcon?: boolean;
}

// Define a more flexible badge config that can handle any string badge
interface BadgeConfig {
  icon: React.ComponentType<any>;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}

const BADGE_CONFIG: Record<string, BadgeConfig> = {
  'Top Rated': {
    icon: Star,
    variant: 'default',
    className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0'
  },
  'Nomad Favorite': {
    icon: Heart,
    variant: 'default',
    className: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0'
  },
  'Traveler Favorite': {
    icon: Heart,
    variant: 'default',
    className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0'
  },
  'Verified Local': {
    icon: CheckCircle2,
    variant: 'secondary',
    className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0'
  },
  'Local Gem': {
    icon: Sparkles,
    variant: 'secondary',
    className: 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0'
  },
  'Cultural Gem': {
    icon: Sparkles,
    variant: 'secondary',
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
  },
  'World-Class': {
    icon: Star,
    variant: 'default',
    className: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0'
  },
  'Sustainable': {
    icon: Leaf,
    variant: 'secondary',
    className: 'bg-gradient-to-r from-green-600 to-lime-600 text-white border-0'
  },
  'Ethical': {
    icon: Shield,
    variant: 'secondary',
    className: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0'
  }
};

// Default fallback badge config
const DEFAULT_BADGE_CONFIG: BadgeConfig = {
  icon: Shield,
  variant: 'outline',
  className: 'bg-muted/50 text-muted-foreground border-muted'
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  badge, 
  className,
  showIcon = true 
}) => {
  // Safely get badge config with fallback
  if (!badge) {
    console.warn('TrustBadge: badge is undefined or null');
    return null;
  }

  const config = BADGE_CONFIG[badge] || DEFAULT_BADGE_CONFIG;
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'text-xs font-semibold px-2 py-0.5 flex items-center gap-1 shadow-sm',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {badge}
    </Badge>
  );
};

interface TrustRatingProps {
  rating: number;
  reviews?: number;
  className?: string;
  showReviews?: boolean;
}

export const TrustRating: React.FC<TrustRatingProps> = ({ 
  rating, 
  reviews,
  className,
  showReviews = true 
}) => {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
      </div>
      {showReviews && reviews && reviews > 0 && (
        <span className="text-xs text-muted-foreground">
          ({reviews}+ reviews)
        </span>
      )}
    </div>
  );
};

interface TrustScoreProps {
  score: number;
  className?: string;
}

export const TrustScore: React.FC<TrustScoreProps> = ({ score, className }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-orange-100 dark:bg-orange-900/20';
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold',
      getScoreBackground(score),
      className
    )}>
      <Shield className={cn('w-3 h-3', getScoreColor(score))} />
      <span className={getScoreColor(score)}>Trust: {score}</span>
    </div>
  );
};
