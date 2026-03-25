import React, { useState, useMemo } from 'react';
import { useFeaturePreferences } from '@/hooks/useFeaturePreferences';
import { FEATURE_REGISTRY, CATEGORY_LABELS, CATEGORY_ORDER, SYSTEM_FEATURES } from '@/data/featureRegistry';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Eye, EyeOff, Pin, RotateCcw, Sparkles, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const FeatureCustomizer: React.FC = () => {
  const { t } = useLanguage();
  const { prefs, isVisible, isPinned, toggleVisible, togglePinned, resetToDefaults, getHiddenFeatures } = useFeaturePreferences();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);

  const filteredFeatures = useMemo(() => {
    let features = FEATURE_REGISTRY.filter(f => !SYSTEM_FEATURES.includes(f.id));

    if (showHiddenOnly) {
      features = features.filter(f => !isVisible(f.id));
    }

    if (activeCategory) {
      features = features.filter(f => f.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      features = features.filter(f =>
        f.label.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        CATEGORY_LABELS[f.category]?.toLowerCase().includes(q)
      );
    }

    return features;
  }, [search, activeCategory, showHiddenOnly, isVisible]);

  const groupedFeatures = useMemo(() => {
    const groups: Record<string, typeof filteredFeatures> = {};
    for (const f of filteredFeatures) {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    }
    return groups;
  }, [filteredFeatures]);

  const hiddenCount = getHiddenFeatures().length;
  const pinnedCount = FEATURE_REGISTRY.filter(f => isPinned(f.id)).length;

  const handleReset = () => {
    resetToDefaults();
    toast({ title: 'Reset complete', description: 'All features restored to defaults' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <LayoutGrid className="h-7 w-7 text-primary" />
            Customize My App
          </h2>
          <p className="text-muted-foreground mt-1">
            Show, hide, or pin features to your dashboard. Your app, your rules.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 self-start">
          <RotateCcw className="h-4 w-4" />
          Reset to Default
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          {FEATURE_REGISTRY.length - hiddenCount} visible
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <EyeOff className="h-3.5 w-3.5 mr-1.5" />
          {hiddenCount} hidden
        </Badge>
        <Badge className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">
          <Pin className="h-3.5 w-3.5 mr-1.5" />
          {pinnedCount} pinned to home
        </Badge>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={activeCategory === null && !showHiddenOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setActiveCategory(null); setShowHiddenOnly(false); }}
          >
            All
          </Button>
          {CATEGORY_ORDER.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setActiveCategory(cat); setShowHiddenOnly(false); }}
            >
              {CATEGORY_LABELS[cat]}
            </Button>
          ))}
          {hiddenCount > 0 && (
            <Button
              variant={showHiddenOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setShowHiddenOnly(!showHiddenOnly); setActiveCategory(null); }}
              className="gap-1.5"
            >
              <EyeOff className="h-3.5 w-3.5" />
              Hidden ({hiddenCount})
            </Button>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      {Object.keys(groupedFeatures).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No features found</p>
          <p className="text-sm">Try a different search or filter</p>
        </div>
      ) : (
        CATEGORY_ORDER.filter(cat => groupedFeatures[cat]).map(cat => (
          <div key={cat} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupedFeatures[cat].map(feature => {
                const visible = isVisible(feature.id);
                const pinned = isPinned(feature.id);
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.id}
                    className={`transition-all duration-200 ${
                      !visible ? 'opacity-50 border-dashed' : pinned ? 'border-primary/40 shadow-sm' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${visible ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Icon className={`h-5 w-5 ${visible ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{feature.label}</span>
                            {feature.badge && (
                              <Badge variant={feature.badgeVariant || 'secondary'} className="text-[10px] px-1.5 py-0">
                                {feature.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={visible}
                            onCheckedChange={() => toggleVisible(feature.id)}
                            className="scale-90"
                          />
                          <span className="text-xs text-muted-foreground">
                            {visible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <Button
                          variant={pinned ? 'default' : 'ghost'}
                          size="sm"
                          className={`h-7 gap-1 text-xs ${pinned ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}`}
                          onClick={() => togglePinned(feature.id)}
                          disabled={!visible}
                        >
                          <Pin className={`h-3 w-3 ${pinned ? 'fill-current' : ''}`} />
                          {pinned ? 'Pinned' : 'Pin'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FeatureCustomizer;
