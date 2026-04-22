import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell,
} from 'recharts';
import {
  Activity, Sparkles, Send, FileText, Lightbulb, Globe2, Zap, Users, DollarSign,
  AlertTriangle, Smile, Loader2, Radio, RefreshCw, MessageSquareHeart,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AdminLiveSignalsService, type LiveSignal, type LiveAggregate,
} from '@/services/AdminLiveSignalsService';

type Msg = { role: 'user' | 'assistant'; content: string };

const KIND_COLOR: Record<string, string> = {
  wish: 'text-emerald-300',
  problem: 'text-rose-300',
  booking: 'text-amber-300',
  payment: 'text-amber-300',
  concierge_q: 'text-sky-300',
  calendar: 'text-violet-300',
  churn_ping: 'text-rose-400',
  growth: 'text-emerald-400',
  support: 'text-rose-300',
  discovery: 'text-cyan-300',
};

const KIND_LABEL: Record<string, string> = {
  wish: 'Wish', problem: 'Problem', booking: 'Booking', payment: 'Payment',
  concierge_q: 'Concierge Q', calendar: 'Calendar', churn_ping: 'Churn',
  growth: 'Growth', support: 'Support', discovery: 'Discovery',
};

const QUICK_PROMPTS = [
  { label: 'Daily executive snapshot', mode: 'report' as const, prompt: 'Give me the executive snapshot of the last 15 minutes globally.' },
  { label: '3 actions for next hour', mode: 'suggest' as const, prompt: 'What 3 things should we ship or fix in the next hour to make the app better for our users right now?' },
  { label: 'Why are users frustrated?', mode: 'chat' as const, prompt: 'Where is friction highest right now and what should I do about it?' },
  { label: 'Spot a new revenue order', mode: 'suggest' as const, prompt: 'Based on live wishes, propose 2 new premium orders we could launch this week with expected revenue.' },
  { label: 'Concierge UX tweaks', mode: 'suggest' as const, prompt: 'Review the live concierge questions and suggest tweaks to Sofia/Marcus prompts to reduce friction.' },
  { label: 'Region heat map', mode: 'chat' as const, prompt: 'Which region is hottest, which is coldest, and what should the ops team do today?' },
];

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-concierge`;

const AdminConcierge: React.FC = () => {
  const [signals, setSignals] = useState<LiveSignal[]>([]);
  const [agg, setAgg] = useState<LiveAggregate>(() => AdminLiveSignalsService.aggregate());
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "👋 I'm your Admin Concierge. I'm reading **live global signals** every few seconds — wishes, problems, bookings, calendar happenings, sentiment. Ask me anything, or pick a quick prompt above.\n\n_Try:_ \"What 3 things should we ship in the next hour?\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [pulse, setPulse] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  // ── Subscribe to live signals
  useEffect(() => {
    AdminLiveSignalsService.start();
    const off = AdminLiveSignalsService.subscribe((s) => {
      setSignals(s);
      setAgg(AdminLiveSignalsService.aggregate());
      setPulse((p) => (p + 1) % 1000);
    });
    return () => {
      off();
    };
  }, []);

  // ── Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // ── Auto-scroll ticker to top so newest is visible
  useEffect(() => {
    if (tickerRef.current) tickerRef.current.scrollTop = 0;
  }, [signals.length]);

  // ── Sparkline data: signals per minute over last 15 min
  const sparkData = useMemo(() => {
    const now = Date.now();
    const buckets: { t: string; n: number; rev: number }[] = [];
    for (let i = 14; i >= 0; i--) {
      const start = now - (i + 1) * 60_000;
      const end = now - i * 60_000;
      const inWin = signals.filter((s) => s.ts >= start && s.ts < end);
      buckets.push({
        t: `${i}m`,
        n: inWin.length,
        rev: inWin.reduce((a, b) => a + (b.value_usd ?? 0), 0),
      });
    }
    return buckets;
  }, [signals, pulse]);

  const regionData = useMemo(
    () =>
      Object.entries(agg.by_region).map(([region, n]) => ({ region, n })),
    [agg],
  );

  // ── Streaming send
  async function send(text: string, mode: 'chat' | 'report' | 'suggest' = 'chat') {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);

    const liveContext = AdminLiveSignalsService.snapshotForAI();

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          mode,
          live_context: liveContext,
          messages: [...messages, userMsg].slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast.error('Rate limited — try again in a moment.');
        } else if (resp.status === 402) {
          toast.error('AI credits exhausted. Top up workspace usage.');
        } else {
          toast.error('AI gateway error.');
        }
        setMessages((m) => m.slice(0, -1)); // remove empty assistant
        setStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let acc = '';
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: 'assistant', content: acc };
                return copy;
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Connection error.');
      setMessages((m) => m.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[hsl(var(--gold))] text-xs uppercase tracking-wider font-semibold">
            <Radio className="h-3.5 w-3.5 animate-pulse" /> Live demo · streaming every {`~`}2.2s
          </div>
          <h1 className="text-3xl font-bold mt-1">Admin Concierge</h1>
          <p className="text-sm text-[hsl(30_12%_70%)] mt-1 max-w-2xl">
            A 24/7 AI brain reading global user signals — wishes, problems, bookings, calendar happenings,
            sentiment — and turning them into advice, suggestions and reports for staff.
          </p>
        </div>
        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
          <Activity className="h-3 w-3 mr-1.5" /> {agg.total_signals} signals · last 15 min
        </Badge>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile icon={Users} label="Active users (15m)" value={agg.active_users_window.toLocaleString()} accent="text-sky-300" />
        <KpiTile icon={DollarSign} label="Revenue (15m)" value={`$${agg.revenue_window_usd.toLocaleString()}`} accent="text-amber-300" />
        <KpiTile icon={AlertTriangle} label="Open problems" value={agg.open_problems.toString()} accent="text-rose-300" />
        <KpiTile icon={Smile} label="Positive sentiment" value={`${agg.positive_pct}%`} accent="text-emerald-300" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: live ticker + charts */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Global live feed
              </div>
              <Badge variant="outline" className="text-[10px]">{signals.length} buffered</Badge>
            </div>
            <div ref={tickerRef} className="h-[320px] overflow-y-auto space-y-1.5 pr-1">
              {[...signals].slice(-50).reverse().map((s) => (
                <div
                  key={s.id}
                  className="text-xs leading-snug border-l-2 border-[hsl(43_96%_56%/0.3)] pl-2 py-1 hover:bg-white/[0.02] rounded-r"
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-[hsl(30_12%_60%)]">
                    <span className={`font-bold uppercase tracking-wider ${KIND_COLOR[s.kind] ?? 'text-white'}`}>
                      {KIND_LABEL[s.kind]}
                    </span>
                    <span>·</span>
                    <span>{s.region}</span>
                    <span>·</span>
                    <span>{s.city}</span>
                    <span>·</span>
                    <span className="capitalize">{s.persona}</span>
                  </div>
                  <div className="text-[hsl(30_12%_88%)]">{s.text}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[hsl(var(--gold))]" /> Signals · last 15 min
            </div>
            <div className="h-[110px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id="sigGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(43 96% 56%)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(43 96% 56%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" stroke="hsl(30 12% 50%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(30 12% 50%)" fontSize={10} tickLine={false} axisLine={false} width={20} />
                  <Tooltip contentStyle={{ background: 'hsl(220 22% 8%)', border: '1px solid hsl(43 96% 56% / 0.3)', borderRadius: 6, fontSize: 12 }} />
                  <Area type="monotone" dataKey="n" stroke="hsl(43 96% 56%)" fill="url(#sigGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Region split
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <XAxis dataKey="region" stroke="hsl(30 12% 50%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: 'hsl(220 22% 8%)', border: '1px solid hsl(43 96% 56% / 0.3)', borderRadius: 6, fontSize: 12 }} />
                  <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                    {regionData.map((_, i) => (
                      <Cell key={i} fill={['#06b6d4', '#f59e0b', '#a78bfa', '#34d399', '#fb7185'][i % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {agg.top_wishes.length > 0 && (
            <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
              <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageSquareHeart className="h-4 w-4 text-emerald-300" /> Top user wishes
              </div>
              <ul className="space-y-1.5 text-xs">
                {agg.top_wishes.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-[hsl(30_12%_85%)]">
                    <span className="text-[hsl(var(--gold))] font-bold">×{w.n}</span>
                    <span>{w.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* RIGHT: chat */}
        <div className="lg:col-span-2">
          <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4 flex flex-col h-[700px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(43_96%_56%)] to-[hsl(33_96%_46%)] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-black" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Brain Concierge</div>
                  <div className="text-[10px] text-[hsl(30_12%_60%)] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online · streaming with live context
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => setMessages(messages.slice(0, 1))}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reset
              </Button>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => send(q.prompt, q.mode)}
                  disabled={streaming}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-[hsl(43_96%_56%/0.3)] text-[hsl(30_12%_85%)] hover:bg-[hsl(43_96%_56%/0.1)] hover:text-[hsl(var(--gold))] disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  {q.mode === 'report' ? <FileText className="h-3 w-3" /> :
                    q.mode === 'suggest' ? <Lightbulb className="h-3 w-3" /> :
                      <Zap className="h-3 w-3" />}
                  {q.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 -mr-2 pr-2" ref={scrollRef as any}>
              <div className="space-y-3" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`rounded-lg p-3 text-sm ${
                      m.role === 'user'
                        ? 'bg-[hsl(43_96%_56%/0.12)] border border-[hsl(43_96%_56%/0.3)] ml-12'
                        : 'bg-[hsl(220_22%_8%)] border border-white/5 mr-12'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <div className="text-[hsl(30_12%_92%)] whitespace-pre-wrap">{m.content}</div>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none prose-headings:text-[hsl(var(--gold))] prose-headings:mt-3 prose-headings:mb-1.5 prose-p:my-1.5 prose-strong:text-[hsl(var(--gold))] prose-ul:my-1.5 prose-li:my-0.5">
                        {m.content ? (
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        ) : (
                          <div className="flex items-center gap-2 text-[hsl(30_12%_60%)]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking with live signals…
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input, 'chat');
              }}
              className="mt-3 flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about users, wishes, problems, revenue, what to ship today…"
                className="bg-[hsl(220_22%_8%)] border-[hsl(43_96%_56%/0.2)] text-sm"
                disabled={streaming}
              />
              <Button
                type="submit"
                disabled={streaming || !input.trim()}
                className="bg-[hsl(43_96%_56%)] text-black hover:bg-[hsl(43_96%_50%)]"
              >
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

const KpiTile: React.FC<{ icon: any; label: string; value: string; accent: string }> = ({
  icon: Icon, label, value, accent,
}) => (
  <Card className="bg-[hsl(220_22%_10%)] border-[hsl(43_96%_56%/0.15)] p-4">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[hsl(30_12%_60%)]">
      <Icon className={`h-3.5 w-3.5 ${accent}`} /> {label}
    </div>
    <div className={`text-2xl font-bold mt-1 ${accent}`}>{value}</div>
  </Card>
);

export default AdminConcierge;
