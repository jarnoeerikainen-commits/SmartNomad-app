import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, 
  Search, X, Send, User, Headphones, Copy, Check, Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupportTicket } from '@/types/userProfile';
import { SnomadIdService } from '@/services/SnomadIdService';

// Returns the user's pseudonymous SuperNomad ID for support correspondence.
// Falls back to a guest-issued ID for unauthenticated users.
function useSnomadId(): string {
  const [id, setId] = React.useState<string>(() =>
    SnomadIdService.getCached() ?? SnomadIdService.getOrCreateGuest()
  );
  React.useEffect(() => {
    SnomadIdService.getEffective().then(setId);
  }, []);
  return id;
}

function getTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem('supernomad_support_tickets');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTickets(tickets: SupportTicket[]) {
  localStorage.setItem('supernomad_support_tickets', JSON.stringify(tickets));
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'open': { label: 'Open', color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: <AlertCircle className="w-3 h-3" /> },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', icon: <Clock className="w-3 h-3" /> },
  'waiting-response': { label: 'Waiting', color: 'bg-orange-500/10 text-orange-600 border-orange-200', icon: <MessageSquare className="w-3 h-3" /> },
  'resolved': { label: 'Resolved', color: 'bg-green-500/10 text-green-600 border-green-200', icon: <CheckCircle2 className="w-3 h-3" /> },
  'closed': { label: 'Closed', color: 'bg-muted text-muted-foreground border-border', icon: <CheckCircle2 className="w-3 h-3" /> },
};

const CATEGORIES = [
  { value: 'billing', label: '💳 Billing & Payments' },
  { value: 'booking', label: '✈️ Booking Issues' },
  { value: 'technical', label: '🔧 Technical Support' },
  { value: 'account', label: '👤 Account & Profile' },
  { value: 'compliance', label: '📋 Tax & Compliance' },
  { value: 'other', label: '💬 General Inquiry' },
];

