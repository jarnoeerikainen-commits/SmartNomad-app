import { Activity, Bell, Camera, Database, LineChart, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CommunitySurface, getCommunityAgentAlerts, getCommunityAgentMetrics, getCommunityAgentReports, recordCommunityProof } from './communityAIOptimization';

interface CommunityAgentOpsPanelProps {
  surface: CommunitySurface;
  onAddPicture?: () => void;
}

export function CommunityAgentOpsPanel({ surface, onAddPicture }: CommunityAgentOpsPanelProps) {
  const metrics = getCommunityAgentMetrics(surface);
  const alerts = getCommunityAgentAlerts(surface);
  const reports = getCommunityAgentReports(surface);
  const title = surface === 'pulse' ? 'Pulse AI Agent Ops' : 'Vibe AI Agent Ops';

  return (
    <Card className="border-primary/20 bg-card/95">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-primary" /> {title}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Optimized for compact context, verified-only decisions, live proof logs, safety alarms, and weekly quality reporting.
            </p>
          </div>
          <div className="flex gap-2">
            {onAddPicture && (
              <Button variant="outline" size="sm" onClick={onAddPicture} className="gap-2">
                <Camera className="h-4 w-4" /> Picture
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => recordCommunityProof(surface, `Audit ${title}`, `${title} audit packet created with token budget, safety, graph and report telemetry.`)}
            >
              <Activity className="h-4 w-4" /> Audit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md border bg-background/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{metric.label}</span>
                <Database className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="mt-1 text-sm font-semibold">{metric.value}</div>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{metric.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-md border bg-background/60 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium">
              <LineChart className="h-4 w-4 text-primary" /> Weekly quality, safety and token graph
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reports} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="quality" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.18)" name="Quality" />
                  <Area type="monotone" dataKey="safety" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.14)" name="Safety" />
                  <Area type="monotone" dataKey="tokens" stroke="hsl(var(--accent-foreground))" fill="hsl(var(--accent) / 0.22)" name="Tokens" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-md border bg-background/60 p-3">
                <div className="flex items-center gap-2">
                  {alert.level === 'healthy' ? <ShieldCheck className="h-4 w-4 text-success" /> : <Bell className="h-4 w-4 text-primary" />}
                  <Badge variant={alert.level === 'critical' ? 'destructive' : 'outline'} className="text-[10px] uppercase">
                    {alert.level}
                  </Badge>
                  <span className="text-xs font-semibold">{alert.title}</span>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{alert.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}