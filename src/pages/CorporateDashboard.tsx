import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  CorporateService, Organization, OrgMember, BusinessTrip, OrgDashboardStats, TripStatus,
} from '@/services/CorporateService';
import {
  Building2, Users, Plane, DollarSign, Plus, Copy, Check, ArrowLeft, Briefcase,
  Mail, ShieldCheck, AlertCircle, TrendingUp, MapPin,
} from 'lucide-react';

const STATUS_VARIANTS: Record<TripStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  submitted: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  booked: 'default',
  completed: 'default',
  cancelled: 'destructive',
};

const CorporateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [orgs, setOrgs] = useState<Array<Organization & { my_role: string }>>([]);
  const [demoOrgs, setDemoOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [myRole, setMyRole] = useState<string>('employee');
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [trips, setTrips] = useState<BusinessTrip[]>([]);
  const [stats, setStats] = useState<OrgDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);

  const isAdmin = ['owner', 'admin'].includes(myRole);
  const isApprover = ['owner', 'admin', 'manager'].includes(myRole);

  useEffect(() => { void loadOrgs(); }, [user]);

  async function loadOrgs() {
    setLoading(true);
    try {
      // Always load demo orgs (for showcase + fallback)
      const demos = await CorporateService.listDemoOrgs();
      setDemoOrgs(demos);

      let mine: Array<Organization & { my_role: string }> = [];
      if (user) {
        mine = await CorporateService.listMyOrgs();
        setOrgs(mine);
      }

      if (!selectedOrg) {
        if (mine.length > 0) {
          await selectOrg(mine[0], mine[0].my_role);
        } else if (demos.length > 0) {
          // Logged-in users with no org, AND guests, both fall through to demo
          await selectOrg(demos[0], 'employee');
        }
      }
    } catch (e) {
      console.error('loadOrgs failed', e);
    } finally {
      setLoading(false);
    }
  }

  async function selectOrg(org: Organization, role: string) {
    setSelectedOrg(org);
    setMyRole(role);
    try {
      const [m, t, s] = await Promise.all([
        CorporateService.listMembers(org.id),
        CorporateService.listTrips(org.id),
        CorporateService.getStats(org.id).catch(() => null),
      ]);
      setMembers(m);
      setTrips(t);
      setStats(s);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleApprove(trip_id: string, approve: boolean) {
    try {
      await CorporateService.approveTrip({
        trip_id, approve,
        rejection_reason: approve ? undefined : 'Outside policy',
      });
      toast({ title: approve ? 'Trip approved' : 'Trip rejected' });
      if (selectedOrg) await selectOrg(selectedOrg, myRole);
    } catch (e) {
      toast({ title: 'Action failed', description: String(e), variant: 'destructive' });
    }
  }

  function copyJoinCode() {
    if (!selectedOrg) return;
    navigator.clipboard.writeText(selectedOrg.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast({ title: 'Join code copied' });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Empty state — no orgs and no demos
  if (!selectedOrg) {
    return (
      <div className="container max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app')}><ArrowLeft className="w-4 h-4" /></Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Corporate Travel
          </h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-semibold">Run business travel for your company</h2>
            <p className="text-sm text-muted-foreground">
              Create a company workspace, invite employees, set policy, and centralize bookings &amp; expenses —
              all while employees keep their personal SuperNomad profile private.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={loadOrgs} />
              <JoinOrgDialog open={joinOpen} onOpenChange={setJoinOpen} onJoined={loadOrgs} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app')}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {selectedOrg.name}
              {selectedOrg.demo && <Badge variant="secondary">Demo</Badge>}
            </h1>
            <p className="text-xs text-muted-foreground">
              You are {myRole === 'owner' ? 'the owner' : `a ${myRole}`} • {members.length} members
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {orgs.length + demoOrgs.length > 1 && (
            <Select
              value={selectedOrg.id}
              onValueChange={(v) => {
                const all: Array<Organization & { my_role?: string }> = [...orgs, ...demoOrgs.map(d => ({ ...d, my_role: 'employee' }))];
                const found = all.find(o => o.id === v);
                if (found) selectOrg(found, found.my_role || 'employee');
              }}
            >
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {orgs.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                {demoOrgs.filter(d => !orgs.find(o => o.id === d.id)).map(o => (
                  <SelectItem key={o.id} value={o.id}>{o.name} (Demo)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <CreateOrgDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={loadOrgs} />
          <JoinOrgDialog open={joinOpen} onOpenChange={setJoinOpen} onJoined={loadOrgs} />
        </div>
      </div>

      {/* Join code banner */}
      {isAdmin && (
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Company Join Code</p>
                <p className="text-xs text-muted-foreground">Share this with employees so they can link their account.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono font-bold tracking-wider bg-background px-3 py-1.5 rounded border">
                {selectedOrg.join_code}
              </code>
              <Button size="sm" variant="outline" onClick={copyJoinCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Users className="w-4 h-4" />} label="Members" value={stats.members_total} />
          <StatCard icon={<Plane className="w-4 h-4" />} label="Active trips" value={stats.trips_active} sub={`${stats.trips_pending} pending`} />
          <StatCard icon={<DollarSign className="w-4 h-4" />} label="30d spend" value={`$${Number(stats.spend_30d).toLocaleString()}`} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label="YTD spend" value={`$${Number(stats.spend_ytd).toLocaleString()}`} />
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="trips">
        <TabsList>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* TRIPS */}
        <TabsContent value="trips" className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">{trips.length} trips</h3>
            <NewTripDialog
              open={tripOpen}
              onOpenChange={setTripOpen}
              org={selectedOrg}
              userId={user?.id || ''}
              members={members}
              onCreated={() => selectOrg(selectedOrg, myRole)}
            />
          </div>
          {trips.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">
              No trips yet. {!selectedOrg.demo && 'Create one to get started.'}
            </CardContent></Card>
          ) : (
            <div className="space-y-2">
              {trips.map(t => (
                <Card key={t.id}>
                  <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{t.purpose}</span>
                        <Badge variant={STATUS_VARIANTS[t.status]} className="text-[10px]">{t.status}</Badge>
                        <code className="text-[10px] text-muted-foreground">{t.trip_code}</code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {t.destination_city || '—'}, {t.destination_country || '—'}
                        <span>•</span>
                        {t.start_date} → {t.end_date}
                        <span>•</span>
                        ${Number(t.actual_cost || t.estimated_cost).toLocaleString()} {t.currency}
                      </p>
                    </div>
                    {isApprover && t.status === 'submitted' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" onClick={() => handleApprove(t.id, true)}>Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => handleApprove(t.id, false)}>Reject</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* MEMBERS */}
        <TabsContent value="members" className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">{members.length} members</h3>
            {isAdmin && (
              <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} orgId={selectedOrg.id} />
            )}
          </div>
          <div className="space-y-2">
            {members.map(m => (
              <Card key={m.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {m.job_title || m.department || 'Employee'}
                      {m.user_id === user?.id && <span className="text-xs text-muted-foreground ml-2">(you)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(m.joined_at).toLocaleDateString()}
                      {m.employee_id && ` • ID ${m.employee_id}`}
                    </p>
                  </div>
                  <Badge variant={m.role === 'owner' ? 'default' : 'outline'}>{m.role}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* REPORTS */}
        <TabsContent value="reports">
          {stats ? (
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Top destinations</CardTitle></CardHeader>
                <CardContent>
                  {stats.top_destinations.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.top_destinations.map(d => (
                        <div key={d.country} className="flex justify-between text-sm">
                          <span>{d.country}</span>
                          <span className="text-muted-foreground">
                            {d.trips} trips • ${Number(d.spend).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm">Spend by category (90d)</CardTitle></CardHeader>
                <CardContent>
                  {Object.keys(stats.spend_by_category).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(stats.spend_by_category).map(([cat, amt]) => (
                        <div key={cat} className="flex justify-between text-sm">
                          <span className="capitalize">{cat.replace(/_/g, ' ')}</span>
                          <span className="text-muted-foreground">${Number(amt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Stats unavailable.</p>
          )}
        </TabsContent>

        {/* BILLING */}
        <TabsContent value="billing">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing email</span>
                <span>{selectedOrg.billing_email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="capitalize">{selectedOrg.billing_method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currency</span>
                <span>{selectedOrg.billing_currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Country</span>
                <span>{selectedOrg.country_code || '—'}</span>
              </div>
              <div className="pt-3 mt-3 border-t flex items-start gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Invoicing routes through SuperNomad's orchestration layer. We aggregate booking partners
                  (Navan, TravelPerk, Duffel, HotelBeds) and consolidate to one monthly invoice or push to
                  your corporate card. No IATA accreditation required on your side.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string }> = ({ icon, label, value, sub }) => (
  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon} {label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </CardContent>
  </Card>
);

// ─────────────────────────────────────────────────────
// CREATE ORG DIALOG
const CreateOrgDialog: React.FC<{ open: boolean; onOpenChange: (b: boolean) => void; onCreated: () => void }> = ({ open, onOpenChange, onCreated }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', billing_email: '', billing_method: 'invoice', country_code: '', size_band: '11-50', industry: '' });
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!user) { toast({ title: 'Sign in required', variant: 'destructive' }); return; }
    setBusy(true);
    try {
      await CorporateService.createOrg(form);
      toast({ title: 'Company created', description: 'You are the owner.' });
      onOpenChange(false);
      onCreated();
    } catch (e) {
      toast({ title: 'Failed', description: String(e), variant: 'destructive' });
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Create company</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create a company workspace</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Company name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Acme Global Inc." /></div>
          <div><Label>Billing email *</Label><Input type="email" value={form.billing_email} onChange={e => setForm({ ...form, billing_email: e.target.value })} placeholder="finance@acme.com" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Billing method</Label>
              <Select value={form.billing_method} onValueChange={v => setForm({ ...form, billing_method: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Monthly invoice</SelectItem>
                  <SelectItem value="credit_card">Corporate card</SelectItem>
                  <SelectItem value="wire">Wire transfer</SelectItem>
                  <SelectItem value="direct_debit">Direct debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Country (ISO)</Label><Input maxLength={2} value={form.country_code} onChange={e => setForm({ ...form, country_code: e.target.value.toUpperCase() })} placeholder="US" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Size</Label>
              <Select value={form.size_band} onValueChange={v => setForm({ ...form, size_band: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1–10</SelectItem>
                  <SelectItem value="11-50">11–50</SelectItem>
                  <SelectItem value="51-200">51–200</SelectItem>
                  <SelectItem value="201-1000">201–1000</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Industry</Label><Input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} placeholder="Tech" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !form.name || !form.billing_email}>
            {busy ? 'Creating…' : 'Create company'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────
// JOIN ORG DIALOG
const JoinOrgDialog: React.FC<{ open: boolean; onOpenChange: (b: boolean) => void; onJoined: () => void }> = ({ open, onOpenChange, onJoined }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({ join_code: '', department: '', employee_id: '', job_title: '' });
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!user) { toast({ title: 'Sign in required', variant: 'destructive' }); return; }
    setBusy(true);
    try {
      const res = await CorporateService.joinByCode(form);
      toast({
        title: res.already_member ? 'Already a member' : `Joined ${res.organization.name}`,
      });
      onOpenChange(false);
      onJoined();
    } catch (e) {
      toast({ title: 'Failed to join', description: String(e), variant: 'destructive' });
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1"><Briefcase className="w-4 h-4" /> Join with code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Join your company</DialogTitle></DialogHeader>
        <p className="text-xs text-muted-foreground">Enter the 8-character code from your company admin.</p>
        <div className="space-y-3">
          <div><Label>Join code *</Label><Input value={form.join_code} onChange={e => setForm({ ...form, join_code: e.target.value.toUpperCase() })} maxLength={8} className="font-mono uppercase tracking-widest" /></div>
          <div><Label>Department</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Engineering" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Employee ID</Label><Input value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })} /></div>
            <div><Label>Job title</Label><Input value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || form.join_code.length < 4}>{busy ? 'Joining…' : 'Join company'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────
// INVITE DIALOG
const InviteDialog: React.FC<{ open: boolean; onOpenChange: (b: boolean) => void; orgId: string }> = ({ open, onOpenChange, orgId }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', role: 'employee' as const, department: '' });
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await CorporateService.invite({ organization_id: orgId, email: form.email, role: form.role, department: form.department });
      toast({ title: 'Invite created', description: 'Share the join code or send the invite link.' });
      setForm({ email: '', role: 'employee', department: '' });
      onOpenChange(false);
    } catch (e) {
      toast({ title: 'Failed', description: String(e), variant: 'destructive' });
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1"><Mail className="w-4 h-4" /> Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Invite a colleague</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v as typeof form.role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager (can approve)</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Department</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !form.email}>{busy ? 'Sending…' : 'Send invite'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────
// NEW TRIP DIALOG
const NewTripDialog: React.FC<{
  open: boolean; onOpenChange: (b: boolean) => void;
  org: Organization; userId: string; members: OrgMember[]; onCreated: () => void;
}> = ({ open, onOpenChange, org, userId, members, onCreated }) => {
  const { toast } = useToast();
  const myMember = members.find(m => m.user_id === userId);
  const [form, setForm] = useState({
    purpose: '', destination_city: '', destination_country: '',
    start_date: '', end_date: '', estimated_cost: 0, notes: '',
  });
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!myMember) { toast({ title: 'You are not a member of this org', variant: 'destructive' }); return; }
    setBusy(true);
    try {
      const trip = await CorporateService.createTrip({
        organization_id: org.id,
        member_id: myMember.id,
        purpose: form.purpose,
        destination_city: form.destination_city,
        destination_country: form.destination_country,
        start_date: form.start_date,
        end_date: form.end_date,
        estimated_cost: Number(form.estimated_cost),
        currency: org.billing_currency,
        notes: form.notes,
      });
      await CorporateService.submitTrip(trip.id);
      toast({ title: 'Trip submitted for approval' });
      setForm({ purpose: '', destination_city: '', destination_country: '', start_date: '', end_date: '', estimated_cost: 0, notes: '' });
      onOpenChange(false);
      onCreated();
    } catch (e) {
      toast({ title: 'Failed', description: String(e), variant: 'destructive' });
    } finally { setBusy(false); }
  }

  if (!myMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> New trip</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Request a business trip</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Purpose *</Label><Input value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="Client meeting in Berlin" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>City</Label><Input value={form.destination_city} onChange={e => setForm({ ...form, destination_city: e.target.value })} /></div>
            <div><Label>Country (ISO)</Label><Input maxLength={2} value={form.destination_country} onChange={e => setForm({ ...form, destination_country: e.target.value.toUpperCase() })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Start *</Label><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
            <div><Label>End *</Label><Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></div>
          </div>
          <div><Label>Estimated cost ({org.billing_currency})</Label><Input type="number" value={form.estimated_cost} onChange={e => setForm({ ...form, estimated_cost: Number(e.target.value) })} /></div>
          <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !form.purpose || !form.start_date || !form.end_date}>
            {busy ? 'Submitting…' : 'Submit for approval'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CorporateDashboard;
