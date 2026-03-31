import { useState, useEffect, useRef } from 'react';
import { Shield, Radio, MapPin, Heart, Eye, Lock, Wifi, AlertTriangle, Phone, Video, Mic, Clock, Upload, CheckCircle2, Fingerprint, Zap, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

type GuardianState = 'standby' | 'activating' | 'recording' | 'dispatching';

interface EvidencePacket {
  id: string;
  type: 'video' | 'audio' | 'gps' | 'biometric' | 'photo';
  timestamp: Date;
  size: string;
  status: 'encrypting' | 'streaming' | 'locked';
  hash: string;
}

interface TrustedPeer {
  name: string;
  relation: string;
  notified: boolean;
  watching: boolean;
}

const generateHash = () => {
  const chars = 'abcdef0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const DEMO_PEERS: TrustedPeer[] = [
  { name: 'Sarah M.', relation: 'Emergency Contact', notified: false, watching: false },
  { name: 'David K.', relation: 'Travel Partner', notified: false, watching: false },
];

export const BlackBoxGuardian = () => {
  const { toast } = useToast();
  const [state, setState] = useState<GuardianState>('standby');
  const [packets, setPackets] = useState<EvidencePacket[]>([]);
  const [peers, setPeers] = useState<TrustedPeer[]>(DEMO_PEERS);
  const [activationProgress, setActivationProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const packetRef = useRef<NodeJS.Timeout | null>(null);

  // Activation sequence
  const handleActivate = () => {
    if (state !== 'standby') return;
    setState('activating');
    setActivationProgress(0);

    toast({
      title: '🛡️ Guardian Activating...',
      description: 'Silent Sentinel mode engaged. Demo-safe.',
    });

    let progress = 0;
    const activationInterval = setInterval(() => {
      progress += 5;
      setActivationProgress(progress);
      if (progress >= 100) {
        clearInterval(activationInterval);
        setState('recording');
        setElapsedSeconds(0);

        // Notify peers
        setPeers(prev => prev.map((p, i) => ({
          ...p,
          notified: true,
          watching: i === 0,
        })));

        toast({
          title: '⚫ Black Box Active',
          description: 'Evidence stream encrypted & cloud-locked. WORM mode engaged.',
        });
      }
    }, 80);
  };

  // Recording timer
  useEffect(() => {
    if (state === 'recording') {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  // Evidence packet stream
  useEffect(() => {
    if (state === 'recording') {
      const types: EvidencePacket['type'][] = ['video', 'audio', 'gps', 'biometric', 'photo'];
      const sizes = ['2.4 KB', '18.7 KB', '0.3 KB', '1.1 KB', '156 KB'];

      packetRef.current = setInterval(() => {
        const typeIndex = Math.floor(Math.random() * types.length);
        const newPacket: EvidencePacket = {
          id: crypto.randomUUID?.() || `pkt_${Date.now()}`,
          type: types[typeIndex],
          timestamp: new Date(),
          size: sizes[typeIndex],
          status: 'encrypting',
          hash: generateHash(),
        };

        setPackets(prev => {
          const updated = [newPacket, ...prev].slice(0, 50);
          // Transition older packets
          return updated.map((p, i) => ({
            ...p,
            status: i === 0 ? 'encrypting' : i < 3 ? 'streaming' : 'locked',
          }));
        });
      }, 1800);
    }
    return () => {
      if (packetRef.current) clearInterval(packetRef.current);
    };
  }, [state]);

  const handleDeactivate = () => {
    setState('standby');
    setPackets([]);
    setPeers(DEMO_PEERS);
    setElapsedSeconds(0);
    setActivationProgress(0);
    setShowDeactivateDialog(false);
    toast({
      title: 'Guardian Deactivated',
      description: `${packets.length} evidence packets secured in cloud vault.`,
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getPacketIcon = (type: EvidencePacket['type']) => {
    switch (type) {
      case 'video': return <Video className="h-3 w-3" />;
      case 'audio': return <Mic className="h-3 w-3" />;
      case 'gps': return <MapPin className="h-3 w-3" />;
      case 'biometric': return <Fingerprint className="h-3 w-3" />;
      case 'photo': return <Eye className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: EvidencePacket['status']) => {
    switch (status) {
      case 'encrypting': return 'text-orange-400 bg-orange-500/20';
      case 'streaming': return 'text-blue-400 bg-blue-500/20';
      case 'locked': return 'text-emerald-400 bg-emerald-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Demo Banner */}
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className="border-orange-500/50 text-orange-600 dark:text-orange-400 text-[10px]">DEMO MODE</Badge>
            <span className="text-muted-foreground">
              Silent Sentinel — No real alerts, sirens, or emergency calls will be triggered.
            </span>
            <Button variant="ghost" size="sm" className="ml-auto h-6 text-[10px] text-orange-600 dark:text-orange-400 hover:text-orange-700" onClick={() => setShowInfoDialog(true)}>
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Guardian Card */}
      <Card className={`relative overflow-hidden transition-all duration-700 ${
        state === 'recording' 
          ? 'border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.15)]' 
          : state === 'activating' 
            ? 'border-blue-500/40' 
            : 'border-border'
      }`}>
        {/* Pulse overlay when recording */}
        {state === 'recording' && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 animate-pulse" style={{ animationDuration: '3s' }} />
        )}

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl transition-all duration-500 ${
                state === 'recording'
                  ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 ring-2 ring-orange-500/30'
                  : 'bg-muted'
              }`}>
                <Shield className={`h-7 w-7 ${
                  state === 'recording' ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'
                }`} style={state === 'recording' ? { animationDuration: '2s' } : {}} />
              </div>
              <div>
                <CardTitle className="text-xl">Black Box Guardian</CardTitle>
                <CardDescription>The Un-Erasable Digital Witness</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {state === 'recording' && (
                <Badge className="bg-red-500/20 text-red-500 border-red-500/30 animate-pulse">
                  <Radio className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              )}
              <Badge variant="outline" className={`text-[10px] ${
                state === 'standby' ? 'border-muted-foreground/30 text-muted-foreground' :
                state === 'recording' ? 'border-orange-500/50 text-orange-500' :
                'border-blue-500/50 text-blue-500'
              }`}>
                {state === 'standby' ? 'STANDBY' : state === 'activating' ? 'ARMING' : 'WORM ACTIVE'}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Standby View */}
          {state === 'standby' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once triggered, this system transforms your device into a <strong>flight recorder for personal safety</strong>.
                Video, audio, GPS altitude, and biometrics are encrypted at source and streamed to a 
                <strong> Zero-Knowledge WORM Vault</strong> — evidence that cannot be deleted, modified, or hidden.
              </p>

              {/* Capability Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Video, label: 'Dual-Lens Buffer', desc: 'Front + back cameras' },
                  { icon: Lock, label: 'WORM Vault', desc: '48hr delete-lock' },
                  { icon: MapPin, label: '3D GPS Lock', desc: 'Floor-level accuracy' },
                  { icon: Users, label: 'Trusted Peers', desc: 'Live watch link' },
                ].map(cap => (
                  <Card key={cap.label} className="bg-muted/30 border-border/50">
                    <CardContent className="p-3 text-center space-y-1">
                      <cap.icon className="h-5 w-5 mx-auto text-muted-foreground" />
                      <p className="text-xs font-semibold">{cap.label}</p>
                      <p className="text-[10px] text-muted-foreground">{cap.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Activation Button */}
              <Button
                onClick={handleActivate}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:scale-[1.01]"
              >
                <Shield className="h-5 w-5 mr-2" />
                Activate Guardian Protocol
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Voice command: <span className="font-mono bg-muted px-1.5 py-0.5 rounded">"SuperNomad, Watch my back"</span>
              </p>
            </div>
          )}

          {/* Activating View */}
          {state === 'activating' && (
            <div className="space-y-4 py-4">
              <div className="text-center space-y-2">
                <Zap className="h-10 w-10 mx-auto text-blue-400 animate-pulse" />
                <p className="text-sm font-semibold">Arming Guardian Protocol...</p>
                <p className="text-xs text-muted-foreground">Establishing encrypted tunnel • Locking WORM vault</p>
              </div>
              <Progress value={activationProgress} className="h-2" />
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className={activationProgress > 30 ? 'text-emerald-500' : 'text-muted-foreground'}>
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1" />
                  Encryption Ready
                </div>
                <div className={activationProgress > 60 ? 'text-emerald-500' : 'text-muted-foreground'}>
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1" />
                  Cloud Tunnel Open
                </div>
                <div className={activationProgress > 90 ? 'text-emerald-500' : 'text-muted-foreground'}>
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1" />
                  WORM Vault Locked
                </div>
              </div>
            </div>
          )}

          {/* Recording View */}
          {state === 'recording' && (
            <div className="space-y-4">
              {/* Status Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-red-500">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-semibold font-mono">{formatTime(elapsedSeconds)}</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-1 text-emerald-500 text-xs">
                    <Wifi className="h-3 w-3" />
                    <span>Streaming</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Upload className="h-3 w-3" />
                  <span>{packets.length} packets</span>
                </div>
              </div>

              {/* Security Packet */}
              <Card className="bg-muted/20 border-border/50">
                <CardContent className="p-3 space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Security Packet — Live</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-blue-400" />
                      <div>
                        <p className="font-medium">40.7128°N, 74.0060°W</p>
                        <p className="text-[10px] text-muted-foreground">Floor 12 • Alt: 48m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-3.5 w-3.5 text-red-400" />
                      <div>
                        <p className="font-medium">Medical ID Ready</p>
                        <p className="text-[10px] text-muted-foreground">Blood: O+ • No allergies</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence Stream */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Live Evidence Stream</p>
                <ScrollArea className="h-44 rounded-lg border border-border/50 bg-background/50">
                  <div className="p-2 space-y-1">
                    {packets.map(packet => (
                      <div key={packet.id} className={`flex items-center justify-between p-2 rounded-lg text-[11px] transition-all ${
                        packet.status === 'encrypting' ? 'bg-orange-500/5' : 
                        packet.status === 'streaming' ? 'bg-blue-500/5' : 'bg-muted/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${getStatusColor(packet.status)}`}>
                            {getPacketIcon(packet.type)}
                          </div>
                          <div>
                            <span className="font-medium capitalize">{packet.type}</span>
                            <span className="text-muted-foreground ml-1.5">{packet.size}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-muted-foreground">#{packet.hash}</span>
                          <Badge variant="outline" className={`text-[9px] px-1 py-0 ${getStatusColor(packet.status)} border-current/20`}>
                            {packet.status === 'locked' && <Lock className="h-2 w-2 mr-0.5" />}
                            {packet.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {packets.length === 0 && (
                      <p className="text-center text-xs text-muted-foreground py-8">Initializing evidence stream...</p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Trusted Peers */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Trusted Peers</p>
                <div className="grid grid-cols-2 gap-2">
                  {peers.map(peer => (
                    <Card key={peer.name} className={`border-border/50 ${peer.watching ? 'ring-1 ring-emerald-500/30' : ''}`}>
                      <CardContent className="p-3 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          peer.notified ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground'
                        }`}>
                          {peer.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{peer.name}</p>
                          <p className="text-[10px] text-muted-foreground">{peer.relation}</p>
                        </div>
                        {peer.watching ? (
                          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-[9px]">
                            <Eye className="h-2.5 w-2.5 mr-0.5" /> Watching
                          </Badge>
                        ) : peer.notified ? (
                          <Badge variant="outline" className="text-[9px] text-amber-500 border-amber-500/30">Notified</Badge>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Deactivate */}
              <Button
                variant="outline"
                onClick={() => setShowDeactivateDialog(true)}
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Deactivate Guardian
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Bridge Info Card */}
      {state === 'standby' && (
        <Card className="border-border/50">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Professional Response Bridge</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: Phone, title: 'G4S Monitoring', desc: 'Live dispatcher sees your video feed & GPS in real-time', tag: 'ENTERPRISE' },
                { icon: AlertTriangle, title: 'Tiered Dispatch', desc: 'Security token escalation: Peer → Private Security → Law Enforcement', tag: 'PROTOCOL' },
                { icon: Clock, title: '48hr WORM Lock', desc: 'Evidence is immutable for 48 hours. Cannot be deleted by anyone.', tag: 'FORENSIC' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                  <item.icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold">{item.title}</p>
                      <Badge variant="outline" className="text-[8px] px-1 py-0">{item.tag}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Deactivate Guardian?</DialogTitle>
            <DialogDescription>
              All {packets.length} evidence packets are securely locked in the WORM vault. 
              They remain accessible for 48 hours regardless of deactivation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeactivateDialog(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDeactivate}>Confirm Deactivate</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              About Black Box Guardian
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              The <strong className="text-foreground">Black Box Guardian</strong> transforms your smartphone into a personal 
              flight recorder. In dangerous situations — kidnapping, robbery, assault, or any threat — the system 
              immediately begins streaming encrypted evidence to a tamper-proof cloud vault.
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">How it works:</p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">1.</span> Activation via voice command or button press — silent, no alarms</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">2.</span> Dual camera + audio encrypted at source, streamed to WORM vault</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">3.</span> If phone is destroyed 5 seconds later, evidence is already in the cloud</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">4.</span> Trusted peers receive live GPS + watch link instantly</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">5.</span> Professional security bridge (G4S) can dispatch responders</li>
              </ul>
            </div>
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs">
              <p className="font-semibold text-amber-600 dark:text-amber-400">⚠️ This is a demo</p>
              <p className="mt-1">No real recordings, alerts, or emergency calls are made. This demonstrates the system architecture and user experience.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlackBoxGuardian;
