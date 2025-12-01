import { useState } from 'react';
import { Shield, Users, Phone, Building2, Cross, Lock, Radar, Plane, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmergencyContacts from '@/components/EmergencyContacts';
import SOSServices from '@/components/SOSServices';
import EmbassyDirectory from '@/components/EmbassyDirectory';
import SecurityDirectory from '@/components/SecurityServices/SecurityDirectory';
import CyberHelplineDashboard from '@/components/CyberHelpline/CyberHelplineDashboard';
import ThreatDashboard from '@/components/ThreatIntelligence/ThreatDashboard';
import { ThreatIntelligenceService } from '@/services/ThreatIntelligenceService';

type ModuleType = 'contacts' | 'sos' | 'embassy' | 'sos-services' | 'protection' | 'cyber' | 'threats' | 'alerts' | null;

export const SuperNomadGuardian = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(null);
  const isUserInDanger = ThreatIntelligenceService.isUserInDangerZone();
  const criticalThreats = ThreatIntelligenceService.getCriticalThreats();

  const professionalModules = [
    {
      id: 'embassy' as ModuleType,
      title: 'Embassy Directory',
      icon: Building2,
      tag: 'OFFICIAL',
      tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    },
    {
      id: 'sos-services' as ModuleType,
      title: 'SOS Services',
      icon: Cross,
      tag: '24/7',
      tagColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      gradient: 'from-red-500/10 via-red-500/5 to-transparent',
    },
    {
      id: 'protection' as ModuleType,
      title: 'Private Protection',
      icon: Shield,
      tag: 'ELITE',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    },
    {
      id: 'cyber' as ModuleType,
      title: 'Cyber Security',
      icon: Lock,
      tag: 'NEW',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    },
    {
      id: 'threats' as ModuleType,
      title: 'Threat Intelligence',
      icon: Radar,
      tag: 'LIVE',
      tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    },
    {
      id: 'alerts' as ModuleType,
      title: 'Travel Alerts',
      icon: Plane,
      tag: 'ACTIVE',
      tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    },
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'contacts':
        return <EmergencyContacts />;
      case 'sos':
        return <SOSServices />;
      case 'embassy':
        return <EmbassyDirectory />;
      case 'sos-services':
        return <SOSServices />;
      case 'protection':
        return <SecurityDirectory />;
      case 'cyber':
        return <CyberHelplineDashboard />;
      case 'threats':
        return <ThreatDashboard />;
      case 'alerts':
        return <ThreatDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-blue-400 animate-pulse" style={{ animationDuration: '3s' }} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              SuperNomad Guardian
            </h1>
          </div>
          <p className="text-blue-200/80 text-lg font-light tracking-wide">
            Always On. Never Intrusive.
          </p>
        </div>

        {/* Your Lifelines */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Your Lifelines
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Contacts */}
            <Card 
              className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 cursor-pointer hover:scale-[1.02]"
              onClick={() => setActiveModule('contacts')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                    <Users className="w-6 h-6 text-blue-400 animate-pulse" style={{ animationDuration: '2s' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-100">Emergency Contacts</h3>
                    <p className="text-sm text-blue-300/60">Your trusted circle</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                    Quick Access
                  </Badge>
                </div>
              </div>
            </Card>

            {/* SOS Button */}
            <Card 
              className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-red-500/20 hover:border-red-400/40 transition-all duration-500 cursor-pointer hover:scale-[1.02]"
              onClick={() => setActiveModule('sos')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                    <Shield className="w-6 h-6 text-red-400 animate-pulse" style={{ animationDuration: '2s' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-100">HOLD FOR SOS</h3>
                    <p className="text-sm text-red-300/60">Immediate assistance</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-300">
                    Emergency
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Professional Network */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Professional Network
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionalModules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-slate-700/30 hover:border-slate-600/50 transition-all duration-500 cursor-pointer hover:scale-[1.02]"
                  onClick={() => setActiveModule(module.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 group-hover:border-slate-600/50 transition-colors">
                        <Icon className="w-6 h-6 text-slate-300 animate-pulse" style={{ animationDuration: '3s' }} />
                      </div>
                      <Badge variant="outline" className={`${module.tagColor} text-xs font-semibold px-2 py-1 border`}>
                        {module.tag}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{module.title}</h3>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Threat Intelligence Bar */}
        <Card className={`overflow-hidden backdrop-blur-xl transition-all duration-500 ${
          isUserInDanger 
            ? 'bg-amber-900/20 border-amber-500/40' 
            : 'bg-emerald-900/20 border-emerald-500/30'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isUserInDanger ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400 animate-pulse" />
                ) : (
                  <Radar className="w-6 h-6 text-emerald-400 animate-pulse" style={{ animationDuration: '3s' }} />
                )}
                <div>
                  <h3 className={`text-xl font-semibold ${isUserInDanger ? 'text-amber-100' : 'text-emerald-100'}`}>
                    {isUserInDanger ? 'Advisory Alert' : 'All Clear in Your Locations'}
                  </h3>
                  {isUserInDanger && criticalThreats.length > 0 && (
                    <p className="text-amber-200/80 text-sm mt-1">
                      {criticalThreats.length} active {criticalThreats.length === 1 ? 'threat' : 'threats'} detected nearby
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className={`${
                  isUserInDanger 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                }`}
                onClick={() => setActiveModule('threats')}
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Dialog */}
      <Dialog open={activeModule !== null} onOpenChange={() => setActiveModule(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-100">
              {activeModule === 'contacts' && 'Emergency Contacts'}
              {activeModule === 'sos' && 'SOS Services'}
              {activeModule === 'embassy' && 'Embassy Directory'}
              {activeModule === 'sos-services' && 'SOS Services'}
              {activeModule === 'protection' && 'Private Protection'}
              {activeModule === 'cyber' && 'Cyber Security'}
              {activeModule === 'threats' && 'Threat Intelligence'}
              {activeModule === 'alerts' && 'Travel Alerts'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {renderModuleContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
