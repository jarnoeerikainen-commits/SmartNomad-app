import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Sparkles, Globe2, Lock, Plane, Calculator, FileCheck,
  Users, Bell, MessageCircle, Brain, MapPin, Award, Wallet,
  ArrowRight, Check, Rocket, Star, Mic, Eye, Zap, AlertTriangle,
  Apple, Smartphone, Hotel, UtensilsCrossed, Music2, Trophy,
  Radar, Siren, ShieldAlert, Activity, Headphones, Heart
} from 'lucide-react';
import logo from '@/assets/supernomad-logo.jpg';
import heroImg from '@/assets/landing-hero.jpg';
import day184Img from '@/assets/landing-184th-day.jpg';
import communityImg from '@/assets/landing-community.jpg';
import securityImg from '@/assets/landing-security.jpg';
import travelImg from '@/assets/landing-travel.jpg';
import lifestyleImg from '@/assets/landing-lifestyle.jpg';

const Landing: React.FC = () => {
  useEffect(() => {
    document.title = 'SuperNomad — The Operating System for Global Citizens';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Proactive AI for tax residency, visas, identity, community and safety. Voice-controlled, encrypted, sovereign — for digital nomads and global citizens.'
      );
    }
  }, []);

  const stats = [
    { value: '281M+', label: 'Digital Nomads', sub: 'Reshaping how the world works' },
    { value: '$12K', label: 'Avg Tax Penalty', sub: 'Lost yearly to residency confusion' },
    { value: '200+', label: 'Hours Wasted', sub: 'On bureaucracy every year' },
    { value: '67%', label: 'Security Issues', sub: 'Of nomads report data breaches' },
  ];

  const pains = [
    { icon: Calculator, title: 'Tax Confusion', fix: 'Tax Intelligence Hub', desc: 'Overlapping jurisdictions, the 184-day trap, double taxation. We track every day, every threshold, every rule — silently.' },
    { icon: FileCheck, title: 'Visa Stress', fix: 'Visa Auto-Matcher', desc: 'Expirations, renewal windows, entry rules. SuperNomad alerts you weeks before any deadline slips.' },
    { icon: Users, title: 'Loneliness Abroad', fix: 'Pulse + Vibe Community', desc: '6.2M nomads online. Find your tribe in any city — sport partners, dinners, meetups, mentors.' },
    { icon: Lock, title: 'Security Gaps', fix: 'Snomad ID Vault', desc: 'AES-256-GCM encrypted vault for passports, banking, medical. Zero-knowledge — only you hold the key.' },
  ];

  const features = [
    { icon: Brain, title: 'AI Concierge', desc: 'Sofia & Marcus — voice-first assistants that book, plan and protect 24/7' },
    { icon: Calculator, title: 'Tax Tracker', desc: '195+ countries, real-time residency thresholds, Schengen 90/180' },
    { icon: FileCheck, title: 'Visa & ETIAS', desc: 'Auto-match programs, EU 2026 ETIAS portal, official links' },
    { icon: Shield, title: 'Trust Pass', desc: 'W3C verifiable credentials with selective disclosure' },
    { icon: Eye, title: 'Black Box Guardian', desc: 'WORM evidence recorder for personal safety incidents' },
    { icon: Wallet, title: 'Agentic Wallet', desc: 'x402 protocol — AI books and pays autonomously, with your rules' },
    { icon: AlertTriangle, title: 'Threat Intelligence', desc: '500+ live incidents across 200+ cities, with safety scores' },
    { icon: Globe2, title: 'Local Living', desc: '700+ business centers, weather, community in 100+ cities' },
    { icon: MessageCircle, title: 'Community', desc: 'Pulse meetups, Vibe chat, sport finder (padel, golf, cycling)' },
    { icon: Award, title: 'Award Cards', desc: '100+ loyalty programs, AI-optimized point redemption' },
  ];

  const steps = [
    { n: '01', title: 'Onboard Securely', desc: 'Verify in under 2 minutes with biometric AI. End-to-end encrypted, GDPR & CCPA compliant from day one.', bullets: ['Biometric verification', 'GDPR & CCPA compliant', 'End-to-end encryption', 'Instant — no paperwork'] },
    { n: '02', title: 'Connect & Configure', desc: 'Tell the AI your goals. SuperNomad auto-configures compliance tracking, finds your community and curates the marketplace.', bullets: ['Custom compliance rules', 'Smart matchmaking', 'Marketplace curation', 'Automated alerts'] },
    { n: '03', title: 'Live & Explore', desc: 'SuperNomad runs invisibly. It only interrupts when action is required — otherwise you focus entirely on your life.', bullets: ['Invisible monitoring', 'Proactive tax alerts', 'Event discovery', '24/7 multilingual support'] },
  ];

  const sports = [
    { emoji: '🏸', title: 'Padel', desc: 'Skill-based matchmaking, real-time courts, ratings — globally.' },
    { emoji: '🚴', title: 'Cycling', desc: 'GPS-curated routes, local groups, terrain & difficulty maps.' },
    { emoji: '🏌️', title: 'Golf', desc: 'Handicap matching, course reviews, tournament discovery.' },
  ];

  const trustBadges = [
    { icon: Lock, label: 'AES-256-GCM' },
    { icon: Shield, label: 'GDPR Art. 17' },
    { icon: Eye, label: 'Zero-Knowledge' },
    { icon: Check, label: 'CCPA Ready' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220_22%_8%)] text-[hsl(30_12%_95%)] overflow-x-hidden">
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
            <a href="#problem" className="hover:text-[hsl(var(--gold))] transition-colors">Problem</a>
            <a href="#ecosystem" className="hover:text-[hsl(var(--gold))] transition-colors">Ecosystem</a>
            <a href="#how" className="hover:text-[hsl(var(--gold))] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[hsl(var(--gold))] transition-colors">Pricing</a>
            <a href="#trust" className="hover:text-[hsl(var(--gold))] transition-colors">Trust</a>
          </nav>
          <Link to="/app">
            <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold hover:opacity-90 shadow-[var(--shadow-glow-gold)]">
              Launch App <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ============= HERO ============= */}
      <section id="top" className="relative min-h-[100vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Global citizen at golden hour overlooking a futuristic skyline" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_22%_8%/0.7)] via-[hsl(220_22%_8%/0.55)] to-[hsl(220_22%_8%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220_22%_8%)] via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center w-full">
          <div className="space-y-7 animate-fade-in max-w-4xl">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] hover:bg-[hsl(43_96%_56%/0.2)]">
              <Sparkles className="mr-1.5 h-3 w-3" /> The Sovereign OS for Global Citizens
            </Badge>
            <h1 className="font-display font-bold leading-[0.95] tracking-tight">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl break-words">
                <span className="text-white">Super</span>
                <span className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold-light))] to-[hsl(var(--gold-dark))] bg-clip-text text-transparent drop-shadow-[0_4px_30px_hsl(43_96%_56%/0.4)]">Nomad</span>
              </span>
              <span className="block mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 font-semibold">
                Your borderless life, finally one app.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[hsl(30_12%_80%)] leading-relaxed max-w-2xl mx-auto">
              Proactive AI for <strong className="text-white">tax residency, visas, identity, safety and community</strong> — voice-controlled, encrypted, sovereign. Built for the 281 million people living between borders.
            </p>

            <div className="flex flex-wrap gap-3 pt-2 justify-center">
              <Link to="/app">
                <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold text-base px-7 py-6 hover:opacity-95 shadow-[var(--shadow-glow-gold)] hover:scale-[1.02] transition-transform">
                  <Rocket className="mr-2 h-5 w-5" /> Launch SuperNomad
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#ecosystem">
                <Button size="lg" variant="outline" className="border-[hsl(43_96%_56%/0.4)] bg-transparent text-white hover:bg-[hsl(43_96%_56%/0.1)] hover:text-white text-base px-7 py-6">
                  See what's inside
                </Button>
              </a>
            </div>

            <p className="text-xs text-[hsl(30_12%_70%)] pt-1">
              <Check className="inline h-3.5 w-3.5 text-[hsl(var(--gold))]" /> No signup required for demo · Try as Meghan or John · Full demo access
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-xs text-[hsl(30_12%_75%)] justify-center">
              {trustBadges.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> {label}</span>
              ))}
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> 6.2M+ nomads online</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============= 184TH DAY HERO IMAGE ============= */}
      <section id="problem" className="relative py-20 md:py-28 border-y border-[hsl(43_96%_56%/0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.7)] ring-1 ring-[hsl(43_96%_56%/0.2)]">
              <img src={day184Img} alt="The 184th day is the most expensive day of your life" loading="lazy" className="w-full h-auto" width={1024} height={1024} />
            </div>
            <div className="space-y-6">
              <Badge className="bg-[hsl(0_80%_58%/0.15)] text-[hsl(0_80%_68%)] border-[hsl(0_80%_58%/0.3)]">
                <AlertTriangle className="mr-1.5 h-3 w-3" /> The Hidden Cost of Borderless Living
              </Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                "The 184th day is the most expensive day of your life."
              </h2>
              <p className="text-lg text-[hsl(30_12%_80%)] leading-relaxed">
                One miscounted day can trigger tax residency in a country you never intended to live in. Audits, double taxation, frozen bank accounts. SuperNomad counts every day silently — across <strong className="text-white">195+ jurisdictions</strong> — and warns you long before the line is crossed.
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

      {/* ============= PAIN -> FIX ============= */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">The Fix</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Every nomad's pain — solved by one platform.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">Stop juggling spreadsheets, government portals and a dozen insecure apps. SuperNomad replaces all of them.</p>
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

      {/* ============= ECOSYSTEM (FEATURES) ============= */}
      <section id="ecosystem" className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(at_50%_0%,hsl(43_96%_56%/0.08)_0px,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <Badge className="bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)] mb-4">The Ecosystem</Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">65+ tools. One sovereign hub.</h2>
            <p className="text-lg text-[hsl(30_12%_80%)]">From booking a flight to optimizing your tax position to surviving a border crisis — it all lives here.</p>
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
              { img: travelImg, title: 'Travel', tag: 'Air charter · loyalty · concierge' },
              { img: securityImg, title: 'Identity Vault', tag: 'AES-256 · zero-knowledge' },
              { img: communityImg, title: 'Local Living', tag: '100+ cities · live community' },
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
              { icon: Zap, title: 'Proactive, not reactive', desc: 'AI anticipates tax thresholds, visa deadlines and compliance shifts before they hit.' },
              { icon: Mic, title: 'Fully voice-controlled', desc: 'Natural commands across 13 languages. Hands-free, anywhere on Earth.' },
              { icon: Lock, title: 'Sovereign by design', desc: 'AES-256-GCM, zero-knowledge vaults, GDPR Art. 17 right to erasure.' },
              { icon: Globe2, title: 'Truly global', desc: '195+ countries, 100+ cities, embassies, weather, threats, community.' },
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
              <div className="text-sm text-[hsl(30_12%_75%)] mb-5">Perfect to explore</div>
              <div className="font-display text-5xl font-bold mb-6">$0<span className="text-base font-normal text-[hsl(30_12%_70%)]">/month</span></div>
              <ul className="space-y-3 text-sm mb-7">
                {['Full demo access (Meghan & John personas)', 'Tax tracking · 195+ countries', 'Visa & ETIAS hub', '1,000 AI requests / month', 'Community, weather, threat intel'].map(b => (
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
              <div className="text-sm text-[hsl(30_12%_75%)] mb-5">Sovereign mode</div>
              <div className="font-display text-5xl font-bold mb-6">$4.99<span className="text-base font-normal text-[hsl(30_12%_70%)]">/month</span></div>
              <ul className="space-y-3 text-sm mb-7">
                {['Everything in Free', '10,000 AI requests / month', 'AI Concierge with voice + memory', 'Snomad ID encrypted vault', 'Black Box Guardian + Trust Pass', 'Agentic Wallet (autonomous booking)', 'Priority support'].map(b => (
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
              { icon: Lock, title: 'AES-256-GCM', desc: 'Military-grade encryption for vault, identity and payment data' },
              { icon: Shield, title: 'GDPR Art. 17', desc: 'Right to erasure — wipe your data with one click, any time' },
              { icon: Eye, title: 'Zero-Knowledge', desc: 'We cannot read your vault. Only you hold the keys.' },
              { icon: Check, title: 'CCPA Ready', desc: 'California Consumer Privacy Act compliant from day one' },
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
              <strong className="text-white">Important:</strong> SuperNomad provides informational guidance only. We are not a tax, legal, immigration or medical advisor. Consult a qualified professional for advice specific to your situation. See our{' '}
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
          <p className="text-lg text-[hsl(30_12%_80%)] mb-8">Open the app. Try it as a demo. Be living borderless in 60 seconds.</p>
          <Link to="/app">
            <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(220_22%_10%)] font-semibold text-lg px-10 py-7 hover:opacity-95 shadow-[var(--shadow-glow-gold)] hover:scale-[1.02] transition-transform">
              <Rocket className="mr-2 h-5 w-5" /> Launch SuperNomad
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-[hsl(30_12%_70%)] mt-5">No signup · Demo unlocks the full experience · Voice-controlled</p>
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
                The Operating System for Global Citizens. Consolidating tax, visa, identity, banking, community and security into one intelligent, sovereign platform.
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
              <span>SuperNomad is not a tax, legal or financial advisor.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
