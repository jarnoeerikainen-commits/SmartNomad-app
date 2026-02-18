import { useState } from 'react';
import { Shield, Users, Phone, Building2, Cross, Lock, Radar, Plane, AlertTriangle, Search, Briefcase, Heart, Baby, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmergencyContacts from '@/components/EmergencyContacts';
import SOSServices from '@/components/SOSServices';
import EmbassyDirectory from '@/components/EmbassyDirectory';
import SecurityDirectory from '@/components/SecurityServices/SecurityDirectory';
import CyberHelplineDashboard from '@/components/CyberHelpline/CyberHelplineDashboard';
import ThreatDashboard from '@/components/ThreatIntelligence/ThreatDashboard';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';

type ModuleType = 'contacts' | 'sos' | 'embassy' | 'sos-services' | 'protection' | 'cyber' | 'threats' | 'alerts' | null;

const SITUATION_PRESETS = [
  { id: 'business', label: 'Business Travel', icon: Briefcase, modules: ['threats', 'protection', 'embassy'] as ModuleType[], desc: 'Security briefing for your destination' },
  { id: 'family', label: 'Family Trip', icon: Baby, modules: ['contacts', 'embassy', 'sos-services'] as ModuleType[], desc: 'Medical & emergency contacts for families' },
  { id: 'solo', label: 'Solo Adventure', icon: Activity, modules: ['threats', 'cyber', 'contacts'] as ModuleType[], desc: 'Stay safe traveling alone' },
  { id: 'medical', label: 'Medical Emergency', icon: Heart, modules: ['sos', 'contacts'] as ModuleType[], desc: 'Immediate medical assistance' },
];

export const SuperNomadGuardian = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(null);
  const [search, setSearch] = useState('');
  const isUserInDanger = ThreatIntelligenceService.isUserInDangerZone();
  const criticalThreats = ThreatIntelligenceService.getCriticalThreats();
  const stats = ThreatIntelligenceService.getStatistics();

  const professionalModules = [
    { id: 'contacts' as ModuleType, title: 'Emergency Contacts', icon: Users, tag: 'SOS', tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', gradient: 'from-blue-500/10 via-transparent to-transparent', desc: '80+ countries' },
    { id: 'sos' as ModuleType, title: 'SOS Services', icon: Cross, tag: '24/7', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30', gradient: 'from-red-500/10 via-transparent to-transparent', desc: 'Global response center' },
    { id: 'embassy' as ModuleType, title: 'Embassy Directory', icon: Building2, tag: 'OFFICIAL', tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', gradient: 'from-blue-500/10 via-transparent to-transparent', desc: '50+ countries' },
    { id: 'protection' as ModuleType, title: 'Private Protection', icon: Shield, tag: 'ELITE', tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30', gradient: 'from-amber-500/10 via-transparent to-transparent', desc: '8 global providers' },
    { id: 'cyber' as ModuleType, title: 'Cyber Security', icon: Lock, tag: 'NEW', tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', gradient: 'from-emerald-500/10 via-transparent to-transparent', desc: 'AI-powered help' },
    { id: 'threats' as ModuleType, title: 'Threat Intelligence', icon: Radar, tag: 'LIVE', tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30', gradient: 'from-purple-500/10 via-transparent to-transparent', desc: `${stats.total} active` },
  ];

  const filteredModules = search
    ? professionalModules.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase()))
    : professionalModules;

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'contacts': return <EmergencyContacts />;
      case 'sos': case 'sos-services': return <SOSServices />;
      case 'embassy': return <EmbassyDirectory />;
      case 'protection': return <SecurityDirectory />;
      case 'cyber': return <CyberHelplineDashboard />;
      case 'threats': case 'alerts': return <ThreatDashboard />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-blue-400 animate-pulse" style={{ animationDuration: '3s' }} />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              SuperNomad Guardian
            </h1>
          </div>
          <p className="text-blue-200/80 text-lg font-light">Always On. Never Intrusive.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Active Threats', value: stats.total, color: 'text-red-400' },
            { label: 'Critical', value: stats.critical, color: 'text-orange-400' },
            { label: 'Near You', value: stats.activeNearby, color: 'text-yellow-400' },
            { label: 'Status', value: isUserInDanger ? 'ALERT' : 'CLEAR', color: isUserInDanger ? 'text-red-400' : 'text-emerald-400' },
          ].map(s => (
            <Card key={s.label} className="bg-slate-900/60 border-slate-700/30 backdrop-blur-xl">
              <div className="p-3 text-center">
                <p className="text-[10px] text-blue-300/60 uppercase tracking-wider">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Situation Presets */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-blue-300/80 uppercase tracking-wider">Quick Situation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SITUATION_PRESETS.map(preset => {
              const Icon = preset.icon;
              return (
                <Card key={preset.id} className="bg-slate-900/40 border-slate-700/30 backdrop-blur-xl hover:border-blue-500/40 transition-all cursor-pointer hover:scale-[1.02]" onClick={() => setActiveModule(preset.modules[0])}>
                  <div className="p-4 space-y-2">
                    <Icon className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{preset.label}</p>
                      <p className="text-xs text-blue-300/60">{preset.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Threat Bar */}
        {isUserInDanger && (
          <Card className="bg-amber-900/20 border-amber-500/40 backdrop-blur-xl">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <p className="text-amber-100 font-semibold">{criticalThreats.length} active threats nearby</p>
                  <p className="text-amber-200/60 text-xs">Tap to review recommended actions</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-amber-500/10 border-amber-500/30 text-amber-300" onClick={() => setActiveModule('threats')}>Review</Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-300/50" />
          <Input placeholder="Search safety services..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-slate-900/60 border-slate-700/30 text-slate-200 placeholder:text-blue-300/40" />
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredModules.map(module => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]" onClick={() => setActiveModule(module.id)}>
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 group-hover:border-slate-600/50 transition-colors">
                      <Icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <Badge variant="outline" className={`${module.tagColor} text-[10px] font-semibold px-1.5 py-0.5 border`}>{module.tag}</Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{module.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{module.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* All-clear bar */}
        {!isUserInDanger && (
          <Card className="bg-emerald-900/20 border-emerald-500/30 backdrop-blur-xl">
            <div className="p-4 flex items-center gap-3">
              <Radar className="w-5 h-5 text-emerald-400 animate-pulse" style={{ animationDuration: '3s' }} />
              <div>
                <p className="text-emerald-100 font-semibold">All Clear</p>
                <p className="text-emerald-200/60 text-xs">No critical threats in your monitored locations</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Module Dialog */}
      <Dialog open={activeModule !== null} onOpenChange={() => setActiveModule(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-100">
              {professionalModules.find(m => m.id === activeModule)?.title || (activeModule === 'sos-services' ? 'SOS Services' : activeModule === 'alerts' ? 'Travel Alerts' : '')}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">{renderModuleContent()}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
