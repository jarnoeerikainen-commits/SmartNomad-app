import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getConnectors,
  simulateConnect,
  simulateDisconnect,
  getRecommendedConnectors,
  ConnectorInfo,
  ConnectorStatus,
} from '@/services/ConnectorIntegrationService';
import { Plug, Zap, Shield, Check, X, ExternalLink, Sparkles } from 'lucide-react';

const STATUS_CONFIG: Record<ConnectorStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  connected: { label: 'Connected', variant: 'default' },
  disconnected: { label: 'Not Connected', variant: 'outline' },
  expired: { label: 'Expired', variant: 'destructive' },
  error: { label: 'Error', variant: 'destructive' },
};

const CATEGORY_LABELS: Record<string, string> = {
  communication: '💬 Communication',
  productivity: '📋 Productivity',
  finance: '💳 Finance',
  travel: '✈️ Travel',
  security: '🛡️ Security',
  ai: '🤖 AI & Voice',
};

const ConnectorCard: React.FC<{
  connector: ConnectorInfo;
  onToggle: (id: string, connect: boolean) => void;
}> = ({ connector, onToggle }) => {
  const statusConfig = STATUS_CONFIG[connector.status];
  const isConnected = connector.status === 'connected';

  return (
    <Card className={`transition-all duration-200 ${isConnected ? 'border-primary/30 bg-primary/5' : 'hover:border-muted-foreground/30'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{connector.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm">{connector.name}</h4>
                <Badge variant={statusConfig.variant} className="text-[10px] px-1.5 py-0">
                  {statusConfig.label}
                </Badge>
                {connector.demoMode && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Demo</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{connector.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {connector.capabilities.slice(0, 3).map(cap => (
                  <span key={cap} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    {cap.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Switch
            checked={isConnected}
            onCheckedChange={(checked) => onToggle(connector.id, checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ConnectorsDashboard: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [connectors, setConnectors] = useState<ConnectorInfo[]>(getConnectors());
  const [recommendations] = useState(getRecommendedConnectors(['tax-residency', 'threats', 'vault']));

  const handleToggle = (id: string, connect: boolean) => {
    if (connect) {
      const result = simulateConnect(id);
      if (result) {
        toast({
          title: `${result.icon} ${result.name} Connected`,
          description: `${result.capabilities.length} capabilities now active. Demo mode.`,
        });
      }
    } else {
      const result = simulateDisconnect(id);
      if (result) {
        toast({ title: `${result.name} Disconnected`, description: 'Integration removed.' });
      } else {
        toast({ title: 'Cannot disconnect', description: 'This is a core integration.', variant: 'destructive' });
        return;
      }
    }
    setConnectors(getConnectors());
  };

  const connectedCount = connectors.filter(c => c.status === 'connected').length;
  const categories = [...new Set(connectors.map(c => c.category))];

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plug className="w-5 h-5 text-primary" />
            Integrations Hub
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {connectedCount} of {connectors.length} services connected
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Zap className="w-3 h-3" />
          {connectedCount} Active
        </Badge>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              Recommended for Your Setup
            </h3>
            <div className="grid gap-2">
              {recommendations.map(rec => (
                <div key={rec.id} className="flex items-center justify-between bg-background/60 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <span>{rec.icon}</span>
                    <div>
                      <span className="text-sm font-medium">{rec.name}</span>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleToggle(rec.id, true)}>
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connectors by Category */}
      {categories.map(category => {
        const categoryConnectors = connectors.filter(c => c.category === category);
        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              {CATEGORY_LABELS[category] || category}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {categoryConnectors.map(connector => (
                <ConnectorCard
                  key={connector.id}
                  connector={connector}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Info footer */}
      <Card className="bg-muted/30">
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            All OAuth tokens are managed securely via Lovable Connectors. Your credentials never touch our servers.
            Demo integrations simulate real functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectorsDashboard;
