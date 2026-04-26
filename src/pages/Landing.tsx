import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Sparkles, Globe2, Lock, Plane, Calculator, FileCheck,
  Users, Bell, MessageCircle, Brain, MapPin, Award, Wallet,
  ArrowRight, Check, Rocket, Star, Mic, Eye, Zap, AlertTriangle,
  Apple, Smartphone, Hotel, UtensilsCrossed, Music2, Trophy,
  Radar, Siren, ShieldAlert, Activity, Headphones, Heart,
  PlayCircle, X, Clock, Route, Building2, Film
} from 'lucide-react';
import logo from '@/assets/supernomad-logo.jpg';
import heroImg from '@/assets/landing-hero.jpg';
import day184Img from '@/assets/landing-184th-day.jpg';
import communityImg from '@/assets/landing-community.jpg';
import securityImg from '@/assets/landing-security.jpg';
import travelImg from '@/assets/landing-travel.jpg';
import lifestyleImg from '@/assets/landing-lifestyle.jpg';

const Landing: React.FC = () => {
  const [filmMode, setFilmMode] = useState<'closed' | 'teaser' | 'full'>('closed');

  useEffect(() => {
    document.title = 'SuperNomad — The Operating System for Global Citizens';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Proactive AI for tax residency, visas, identity, community, and safety. Voice-controlled, encrypted, and sovereign — for digital nomads and global citizens.'
      );
    }
    // Capture ?ref= for affiliate attribution
    import('@/services/AffiliateService').then(({ AffiliateService }) => {
      AffiliateService.captureRefFromUrl();
    });
  }, []);

  const stats = [
    { value: '850M+', label: 'Global Citizens', sub: 'Who call the world home' },
    { value: '$12K', label: 'Avg Tax Penalty', sub: 'Lost yearly to residency confusion' },
    { value: '200+', label: 'Hours Wasted', sub: 'On bureaucracy every year' },
    { value: '67%', label: 'Security Issues', sub: 'Of nomads report data breaches' },
  ];

  const pains = [
    { icon: Calculator, title: 'Tax Confusion', fix: 'Tax Intelligence Hub', desc: 'Overlapping jurisdictions, the 184-day trap, double taxation. We track every day, every threshold, and every rule — silently.' },
    { icon: FileCheck, title: 'Visa Stress', fix: 'Visa Auto-Matcher', desc: 'Expirations, renewal windows, entry rules. SuperNomad alerts you weeks before any deadline slips.' },
    { icon: Users, title: 'Loneliness Abroad', fix: 'Pulse + Vibe Community', desc: '6.2M nomads online. Find your tribe in any city — sport partners, dinners, meetups, and mentors.' },
    { icon: Lock, title: 'Security Gaps', fix: 'Snomad ID Vault', desc: 'AES-256-GCM encrypted vault for passports, banking, and medical records. Zero-knowledge — only you hold the key.' },
  ];

  const features = [
    { icon: Brain, title: 'AI Concierge', desc: 'Sofia & Marcus — voice-first assistants that book, plan, and protect 24/7.' },
    { icon: Calculator, title: 'Tax Tracker', desc: '195+ countries, real-time residency thresholds, Schengen 90/180.' },
    { icon: FileCheck, title: 'Visa & ETIAS', desc: 'Auto-match programs, EU 2026 ETIAS portal, official links.' },
    { icon: Shield, title: 'Trust Pass', desc: 'W3C verifiable credentials with selective disclosure.' },
    { icon: Eye, title: 'Black Box Guardian', desc: 'WORM evidence recorder for personal safety incidents.' },
    { icon: Wallet, title: 'Agentic Wallet', desc: 'x402 protocol — AI books and pays autonomously, with your rules.' },
    { icon: AlertTriangle, title: 'Threat Intelligence', desc: '500+ live incidents across 200+ cities, with safety scores.' },
    { icon: Globe2, title: 'Local Living', desc: '700+ business centers, weather, and community across 100+ cities.' },
    { icon: MessageCircle, title: 'Community', desc: 'Pulse meetups, Vibe chat, sport finder (padel, golf, cycling).' },
    { icon: Award, title: 'Award Cards', desc: '100+ loyalty programs with AI-optimized point redemption.' },
  ];

  const steps = [
    { n: '01', title: 'Onboard Securely', desc: 'Verify in under 2 minutes with biometric AI. End-to-end encrypted, GDPR and CCPA compliant from day one.', bullets: ['Biometric verification', 'GDPR & CCPA compliant', 'End-to-end encryption', 'Instant — no paperwork'] },
    { n: '02', title: 'Connect & Configure', desc: 'Tell the AI your goals. SuperNomad auto-configures compliance tracking, finds your community, and curates the marketplace.', bullets: ['Custom compliance rules', 'Smart matchmaking', 'Marketplace curation', 'Automated alerts'] },
    { n: '03', title: 'Live & Explore', desc: 'SuperNomad runs invisibly. It only interrupts when action is required — otherwise, you focus entirely on your life.', bullets: ['Invisible monitoring', 'Proactive tax alerts', 'Event discovery', '24/7 multilingual support'] },
  ];

  const sports = [
    { emoji: '🏸', title: 'Padel', desc: 'Skill-based matchmaking, real-time courts, and ratings — globally.' },
    { emoji: '🚴', title: 'Cycling', desc: 'GPS-curated routes, local groups, and terrain & difficulty maps.' },
    { emoji: '🏌️', title: 'Golf', desc: 'Handicap matching, course reviews, and tournament discovery.' },
  ];

  const trustBadges = [
    { icon: Lock, label: 'AES-256-GCM' },
    { icon: Shield, label: 'GDPR Art. 17' },
    { icon: Eye, label: 'Zero-Knowledge' },
    { icon: Check, label: 'CCPA Ready' },
  ];

  const cinematicMoments = [
    { img: heroImg, label: 'Executive arrival', detail: 'Airport, hotel, route and safety handled before landing.' },
    { img: travelImg, label: 'Borderless operations', detail: 'Trips, loyalty, receipts, tax days and visas in one timeline.' },
    { img: communityImg, label: 'Local life instantly', detail: 'Padel, dinners, clubs, families and verified city services.' },
    { img: securityImg, label: 'Sovereign protection', detail: 'Threat intelligence, identity vault and consent-first AI.' },
  ];

  const aiMap = [
    { icon: Brain, title: 'AI CEO', desc: 'Synthesizes daily ecosystem reports and growth opportunities.' },
    { icon: Headphones, title: 'Concierge Governor', desc: 'Routes every user intent to the cheapest capable specialist.' },
    { icon: Plane, title: 'Travel Agents', desc: 'Flights, hotels, lounges, transport, loyalty and disruption recovery.' },
    { icon: Shield, title: 'Trust Agents', desc: 'Vault, permissions, audit trail, risk controls and compliance.' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220_22%_8%)] text-[hsl(30_12%_95%)] overflow-x-hidden">
      {filmMode !== 'closed' && (
        <div className="fixed inset-0 z-[80] bg-[hsl(220_22%_4%/0.96)] backdrop-blur-xl flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="SuperNomad cinematic video">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-[hsl(43_96%_56%/0.28)] bg-[hsl(220_22%_8%)] shadow-[0_40px_120px_-30px_hsl(0_0%_0%/0.9)]">
            <button onClick={() => setFilmMode('closed')} className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(43_96%_56%/0.28)] bg-[hsl(220_22%_8%/0.72)] text-white hover:bg-[hsl(43_96%_56%/0.14)]" aria-label="Skip video teaser">
              <X className="h-5 w-5" />
            </button>
            <div className="grid lg:grid-cols-[1.4fr_0.9fr]">
              <div className="relative min-h-[360px] sm:min-h-[520px] overflow-hidden">
                <img src={filmMode === 'teaser' ? heroImg : travelImg} alt="SuperNomad cinematic preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_22%_5%)] via-[hsl(220_22%_8%/0.2)] to-[hsl(220_22%_5%/0.25)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <Badge className="mb-4 border-[hsl(43_96%_56%/0.3)] bg-[hsl(43_96%_56%/0.16)] text-[hsl(var(--gold))]">
                    <Film className="mr-1.5 h-3 w-3" /> {filmMode === 'teaser' ? '38-second teaser' : 'Full ecosystem film'}
                  </Badge>
                  <h2 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-white">
                    {filmMode === 'teaser' ? 'Your borderless life, compressed into one intelligence layer.' : 'The SuperNomad ecosystem: concierge, trust, commerce and company intelligence.'}
                  </h2>
                </div>
              </div>
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sm text-[hsl(30_12%_78%)]"><Clock className="h-4 w-4 text-[hsl(var(--gold))]" /> Skip anytime · no sound required</div>
                  {(filmMode === 'teaser' ? cinematicMoments.slice(0, 3) : cinematicMoments).map((moment, index) => (
                    <div key={moment.label} className="flex gap-4 rounded-xl border border-[hsl(43_96%_56%/0.14)] bg-[hsl(220_22%_12%/0.72)] p-4">
                      <span className="font-display text-2xl text-[hsl(var(--gold))]">0{index + 1}</span>
                      <div><div className="font-semibold text-white">{moment.label}</div><div className="text-sm leading-snug text-[hsl(30_12%_76%)]">{moment.detail}</div></div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/app"><Button className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold">Launch App</Button></Link>
                  <Link to="/admin"><Button variant="outline" className="border-[hsl(43_96%_56%/0.4)] bg-transparent text-white hover:bg-[hsl(43_96%_56%/0.1)] hover:text-white">Back Office</Button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= TOP NAV ============= */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[hsl(220_22%_8%/0.7)] border-b border-[hsl(43_96%_56%/0.15)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <a href="#top" className="flex items-center gap-2.5">
            <img src={logo} alt="SuperNomad logo" className="h-9 w-9 rounded-md object-cover ring-1 ring-[hsl(43_96%_56%/0.4)]" width={36} height={36} />
            <span className="font-display text-lg font-bold tracking-wide">
              Super<span className="text-[hsl(var(--gold))]">Nomad</span>
            </span>
          </a>
            <nav className="hidden md:flex items-center gap-7 text-sm text-[hsl(30_12%_80%)]">
              <button type="button" onClick={() => setFilmMode('teaser')} className="hover:text-[hsl(var(--gold))] transition-colors">Teaser</button>
            <a href="#problem" className="hover:text-[hsl(var(--gold))] transition-colors">Problem</a>
            <a href="#concierge" className="hover:text-[hsl(var(--gold))] transition-colors">Concierge AI</a>
            <a href="#guardian" className="hover:text-[hsl(var(--gold))] transition-colors">Guardian</a>
            <a href="#ecosystem" className="hover:text-[hsl(var(--gold))] transition-colors">Ecosystem</a>
            <a href="#pricing" className="hover:text-[hsl(var(--gold))] transition-colors">Pricing</a>
            <a href="#trust" className="hover:text-[hsl(var(--gold))] transition-colors">Trust</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="inline-flex">
              <Button size="sm" variant="outline" className="border-[hsl(43_96%_56%/0.4)] bg-transparent text-white hover:bg-[hsl(43_96%_56%/0.1)] hover:text-white px-2 sm:px-3" title="Investor Back Office preview">
                <Shield className="h-3.5 w-3.5 text-[hsl(var(--gold))] sm:mr-1.5" />
                <span className="hidden sm:inline">Back Office</span>
              </Button>
            </Link>
            <Link to="/app">
              <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold hover:opacity-90 shadow-[var(--shadow-glow-gold)]">
                Launch App <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ============= HERO ============= */}
      <section id="top" className="relative min-h-[100svh] flex items-center pt-16 sm:pt-20">
          <div className="absolute inset-0">
          <img src={heroImg} alt="Global citizen at golden hour overlooking a futuristic skyline" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_22%_8%/0.7)] via-[hsl(220_22%_8%/0.55)] to-[hsl(220_22%_8%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220_22%_8%)] via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(90deg,hsl(43_96%_56%/0.35)_1px,transparent_1px),linear-gradient(0deg,hsl(43_96%_56%/0.25)_1px,transparent_1px)] bg-[size:52px_52px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 flex flex-col items-center text-center w-full">
          <div className="space-y-3 sm:space-y-4 md:space-y-5 animate-fade-in max-w-4xl">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] hover:bg-[hsl(43_96%_56%/0.2)]">
              <Sparkles className="mr-1.5 h-3 w-3" /> The Sovereign OS for Global Citizens
            </Badge>
            <h1 className="font-display font-bold leading-[0.95] tracking-tight">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl break-words">
                <span className="text-white">Super</span>
                <span className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold-light))] to-[hsl(var(--gold-dark))] bg-clip-text text-transparent drop-shadow-[0_4px_30px_hsl(43_96%_56%/0.4)]">Nomad</span>
              </span>
              <span className="block mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-semibold">
                Your borderless life, finally one app.
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[hsl(30_12%_80%)] leading-snug max-w-2xl mx-auto">
              SuperNomad is the world's first Sovereign Operating System. We've replaced the chaos of fragmented travel apps, lost tax days, and endless KYC forms with a single, proactive AI intelligence.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-[hsl(30_12%_75%)] leading-snug max-w-2xl mx-auto">
              Built for the <strong className="text-white">850 million global citizens</strong> who call the world home. SuperNomad doesn't just track your journey — it <strong className="text-white">secures your status</strong>.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 justify-center">
              <button type="button" onClick={() => setFilmMode('teaser')}>
                <Button size="lg" variant="outline" className="border-[hsl(43_96%_56%/0.5)] bg-[hsl(220_22%_8%/0.35)] text-white hover:bg-[hsl(43_96%_56%/0.12)] hover:text-white text-sm sm:text-base px-5 sm:px-7 py-4 sm:py-5">
                  <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[hsl(var(--gold))]" /> Watch teaser
                </Button>
              </button>
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold text-sm sm:text-base px-5 sm:px-7 py-4 sm:py-5 hover:opacity-95 shadow-[var(--shadow-glow-gold)] hover:scale-[1.02] transition-transform">
                  <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Launch SuperNomad
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <button type="button" onClick={() => setFilmMode('full')}>
                <Button size="lg" variant="outline" className="border-[hsl(43_96%_56%/0.4)] bg-transparent text-white hover:bg-[hsl(43_96%_56%/0.1)] hover:text-white text-sm sm:text-base px-5 sm:px-7 py-4 sm:py-5">
                  Longer film
                </Button>
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-[hsl(30_12%_70%)]">
              <Check className="inline h-3 w-3 sm:h-3.5 sm:w-3.5 text-[hsl(var(--gold))]" /> No signup required for demo · Try as Meghan or John · Full demo access.
            </p>

            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1.5 pt-1 text-[11px] sm:text-xs text-[hsl(30_12%_75%)] justify-center">
              {trustBadges.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5"><Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[hsl(var(--gold))]" /> {label}</span>
              ))}
              <span className="flex items-center gap-1.5"><Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[hsl(var(--gold))]" /> 6.2M+ nomads online</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============= 184TH DAY HERO IMAGE ============= */}
      <section id="problem" className="relative py-20 md:py-28 border-y border-[hsl(43_96%_56%/0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.7)] ring-1 ring-[hsl(43_96%_56%/0.2)]">
              <img src={day184Img} alt="The 184th day might be the most expensive day of your life" loading="lazy" className="w-full h-auto" width={1024} height={1024} />
            </div>
            <div className="space-y-6">
              <Badge className="bg-[hsl(0_80%_58%/0.15)] text-[hsl(0_80%_68%)] border-[hsl(0_80%_58%/0.3)]">
                <AlertTriangle className="mr-1.5 h-3 w-3" /> The Hidden Cost of Borderless Living
              </Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                "The 184th day might be the most expensive day of your life."
              </h2>
              <p className="text-lg text-[hsl(30_12%_80%)] leading-relaxed">
                One miscounted day can trigger tax residency in a country you never intended to live in: audits, double taxation, frozen bank accounts. SuperNomad counts every day silently — across <strong className="text-white">195+ jurisdictions</strong> — and warns you long before the line is crossed.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-[hsl(43_96%_56%/0.2)] bg-[hsl(220_22%_12%/0.6)] backdrop-blur-sm p-5">
                    <div className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--gold))]">{s.value}</div>
                    <div className="text-sm font-semibold text-white mt-1">{s.label}</div>
                    <div className="text-xs text-[hsl(30_12%_70%)] mt-1 leading-snug">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= CINEMATIC ECOSYSTEM FILM STRIP ============= */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b border-[hsl(43_96%_56%/0.1)]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(220_22%_6%),hsl(220_22%_10%)_45%,hsl(220_22%_6%))]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_20%_30%,hsl(43_96%_56%)_0,transparent_22%),radial-gradient(circle_at_80%_20%,hsl(12_88%_59%)_0,transparent_18%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-10 lg:gap-14 items-center">
            <div className="space-y-6">
              <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]"><PlayCircle className="mr-1.5 h-3 w-3" /> Cinematic website layer</Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">Less SaaS page. More private-bank travel command room.</h2>
              <p className="text-lg leading-relaxed text-[hsl(30_12%_80%)]">The new landing experience shows SuperNomad through real-world moments: arrival, protection, community, identity and company intelligence — while keeping instant access to the app and Back Office.</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setFilmMode('teaser')}><Button className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold"><PlayCircle className="mr-2 h-4 w-4" /> Play teaser</Button></button>
                <button type="button" onClick={() => setFilmMode('full')}><Button variant="outline" className="border-[hsl(43_96%_56%/0.4)] bg-transparent text-white hover:bg-[hsl(43_96%_56%/0.1)] hover:text-white">Open longer video</Button></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {cinematicMoments.map((moment, index) => (
                <button key={moment.label} type="button" onClick={() => setFilmMode(index === 0 ? 'teaser' : 'full')} className="group relative overflow-hidden rounded-2xl border border-[hsl(43_96%_56%/0.18)] aspect-[4/3] text-left shadow-[0_24px_70px_-34px_hsl(0_0%_0%/0.9)]">
                  <img src={moment.img} alt={moment.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_22%_5%)] via-[hsl(220_22%_8%/0.35)] to-transparent" />
                  <div className="absolute bottom-0 p-4 sm:p-5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--gold))]">Scene 0{index + 1}</div>
                    <div className="font-display text-xl sm:text-2xl font-bold text-white">{moment.label}</div>
                    <div className="mt-1 hidden sm:block text-xs leading-snug text-[hsl(30_12%_78%)]">{moment.detail}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============= PAIN -> FIX ============= */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">The Fix</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Every nomad's pain — solved by one platform.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">Stop juggling spreadsheets, government portals, and a dozen insecure apps. SuperNomad replaces all of them.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {pains.map(({ icon: Icon, title, fix, desc }) => (
              <div key={title} className="group rounded-2xl border border-[hsl(43_96%_56%/0.15)] bg-gradient-to-br from-[hsl(220_22%_12%)] to-[hsl(220_22%_10%)] p-7 hover:border-[hsl(43_96%_56%/0.4)] transition-all hover:shadow-[var(--shadow-glow-gold)]">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--gold-dark))] to-[hsl(var(--gold-light))] flex items-center justify-center text-[hsl(220_22%_10%)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[hsl(0_80%_68%)] uppercase tracking-wider">Pain · {title}</div>
                    <h3 className="font-display text-2xl font-bold mt-1 mb-2">{fix}</h3>
                    <p className="text-[hsl(30_12%_80%)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CONCIERGE AI SPOTLIGHT ============= */}
      <section id="concierge" className="relative py-20 md:py-28 border-y border-[hsl(43_96%_56%/0.1)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_30%_30%,hsl(43_96%_56%/0.10)_0px,transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* LEFT — Pitch */}
            <div className="lg:col-span-5 space-y-6">
              <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]">
                <Brain className="mr-1.5 h-3 w-3" /> Concierge AI · Sofia & Marcus
              </Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                A concierge that <span className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold-light))] to-[hsl(var(--gold-dark))] bg-clip-text text-transparent">actually knows you.</span>
              </h2>
              <p className="text-lg text-[hsl(30_12%_82%)] leading-relaxed">
                Not a chatbot. A persistent personal assistant that learns your travel style, seat preference, dietary rules, loyalty programs, sport tribe, and risk tolerance — then quietly handles your life.
              </p>
              <ul className="space-y-3 text-[hsl(30_12%_88%)]">
                {[
                  'Books flights, hotels, and car rentals — with your loyalty cards already attached.',
                  'Reserves restaurant tables in 100+ cities, matched to your cuisine and budget.',
                  'Surfaces concerts, padel matches, golf tee times, and local events worth your time.',
                  'Optimizes airport lounges, points redemption, and upgrade timing automatically.',
                  'Remembers every preference across cities — no re-explaining who you are.',
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 text-[hsl(var(--gold))] mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/app">
                  <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold hover:opacity-95 shadow-[var(--shadow-glow-gold)]">
                    <Mic className="mr-2 h-4 w-4" /> Meet your Concierge
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT — Capability mosaic */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: Plane, title: 'Flights', desc: 'Premium cabins, best schedules, points-aware' },
                  { icon: Hotel, title: 'Hotels', desc: 'Suites that match your chains & tier' },
                  { icon: UtensilsCrossed, title: 'Restaurants', desc: 'Tables with your dietary fit & vibe' },
                  { icon: Trophy, title: 'Sports & Tee Times', desc: 'Padel, golf, and cycling crews near you' },
                  { icon: Music2, title: 'Concerts & Events', desc: 'Curated to your taste, not algorithms' },
                  { icon: Award, title: 'Loyalty Optimizer', desc: 'Auto-applies the right card every time' },
                  { icon: Headphones, title: 'Airport Lounges', desc: 'Best lounge per terminal, on the fly' },
                  { icon: Wallet, title: 'Agentic Wallet', desc: 'Autonomous booking with your rules' },
                  { icon: Heart, title: 'Personal Memory', desc: 'Knows your style across every city' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="group rounded-xl border border-[hsl(43_96%_56%/0.18)] bg-[hsl(220_22%_12%/0.7)] backdrop-blur-sm p-4 hover:border-[hsl(43_96%_56%/0.45)] hover:bg-[hsl(220_22%_14%)] transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--gold-dark))] to-[hsl(var(--gold-light))] flex items-center justify-center text-[hsl(220_22%_10%)] mb-3 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold text-sm text-white mb-1">{title}</div>
                    <div className="text-xs text-[hsl(30_12%_75%)] leading-snug">{desc}</div>
                  </div>
                ))}
              </div>

              {/* Conversation snippet */}
              <div className="mt-5 rounded-2xl border border-[hsl(43_96%_56%/0.2)] bg-[hsl(220_22%_10%/0.85)] p-5 shadow-[0_20px_60px_-20px_hsl(0_0%_0%/0.6)]">
                <div className="flex items-center gap-2 mb-3 text-xs text-[hsl(var(--gold))]">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[hsl(var(--gold))]" />
                  Live · Sofia is online
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="text-[hsl(30_12%_70%)]"><span className="text-white">You:</span> "Book me Lisbon → Madrid Friday morning."</div>
                  <div className="text-[hsl(30_12%_88%)]">
                    <span className="text-[hsl(var(--gold))]">Sofia:</span> TAP 8:05 → window seat, vegetarian meal, points on your Star Alliance Gold. Suite at Rosewood with late check-in. Padel court booked Saturday 10 am with Carlos. Confirm?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= THREAT INTELLIGENCE / GUARDIAN SPOTLIGHT ============= */}
      <section id="guardian" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={securityImg} alt="" className="w-full h-full object-cover opacity-25" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_22%_8%)] via-[hsl(220_22%_8%/0.92)] to-[hsl(220_22%_8%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* LEFT — Live threat panel */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl border border-[hsl(0_80%_58%/0.25)] bg-[hsl(220_22%_10%/0.9)] backdrop-blur-sm p-6 shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.7)]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Radar className="h-5 w-5 text-[hsl(0_80%_68%)]" />
                    <span className="font-display font-bold text-white">Threat Intelligence · Live</span>
                  </div>
                  <Badge className="bg-[hsl(0_80%_58%/0.18)] text-[hsl(0_80%_72%)] border-[hsl(0_80%_58%/0.35)] text-[10px]">
                    500+ incidents · 200+ cities
                  </Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { city: 'Paris', lvl: 'Caution', color: 'hsl(43_96%_56%)', msg: 'Transport strike — metro line 1 disrupted until 18:00' },
                    { city: 'Bangkok', lvl: 'Advisory', color: 'hsl(43_96%_56%)', msg: 'Air quality unhealthy (AQI 168) — limit outdoor activity' },
                    { city: 'Mexico City', lvl: 'Alert', color: 'hsl(0_80%_62%)', msg: 'Civil demonstration near Reforma 14:00 — avoid corridor' },
                    { city: 'Dubai', lvl: 'Safe', color: 'hsl(160_60%_50%)', msg: 'No active incidents · Guardian standing by' },
                  ].map((t) => (
                    <div key={t.city} className="flex items-start gap-3 rounded-lg border border-[hsl(43_96%_56%/0.12)] bg-[hsl(220_22%_12%)] p-3">
                      <span
                        className="mt-1.5 inline-flex h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: t.color, boxShadow: `0 0 12px ${t.color}` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white text-sm">{t.city}</span>
                          <span className="text-[10px] uppercase tracking-wider" style={{ color: t.color }}>{t.lvl}</span>
                        </div>
                        <div className="text-xs text-[hsl(30_12%_78%)] leading-snug">{t.msg}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-[hsl(43_96%_56%/0.12)] grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="font-display text-2xl font-bold text-white">24/7</div>
                    <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)]">Monitoring</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-[hsl(var(--gold))]">&lt; 60s</div>
                    <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)]">Alert latency</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-white">8</div>
                    <div className="text-[10px] uppercase tracking-wider text-[hsl(30_12%_70%)]">Threat types</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Pitch */}
            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
              <Badge className="bg-[hsl(0_80%_58%/0.15)] text-[hsl(0_80%_70%)] border-[hsl(0_80%_58%/0.3)]">
                <ShieldAlert className="mr-1.5 h-3 w-3" /> Threat Intelligence + Guardian
              </Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                Because peace of mind is <span className="text-[hsl(0_80%_70%)]">non-negotiable.</span>
              </h2>
              <p className="text-lg text-[hsl(30_12%_82%)] leading-relaxed">
                SuperNomad continuously fuses 500+ live incidents across 200+ cities — terrorism, civil unrest, severe weather, cyber, transport, and health — and warns you before you walk into trouble. The Concierge re-routes flights, cancels bookings, and notifies your family automatically.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Radar, t: 'Real-time fusion', d: 'Government feeds, news wires, and crowd-sourced reports.' },
                  { icon: Activity, t: 'Personal safety score', d: 'Per neighborhood, per hour, for your itinerary.' },
                  { icon: Eye, t: 'Black Box Guardian', d: 'WORM evidence recorder — un-erasable and encrypted.' },
                  { icon: Siren, t: 'SOS + Cyber Helpline', d: '24/7 human + AI response, embassy hotline.' },
                ].map(({ icon: Icon, t, d }) => (
                  <li key={t} className="flex items-start gap-3 rounded-lg border border-[hsl(0_80%_58%/0.18)] bg-[hsl(220_22%_12%/0.6)] p-3">
                    <Icon className="h-5 w-5 text-[hsl(0_80%_70%)] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-white text-sm">{t}</div>
                      <div className="text-xs text-[hsl(30_12%_78%)] leading-snug">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============= ECOSYSTEM (FEATURES) ============= */}
      <section id="ecosystem" className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,hsl(43_96%_56%/0.08)_0px,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">The Ecosystem</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">65+ tools. One sovereign hub.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">From booking a flight, to optimizing your tax position, to surviving a border crisis — it all lives here.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-[hsl(43_96%_56%/0.12)] bg-[hsl(220_22%_12%/0.7)] backdrop-blur-sm p-5 hover:border-[hsl(43_96%_56%/0.35)] hover:bg-[hsl(220_22%_14%)] transition-all">
                <Icon className="h-7 w-7 text-[hsl(var(--gold))] mb-3" />
                <h3 className="font-semibold text-base mb-1.5">{title}</h3>
                <p className="text-xs text-[hsl(30_12%_75%)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Showcase strip */}
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              { img: travelImg, title: 'Travel', tag: 'Air charter · Loyalty · Concierge' },
              { img: securityImg, title: 'Identity Vault', tag: 'AES-256 · Zero-knowledge' },
              { img: communityImg, title: 'Local Living', tag: '100+ cities · Live community' },
            ].map(({ img, title, tag }) => (
              <div key={title} className="relative rounded-2xl overflow-hidden ring-1 ring-[hsl(43_96%_56%/0.2)] aspect-[4/3] group">
                <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" width={1024} height={768} />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_22%_8%)] via-[hsl(220_22%_8%/0.4)] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-xs uppercase tracking-wider text-[hsl(var(--gold))] font-semibold">{tag}</div>
                  <div className="font-display text-2xl font-bold text-white mt-1">{title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= HOW IT WORKS ============= */}
      <section id="how" className="py-20 md:py-28 border-t border-[hsl(43_96%_56%/0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">How It Works</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Your invisible chief operations officer.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">Three steps. Then SuperNomad disappears into the background and only resurfaces when you need to act.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ n, title, desc, bullets }) => (
              <div key={n} className="rounded-2xl border border-[hsl(43_96%_56%/0.18)] bg-gradient-to-b from-[hsl(220_22%_12%)] to-[hsl(220_22%_10%)] p-7 relative overflow-hidden">
                <div className="absolute top-4 right-5 font-display text-7xl font-bold text-[hsl(43_96%_56%/0.12)] leading-none">{n}</div>
                <h3 className="font-display text-2xl font-bold mb-3 relative">{title}</h3>
                <p className="text-[hsl(30_12%_80%)] leading-relaxed relative mb-5">{desc}</p>
                <ul className="space-y-2 relative">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-[hsl(30_12%_85%)]">
                      <Check className="h-4 w-4 text-[hsl(var(--gold))] shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= AI MAP ============= */}
      <section className="relative py-20 md:py-28 border-t border-[hsl(43_96%_56%/0.1)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_50%,hsl(43_96%_56%/0.08)_0px,transparent_48%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4"><Route className="mr-1.5 h-3 w-3" /> AI command map</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">One user request. A full operating system behind it.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">The public website now makes the intelligence layer visible: CEO strategy, directors, concierge routing and specialist agents working together without wasting tokens.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {aiMap.map(({ icon: Icon, title, desc }, index) => (
              <div key={title} className="relative rounded-2xl border border-[hsl(43_96%_56%/0.18)] bg-[hsl(220_22%_12%/0.78)] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--gold-dark))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)]"><Icon className="h-6 w-6" /></div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[hsl(var(--gold))]">Layer 0{index + 1}</div>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(30_12%_76%)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= LIFESTYLE ============= */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="rounded-2xl overflow-hidden ring-1 ring-[hsl(43_96%_56%/0.2)] order-2 md:order-1">
              <img src={lifestyleImg} alt="Friends playing padel at sunset" loading="lazy" className="w-full h-auto" width={1024} height={1024} />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <Badge className="bg-[hsl(12_88%_59%/0.15)] text-[hsl(12_88%_70%)] border-[hsl(12_88%_59%/0.3)]">Live · Connect · Thrive</Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold">Move cities. Never restart your life.</h2>
              <p className="text-lg text-[hsl(30_12%_80%)] leading-relaxed">
                Padel partners in Madrid. Cycling crews in Mallorca. Golf in Phuket. Dinner in Lisbon. SuperNomad turns every new city into a community — instantly.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {sports.map((s) => (
                  <div key={s.title} className="rounded-xl border border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_12%/0.6)] p-4">
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="font-semibold mb-1">{s.title}</div>
                    <div className="text-xs text-[hsl(30_12%_75%)] leading-snug">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= WHY (DIFFERENTIATORS) ============= */}
      <section className="py-20 md:py-28 border-y border-[hsl(43_96%_56%/0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Why global citizens choose SuperNomad.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">Not another travel app. Not another fintech. The operating system for borderless life.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: 'Proactive, not reactive', desc: 'AI anticipates tax thresholds, visa deadlines, and compliance shifts before they hit.' },
              { icon: Mic, title: 'Fully voice-controlled', desc: 'Natural commands across 13 languages. Hands-free, anywhere on Earth.' },
              { icon: Lock, title: 'Sovereign by design', desc: 'AES-256-GCM, zero-knowledge vaults, and GDPR Art. 17 right to erasure.' },
              { icon: Globe2, title: 'Truly global', desc: '195+ countries, 100+ cities, embassies, weather, threats, and community.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--gold-dark))] to-[hsl(var(--gold-light))] flex items-center justify-center text-[hsl(220_22%_10%)] mb-4 shadow-[var(--shadow-glow-gold)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
                <p className="text-sm text-[hsl(30_12%_80%)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= PRICING ============= */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">Pricing</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Try it free. Upgrade if you love it.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">Demo unlocks the full experience — no credit card.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[hsl(43_96%_56%/0.18)] bg-[hsl(220_22%_12%)] p-8">
              <div className="font-display text-2xl font-bold mb-1">Free</div>
              <div className="text-sm text-[hsl(30_12%_75%)] mb-5">Everything you need to live borderless</div>
              <div className="font-display text-5xl font-bold mb-6">$0<span className="text-base font-normal text-[hsl(30_12%_70%)]">/month</span></div>
              <ul className="space-y-3 text-sm mb-7">
                {[
                  '1,000,000 AI requests / month',
                  'AI Concierge — chat mode',
                  'All 195+ countries · Visa & ETIAS hub',
                  'Snomad ID encrypted vault',
                  'Black Box Guardian + Trust Pass',
                  'Agentic Wallet (autonomous booking)',
                  'Community, weather, and threat intel',
                ].map(b => (
                  <li key={b} className="flex items-start gap-2"><Check className="h-4 w-4 text-[hsl(var(--gold))] mt-0.5 shrink-0" /> {b}</li>
                ))}
              </ul>
              <Link to="/app" className="block">
                <Button variant="outline" className="w-full border-[hsl(43_96%_56%/0.4)] text-white hover:bg-[hsl(43_96%_56%/0.1)] hover:text-white">Try the demo</Button>
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-[hsl(var(--gold))] bg-gradient-to-br from-[hsl(220_22%_14%)] to-[hsl(220_22%_10%)] p-8 relative shadow-[var(--shadow-glow-gold)]">
              <Badge className="absolute -top-3 right-6 bg-gradient-to-r from-[hsl(var(--gold-dark))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold">Most Popular</Badge>
              <div className="font-display text-2xl font-bold mb-1">Premium</div>
              <div className="text-sm text-[hsl(30_12%_75%)] mb-5">Sovereign mode — full power</div>
              <div className="font-display text-5xl font-bold mb-6">$4.99<span className="text-base font-normal text-[hsl(30_12%_70%)]">/month</span></div>
              <ul className="space-y-3 text-sm mb-7">
                {[
                  'Everything in Free',
                  '10,000,000 AI requests / month',
                  'AI Concierge — voice + chat with memory',
                  'Tax Day Calculator (183-day, SPT, residency)',
                  'Travel Reports (PDF + Excel exports)',
                  'Priority 24/7 support',
                ].map(b => (
                  <li key={b} className="flex items-start gap-2"><Check className="h-4 w-4 text-[hsl(var(--gold))] mt-0.5 shrink-0" /> {b}</li>
                ))}
              </ul>
              <Link to="/app" className="block">
                <Button className="w-full bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold hover:opacity-95">
                  Launch SuperNomad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============= TRUST & COMPLIANCE ============= */}
      <section id="trust" className="py-20 md:py-28 border-t border-[hsl(43_96%_56%/0.1)] bg-[hsl(220_22%_6%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">Trust & Compliance</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Your data. Your keys. Your control.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">SuperNomad is built on a sovereign trust framework — every sensitive field is encrypted client-side before it ever leaves your device.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Lock, title: 'AES-256-GCM', desc: 'Military-grade encryption for vault, identity, and payment data.' },
              { icon: Shield, title: 'GDPR Art. 17', desc: 'Right to erasure — wipe your data with one click, anytime.' },
              { icon: Eye, title: 'Zero-Knowledge', desc: 'We cannot read your vault. Only you hold the keys.' },
              { icon: Check, title: 'CCPA Ready', desc: 'California Consumer Privacy Act compliant from day one.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-[hsl(43_96%_56%/0.18)] bg-[hsl(220_22%_10%)] p-5">
                <Icon className="h-6 w-6 text-[hsl(var(--gold))] mb-3" />
                <div className="font-semibold mb-1">{title}</div>
                <div className="text-xs text-[hsl(30_12%_75%)] leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_10%)] p-6 text-sm text-[hsl(30_12%_80%)] leading-relaxed">
            <p className="mb-3">
              <strong className="text-white">Demo notice:</strong> SuperNomad runs in demo mode without sign-up. Demo data stays in your browser (localStorage) and never reaches our servers. When you create an account, your data is migrated under your user ID and protected by Row-Level Security.
            </p>
            <p>
              <strong className="text-white">Important:</strong> SuperNomad provides informational guidance only. We are not a tax, legal, immigration, or medical advisor. Consult a qualified professional for advice specific to your situation. See our{' '}
              <Link to="/privacy-policy" className="text-[hsl(var(--gold))] underline hover:no-underline">Privacy Policy</Link> and{' '}
              <Link to="/terms" className="text-[hsl(var(--gold))] underline hover:no-underline">Terms & Conditions</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ============= APP STORES ============= */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">Mobile</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Native apps coming soon.</h2>
          <p className="text-[hsl(30_12%_80%)] mb-8 max-w-2xl mx-auto">For now, SuperNomad runs beautifully in your browser — install it as a web app from your phone for the full native feel.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-[hsl(220_22%_12%)] border border-[hsl(43_96%_56%/0.2)] px-5 py-3 opacity-80 cursor-not-allowed" aria-disabled="true">
              <Apple className="h-7 w-7 text-white" />
              <div className="text-left">
                <div className="text-[10px] text-[hsl(30_12%_70%)]">Coming soon to</div>
                <div className="font-semibold text-white">App Store</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[hsl(220_22%_12%)] border border-[hsl(43_96%_56%/0.2)] px-5 py-3 opacity-80 cursor-not-allowed" aria-disabled="true">
              <Smartphone className="h-7 w-7 text-white" />
              <div className="text-left">
                <div className="text-[10px] text-[hsl(30_12%_70%)]">Coming soon to</div>
                <div className="font-semibold text-white">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= QUICK ACCESS ============= */}
      <section className="py-10 border-y border-[hsl(43_96%_56%/0.1)] bg-[hsl(220_22%_7%)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-[hsl(43_96%_56%/0.18)] bg-[hsl(220_22%_11%/0.72)] p-5 sm:p-6">
            <div className="text-center sm:text-left">
              <div className="font-display text-2xl font-bold text-white">Go straight to the product.</div>
              <div className="text-sm text-[hsl(30_12%_76%)]">The cinematic layer never blocks app access or investor/staff Back Office access.</div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/app"><Button className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold"><Rocket className="mr-2 h-4 w-4" /> Launch App</Button></Link>
              <Link to="/admin"><Button variant="outline" className="border-[hsl(43_96%_56%/0.4)] bg-transparent text-white hover:bg-[hsl(43_96%_56%/0.1)] hover:text-white"><Building2 className="mr-2 h-4 w-4 text-[hsl(var(--gold))]" /> Back Office</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============= FINAL CTA ============= */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={travelImg} alt="" className="w-full h-full object-cover opacity-30" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_22%_8%)] via-[hsl(220_22%_8%/0.85)] to-[hsl(220_22%_8%)]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <img src={logo} alt="" className="w-20 h-20 mx-auto rounded-xl mb-6 ring-1 ring-[hsl(43_96%_56%/0.4)] shadow-[var(--shadow-glow-gold)]" loading="lazy" width={80} height={80} />
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Your sovereign life,{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] bg-clip-text text-transparent">starts now.</span>
          </h2>
          <p className="text-lg text-[hsl(30_12%_80%)] mb-8">Open the app. Try it as a demo. Live borderless in 60 seconds.</p>
          <Link to="/app">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold text-lg px-10 py-7 hover:opacity-95 shadow-[var(--shadow-glow-gold)] hover:scale-[1.02] transition-transform">
              <Rocket className="mr-2 h-5 w-5" /> Launch SuperNomad
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-[hsl(30_12%_70%)] mt-5">No signup · Demo unlocks the full experience · Voice-controlled.</p>
        </div>
      </section>

      {/* ============= FOOTER ============= */}
      <footer className="border-t border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_6%)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src={logo} alt="" className="h-9 w-9 rounded-md" width={36} height={36} />
                <span className="font-display text-lg font-bold">Super<span className="text-[hsl(var(--gold))]">Nomad</span></span>
              </div>
              <p className="text-sm text-[hsl(30_12%_75%)] max-w-md leading-relaxed">
                The Operating System for Global Citizens. Consolidating tax, visa, identity, banking, community, and security into one intelligent, sovereign platform.
              </p>
            </div>
            <div>
              <div className="font-semibold text-white mb-3 text-sm">Product</div>
              <ul className="space-y-2 text-sm text-[hsl(30_12%_75%)]">
                <li><Link to="/app" className="hover:text-[hsl(var(--gold))]">Launch App</Link></li>
                <li><a href="#ecosystem" className="hover:text-[hsl(var(--gold))]">Features</a></li>
                <li><a href="#pricing" className="hover:text-[hsl(var(--gold))]">Pricing</a></li>
                <li><a href="#how" className="hover:text-[hsl(var(--gold))]">How it works</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-3 text-sm">Legal</div>
              <ul className="space-y-2 text-sm text-[hsl(30_12%_75%)]">
                <li><Link to="/privacy-policy" className="hover:text-[hsl(var(--gold))]">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[hsl(var(--gold))]">Terms & Conditions</Link></li>
                <li><a href="#trust" className="hover:text-[hsl(var(--gold))]">Trust & Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-[hsl(43_96%_56%/0.1)] flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-[hsl(30_12%_70%)]">
            <div>© 2026 SuperNomad. Built for the borderless generation.</div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 items-center">
              <span className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-[hsl(var(--gold))]" /> AES-256-GCM</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-[hsl(var(--gold))]" /> GDPR · CCPA</span>
              <span>SuperNomad is not a tax, legal, or financial advisor.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
