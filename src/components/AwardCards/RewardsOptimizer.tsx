import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, Loader2, AlertTriangle, TrendingUp, Plane, Hotel, Car, Crown,
  Wallet, ArrowRightLeft, ShoppingCart, CheckCircle2, Lightbulb,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  RewardsOptimizerService,
  type IntentType,
  type OptimizerPlan,
  type OptimizeOption,
} from "@/services/RewardsOptimizerService";
import type { UserAwardCard } from "@/types/awardCards";

interface Props {
  cards: UserAwardCard[];
}

const INTENT_ICONS: Record<IntentType, React.ElementType> = {
  flight: Plane,
  hotel: Hotel,
  car: Car,
  lounge: Crown,
  restaurant: Sparkles,
  earn: Wallet,
  general: Lightbulb,
};

const STRATEGY_BADGE: Record<OptimizeOption["strategy"], { label: string; cls: string; icon: React.ElementType }> = {
  pay_cash:             { label: "Pay Cash + Earn",     cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", icon: Wallet },
  redeem_points:        { label: "Redeem Points",       cls: "bg-violet-500/15 text-violet-700 dark:text-violet-300",     icon: Sparkles },
  transfer_then_redeem: { label: "Transfer → Redeem",   cls: "bg-blue-500/15 text-blue-700 dark:text-blue-300",           icon: ArrowRightLeft },
  buy_points:           { label: "Buy Points (ROI ✓)",  cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300",        icon: ShoppingCart },
  status_upgrade:       { label: "Status / Upgrade",    cls: "bg-rose-500/15 text-rose-700 dark:text-rose-300",           icon: Crown },
};

const RewardsOptimizer: React.FC<Props> = ({ cards }) => {
  const { toast } = useToast();
  const [intentType, setIntentType] = useState<IntentType>("flight");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [cashCost, setCashCost] = useState("");
  const [style, setStyle] = useState<"luxury" | "balanced" | "value">("balanced");
  const [risk, setRisk] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<OptimizerPlan | null>(null);
  const [chosenRank, setChosenRank] = useState<number | null>(null);

  const opportunities = useMemo(() => RewardsOptimizerService.detectOpportunities(cards), [cards]);

  const canRun = description.trim().length >= 5 && cards.length > 0;

  const run = async () => {
    if (!canRun) return;
    setLoading(true);
    setPlan(null);
    setChosenRank(null);
    try {
      const res = await RewardsOptimizerService.optimize(
        {
          type: intentType,
          description: description.trim(),
          origin: origin || undefined,
          destination: destination || undefined,
          dates: dates || undefined,
          estimatedCashCost: cashCost ? Number(cashCost) : undefined,
        },
        cards,
        { style, riskTolerance: risk }
      );
      if (!res.success || !res.plan) {
        toast({ title: "Optimizer error", description: res.error ?? "Unknown error", variant: "destructive" });
        return;
      }
      setPlan(res.plan);
      toast({ title: "✨ Strategy ready", description: `${res.plan.options?.length ?? 0} options designed for you.` });
    } finally {
      setLoading(false);
    }
  };

  const Intro = INTENT_ICONS[intentType];

  if (cards.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center space-y-2">
          <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/60" />
          <h3 className="font-semibold">Add cards to unlock the Smart Optimizer</h3>
          <p className="text-sm text-muted-foreground">
            The engine designs world-class redemption strategies from your real loyalty portfolio.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Opportunity strip — deterministic, no AI call */}
      {opportunities.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Live opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {opportunities.map((o, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {o.severity === "urgent" ? (
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                ) : o.severity === "warn" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-medium">{o.title}</div>
                  <div className="text-xs text-muted-foreground">{o.detail}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Intent form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Smart Optimizer
          </CardTitle>
          <CardDescription>
            Describe what you want to do — the engine returns 2-3 ranked strategies from your real cards. You decide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Select value={intentType} onValueChange={(v) => setIntentType(v as IntentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">✈️ Flight</SelectItem>
                <SelectItem value="hotel">🏨 Hotel stay</SelectItem>
                <SelectItem value="car">🚗 Car rental</SelectItem>
                <SelectItem value="lounge">👑 Lounge / status</SelectItem>
                <SelectItem value="restaurant">🍽 Restaurant / dining</SelectItem>
                <SelectItem value="earn">💰 Best card to swipe</SelectItem>
                <SelectItem value="general">💡 General advice</SelectItem>
              </SelectContent>
            </Select>
            <Select value={style} onValueChange={(v) => setStyle(v as typeof style)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury — squeeze every premium perk</SelectItem>
                <SelectItem value="balanced">Balanced — value + comfort</SelectItem>
                <SelectItem value="value">Value — cheapest with best ROI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="e.g. SIN → LHR mid-July, business or first, 1 pax, want lounge access and lie-flat"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Input placeholder="Origin (SIN)" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            <Input placeholder="Destination (LHR)" value={destination} onChange={(e) => setDestination(e.target.value)} />
            <Input placeholder="Dates (Jul 12-19)" value={dates} onChange={(e) => setDates(e.target.value)} />
            <Input placeholder="Cash cost USD" value={cashCost} type="number" onChange={(e) => setCashCost(e.target.value)} />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Select value={risk} onValueChange={(v) => setRisk(v as typeof risk)}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Risk: low (don't buy points)</SelectItem>
                <SelectItem value="medium">Risk: medium (buy if ROI ≥ 1.5x)</SelectItem>
                <SelectItem value="high">Risk: high (buy if ROI ≥ 1.2x)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={run} disabled={!canRun || loading} className="min-w-32">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Intro className="w-4 h-4 mr-2" />}
              {loading ? "Designing…" : "Design strategy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan results */}
      {plan && (
        <div className="space-y-4">
          {plan.summary && (
            <Card className="border-primary/40 bg-primary/5">
              <CardContent className="p-4 text-sm flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>{plan.summary}</span>
              </CardContent>
            </Card>
          )}

          {plan.expiringAlerts && plan.expiringAlerts.length > 0 && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  Burn before they expire
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm space-y-1">
                {plan.expiringAlerts.map((a, i) => (
                  <div key={i}>
                    <strong>{a.program}</strong> — {a.balance.toLocaleString()} pts (exp. {a.expires}). {a.suggestion}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plan.options.map((opt) => {
              const sb = STRATEGY_BADGE[opt.strategy] ?? STRATEGY_BADGE.redeem_points;
              const SIcon = sb.icon;
              const isChosen = chosenRank === opt.rank;
              return (
                <Card
                  key={opt.rank}
                  className={`cursor-pointer transition-all ${
                    isChosen ? "border-primary ring-2 ring-primary/40 shadow-lg" : "hover:border-primary/50"
                  }`}
                  onClick={() => setChosenRank(opt.rank)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">#{opt.rank}</Badge>
                      <Badge className={`text-[10px] ${sb.cls}`}>
                        <SIcon className="w-3 h-3 mr-1" />
                        {sb.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm leading-snug">{opt.title}</CardTitle>
                    <CardDescription className="text-xs">{opt.program}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 text-xs">
                    {opt.valueCapture && (
                      <div className="font-semibold text-primary">{opt.valueCapture}</div>
                    )}
                    <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                      {opt.pointsNeeded != null && <div>Points: <strong className="text-foreground">{opt.pointsNeeded.toLocaleString()}</strong></div>}
                      {opt.cashOutlay != null && <div>Cash: <strong className="text-foreground">${opt.cashOutlay.toLocaleString()}</strong></div>}
                      {opt.cashEquivalent != null && <div className="col-span-2">Cash value: <strong className="text-foreground">${opt.cashEquivalent.toLocaleString()}</strong></div>}
                    </div>
                    {opt.pointsSource && (
                      <div className="text-muted-foreground">
                        <ArrowRightLeft className="w-3 h-3 inline mr-1" /> {opt.pointsSource}
                      </div>
                    )}
                    {opt.tierBenefits && opt.tierBenefits.length > 0 && (
                      <div className="space-y-0.5">
                        {opt.tierBenefits.slice(0, 3).map((b, i) => (
                          <div key={i} className="flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {opt.actionSteps && opt.actionSteps.length > 0 && (
                      <>
                        <Separator />
                        <ol className="list-decimal list-inside space-y-0.5">
                          {opt.actionSteps.map((s, i) => <li key={i}>{s}</li>)}
                        </ol>
                      </>
                    )}
                    {opt.risks && opt.risks.length > 0 && (
                      <div className="text-amber-600 dark:text-amber-400">
                        ⚠ {opt.risks.join(" · ")}
                      </div>
                    )}
                    {opt.confidence != null && (
                      <div className="text-[10px] text-muted-foreground">
                        confidence {Math.round(opt.confidence * 100)}%
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {chosenRank != null && (
            <Card className="border-primary bg-primary/10">
              <CardContent className="p-4 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>You chose option #{chosenRank}. Confirm to send to your concierge for booking.</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    toast({ title: "Sent to concierge", description: "Your concierge will execute this strategy on your approval." });
                    setChosenRank(null);
                  }}
                >
                  Confirm & send
                </Button>
              </CardContent>
            </Card>
          )}

          {plan.earningTip && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-3 text-sm flex items-start gap-2">
                <Wallet className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Earning tip:</strong> {plan.earningTip}</span>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RewardsOptimizer;