const SupportTicketing: React.FC = () => {
  const { toast } = useToast();
  const userId = useSnomadId();
  const [tickets, setTickets] = useState<SupportTicket[]>(getTickets());
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newReply, setNewReply] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'other' as SupportTicket['category'],
    priority: 'medium' as SupportTicket['priority'],
  });

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => {
        if (filterStatus && t.status !== filterStatus) return false;
        if (search) {
          const q = search.toLowerCase();
          return t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.category.includes(q);
        }
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tickets, search, filterStatus]);

  const createTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast({ title: 'Missing info', description: 'Please fill in subject and description', variant: 'destructive' });
      return;
    }
    const ticket: SupportTicket = {
      id: 'TKT-' + Date.now().toString(36).toUpperCase(),
      userId,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      messages: [
        { id: 'm1', sender: 'user', content: newTicket.description, timestamp: new Date().toISOString() },
        { id: 'm2', sender: 'support', content: `Thank you for contacting SuperNomad Support! Your ticket ${`TKT-` + Date.now().toString(36).toUpperCase()} has been received. A team member will review your request shortly. Your User ID: ${userId}`, timestamp: new Date(Date.now() + 1000).toISOString() },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ subject: '', description: '', category: 'other', priority: 'medium' });
    setShowCreate(false);
    toast({ title: '✅ Ticket Created', description: `Ticket ${ticket.id} has been submitted.` });
  };

  const sendReply = () => {
    if (!newReply.trim() || !selectedTicket) return;
    const msg = { id: 'm' + Date.now(), sender: 'user' as const, content: newReply, timestamp: new Date().toISOString() };
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? {
      ...t,
      messages: [...t.messages, msg],
      status: 'open' as const,
      updatedAt: new Date().toISOString(),
    } : t));
    setSelectedTicket(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
    setNewReply('');

    // Simulate auto-reply
    setTimeout(() => {
      const autoReply = { id: 'm' + Date.now(), sender: 'support' as const, content: 'Thank you for your message. Our team is reviewing your update and will respond within 24 hours.', timestamp: new Date().toISOString() };
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? {
        ...t,
        messages: [...t.messages, autoReply],
        status: 'in-progress' as const,
        updatedAt: new Date().toISOString(),
      } : t));
      setSelectedTicket(prev => prev ? { ...prev, messages: [...prev.messages, autoReply], status: 'in-progress' } : prev);
    }, 2000);
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    toast({ title: 'Copied!', description: `User ID ${userId} copied to clipboard` });
    setTimeout(() => setCopiedId(false), 2000);
  };

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    total: tickets.length,
  };

  return (
    <div className="space-y-6">
      {/* Header with User ID */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Support Center</h2>
          <p className="text-muted-foreground">Manage your support tickets and get help</p>
        </div>
        <div className="flex items-center gap-2">
          <Card className="px-3 py-2 flex items-center gap-2 cursor-pointer hover:shadow-md transition-all" onClick={copyUserId}>
            <Hash className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Your User ID</p>
              <p className="text-sm font-mono font-bold">{userId}</p>
            </div>
            {copiedId ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Tickets', value: stats.total, color: 'bg-muted' },
          { label: 'Open', value: stats.open, color: 'bg-blue-500/10' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-yellow-500/10' },
          { label: 'Resolved', value: stats.resolved, color: 'bg-green-500/10' },
        ].map(s => (
          <Card key={s.label} className={`${s.color}`}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Ticket + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-10" />
          {search && <Button variant="ghost" size="sm" className="absolute right-1 top-1" onClick={() => setSearch('')}><X className="h-4 w-4" /></Button>}
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={filterStatus === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilterStatus(null)}>
          All ({tickets.length})
        </Badge>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = tickets.filter(t => t.status === key).length;
          return (
            <Badge key={key} variant={filterStatus === key ? 'default' : 'outline'} className="cursor-pointer gap-1" onClick={() => setFilterStatus(filterStatus === key ? null : key)}>
              {cfg.icon}{cfg.label} ({count})
            </Badge>
          );
        })}
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => {
          const statusCfg = STATUS_CONFIG[ticket.status];
          const catLabel = CATEGORIES.find(c => c.value === ticket.category)?.label || ticket.category;
          return (
            <Card key={ticket.id} className="hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                      <Badge variant="outline" className={`text-xs ${statusCfg.color}`}>
                        {statusCfg.icon}
                        <span className="ml-1">{statusCfg.label}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">{catLabel}</Badge>
                    </div>
                    <h4 className="font-semibold truncate">{ticket.subject}</h4>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{ticket.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{ticket.messages.length} messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredTickets.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No tickets found</p>
              <Button className="mt-4" onClick={() => setShowCreate(true)}>Create Your First Ticket</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input placeholder="Brief description of your issue" value={newTicket.subject} onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newTicket.category} onValueChange={v => setNewTicket(p => ({ ...p, category: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newTicket.priority} onValueChange={v => setNewTicket(p => ({ ...p, priority: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea placeholder="Describe your issue in detail..." value={newTicket.description} onChange={e => setNewTicket(p => ({ ...p, description: e.target.value }))} rows={5} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={createTicket} className="gap-2"><Send className="w-4 h-4" /> Submit Ticket</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{selectedTicket.id}</span>
                  <Badge variant="outline" className={`text-xs ${STATUS_CONFIG[selectedTicket.status]?.color}`}>
                    {STATUS_CONFIG[selectedTicket.status]?.label}
                  </Badge>
                </div>
                <DialogTitle className="mt-1">{selectedTicket.subject}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-3 py-3 min-h-0">
                {selectedTicket.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
                        <span className="text-xs font-medium">{msg.sender === 'user' ? 'You' : 'SuperNomad Support'}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-[10px] opacity-60 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                <div className="flex gap-2 pt-3 border-t">
                  <Input placeholder="Type your reply..." value={newReply} onChange={e => setNewReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()} />
                  <Button onClick={sendReply} disabled={!newReply.trim()}><Send className="w-4 h-4" /></Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTicketing;
