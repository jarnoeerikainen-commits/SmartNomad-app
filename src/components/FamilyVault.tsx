import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import {
  Users, Plus, Trash2, BookOpen, Plane, Syringe, Heart, AlertTriangle,
  Baby, Accessibility, UserPlus, Calendar, Shield,
} from 'lucide-react';
import {
  familyVault,
  buildAlerts,
  type ExpiryAlert,
} from '@/services/FamilyVaultService';
import {
  RELATIONSHIP_LABELS,
  CARE_LEVEL_LABELS,
  type FamilyMember,
  type RelationshipType,
  type CareLevel,
} from '@/types/familyMember';

const emptyMember = (): Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'> => ({
  fullName: '',
  preferredName: '',
  relationship: 'child',
  dateOfBirth: '',
  careLevel: 'independent',
  nationality: '',
  passports: [],
  visas: [],
  vaccinations: [],
  medicalNotes: [],
});

const FamilyVault: React.FC = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState(emptyMember());
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const list = await familyVault.list();
    setMembers(list);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const alerts = buildAlerts(members);

  const openNew = () => {
    setDraft(emptyMember());
    setEditingId(null);
    setEditorOpen(true);
  };

  const openEdit = (m: FamilyMember) => {
    setDraft({
      fullName: m.fullName,
      preferredName: m.preferredName ?? '',
      relationship: m.relationship,
      dateOfBirth: m.dateOfBirth ?? '',
      careLevel: m.careLevel,
      nationality: m.nationality ?? '',
      passports: m.passports,
      visas: m.visas,
      vaccinations: m.vaccinations,
      medicalNotes: m.medicalNotes,
      dietaryNeeds: m.dietaryNeeds,
      mobilityNeeds: m.mobilityNeeds,
      emergencyContactName: m.emergencyContactName,
      emergencyContactPhone: m.emergencyContactPhone,
    });
    setEditingId(m.id);
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!draft.fullName.trim()) {
      toast({ title: 'Name required', description: 'Please enter the family member\'s name.', variant: 'destructive' });
      return;
    }
    await familyVault.upsert(editingId ? { ...draft, id: editingId } : draft);
    toast({ title: editingId ? 'Member updated' : 'Member added', description: `${draft.fullName} saved to your family vault.` });
    setEditorOpen(false);
    reload();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from your family vault? Their documents will be deleted.`)) return;
    await familyVault.remove(id);
    toast({ title: 'Member removed' });
    reload();
  };

  const addPassport = async (memberId: string) => {
    const country = prompt('Passport country (e.g. United Kingdom)')?.trim();
    if (!country) return;
    const passportNumber = prompt('Passport number')?.trim() ?? '';
    const expiryDate = prompt('Expiry date (YYYY-MM-DD)')?.trim();
    if (!expiryDate) return;
    await familyVault.addPassport(memberId, {
      id: familyVault.newId(), country, passportNumber, expiryDate, showNumber: false,
    });
    reload();
  };

  const addVisa = async (memberId: string) => {
    const country = prompt('Visa country')?.trim();
    if (!country) return;
    const visaType = prompt('Visa type (tourist, student, dependent, work…)')?.trim() ?? 'tourist';
    const expiryDate = prompt('Expiry date (YYYY-MM-DD)')?.trim();
    if (!expiryDate) return;
    await familyVault.addVisa(memberId, {
      id: familyVault.newId(), country, visaType, expiryDate,
    });
    reload();
  };

  const addVaccination = async (memberId: string) => {
    const name = prompt('Vaccination name (e.g. Yellow Fever, MMR, Hepatitis A)')?.trim();
    if (!name) return;
    const dateReceived = prompt('Date received (YYYY-MM-DD)')?.trim() ?? '';
    const expiryDate = prompt('Expiry date (YYYY-MM-DD) — leave blank for lifetime')?.trim() || undefined;
    const certificateNumber = prompt('Certificate / ICVP number (optional)')?.trim() || undefined;
    await familyVault.addVaccination(memberId, {
      id: familyVault.newId(), name, dateReceived, expiryDate, certificateNumber,
    });
    reload();
  };

  const removeDoc = async (memberId: string, type: 'passports' | 'visas' | 'vaccinations', docId: string) => {
    if (type === 'passports') await familyVault.removePassport(memberId, docId);
    if (type === 'visas') await familyVault.removeVisa(memberId, docId);
    if (type === 'vaccinations') await familyVault.removeVaccination(memberId, docId);
    reload();
  };

  const relationshipIcon = (r: RelationshipType) => {
    if (r === 'infant' || r === 'child') return <Baby className="h-4 w-4" />;
    if (r === 'caregiver_dependent' || r === 'ward') return <Accessibility className="h-4 w-4" />;
    if (r === 'parent' || r === 'grandparent') return <Heart className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Family & Dependents Vault</CardTitle>
                <CardDescription>
                  Manage passports, visas and vaccinations for everyone in your care — spouses, children, elderly parents, wards.
                </CardDescription>
              </div>
            </div>
            <Button onClick={openNew} size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add member
            </Button>
          </div>
        </CardHeader>

        {alerts.length > 0 && (
          <CardContent className="pt-0">
            <FamilyExpiryAlerts alerts={alerts} />
          </CardContent>
        )}
      </Card>

      {loading ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading family vault…</CardContent></Card>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <Users className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold">No family members yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your spouse, children, elderly parents or anyone whose travel documents you manage.
            </p>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add first member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {members.map((m) => (
            <AccordionItem key={m.id} value={m.id} className="border rounded-lg bg-card">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3 flex-1 text-left">
                  <span className="p-2 bg-muted rounded-full">{relationshipIcon(m.relationship)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{m.preferredName || m.fullName}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{RELATIONSHIP_LABELS[m.relationship]}</Badge>
                      {m.careLevel !== 'independent' && (
                        <Badge variant="outline" className="text-[10px]">{CARE_LEVEL_LABELS[m.careLevel]}</Badge>
                      )}
                      <span>{m.passports.length} passport{m.passports.length !== 1 ? 's' : ''}</span>
                      <span>· {m.visas.length} visa{m.visas.length !== 1 ? 's' : ''}</span>
                      <span>· {m.vaccinations.length} vaccination{m.vaccinations.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit details</Button>
                  <Button size="sm" variant="outline" onClick={() => addPassport(m.id)}>
                    <BookOpen className="h-4 w-4 mr-1.5" /> Add passport
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addVisa(m.id)}>
                    <Plane className="h-4 w-4 mr-1.5" /> Add visa
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addVaccination(m.id)}>
                    <Syringe className="h-4 w-4 mr-1.5" /> Add vaccination
                  </Button>
                  <Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={() => handleDelete(m.id, m.fullName)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <DocList
                  title="Passports"
                  empty="No passports added"
                  items={m.passports.map((p) => ({ id: p.id, primary: `${p.country}`, secondary: `Expires ${p.expiryDate}`, expiryDate: p.expiryDate }))}
                  onRemove={(id) => removeDoc(m.id, 'passports', id)}
                />
                <DocList
                  title="Visas"
                  empty="No visas added"
                  items={m.visas.map((v) => ({ id: v.id, primary: `${v.country} — ${v.visaType}`, secondary: `Expires ${v.expiryDate}`, expiryDate: v.expiryDate }))}
                  onRemove={(id) => removeDoc(m.id, 'visas', id)}
                />
                <DocList
                  title="Vaccinations"
                  empty="No vaccinations recorded"
                  items={m.vaccinations.map((v) => ({
                    id: v.id,
                    primary: v.name,
                    secondary: v.expiryDate ? `Valid until ${v.expiryDate}` : `Received ${v.dateReceived || '—'}`,
                    expiryDate: v.expiryDate,
                  }))}
                  onRemove={(id) => removeDoc(m.id, 'vaccinations', id)}
                />

                {(m.dietaryNeeds || m.mobilityNeeds || m.emergencyContactName) && (
                  <div className="text-xs space-y-1 p-3 rounded-md bg-muted/40">
                    {m.dietaryNeeds && <div><strong>Dietary:</strong> {m.dietaryNeeds}</div>}
                    {m.mobilityNeeds && <div><strong>Mobility:</strong> {m.mobilityNeeds}</div>}
                    {m.emergencyContactName && (
                      <div><strong>Emergency contact:</strong> {m.emergencyContactName} {m.emergencyContactPhone && `· ${m.emergencyContactPhone}`}</div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit family member' : 'Add family member'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Full name *</Label>
              <Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
            </div>
            <div>
              <Label>Preferred name (optional)</Label>
              <Input value={draft.preferredName ?? ''} onChange={(e) => setDraft({ ...draft, preferredName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Relationship</Label>
                <Select value={draft.relationship} onValueChange={(v) => setDraft({ ...draft, relationship: v as RelationshipType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(RELATIONSHIP_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Care level</Label>
                <Select value={draft.careLevel} onValueChange={(v) => setDraft({ ...draft, careLevel: v as CareLevel })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CARE_LEVEL_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Date of birth</Label>
                <Input type="date" value={draft.dateOfBirth ?? ''} onChange={(e) => setDraft({ ...draft, dateOfBirth: e.target.value })} />
              </div>
              <div>
                <Label>Nationality</Label>
                <Input value={draft.nationality ?? ''} onChange={(e) => setDraft({ ...draft, nationality: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Dietary needs</Label>
              <Input value={draft.dietaryNeeds ?? ''} onChange={(e) => setDraft({ ...draft, dietaryNeeds: e.target.value })} placeholder="e.g. nut allergy, halal, no dairy" />
            </div>
            <div>
              <Label>Mobility / accessibility needs</Label>
              <Input value={draft.mobilityNeeds ?? ''} onChange={(e) => setDraft({ ...draft, mobilityNeeds: e.target.value })} placeholder="e.g. wheelchair, walking aid, autism support" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Emergency contact name</Label>
                <Input value={draft.emergencyContactName ?? ''} onChange={(e) => setDraft({ ...draft, emergencyContactName: e.target.value })} />
              </div>
              <div>
                <Label>Emergency phone</Label>
                <Input value={draft.emergencyContactPhone ?? ''} onChange={(e) => setDraft({ ...draft, emergencyContactPhone: e.target.value })} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-1">
        <Shield className="h-3 w-3" />
        All family records are AES-256 encrypted on this device. Nothing is uploaded unless you choose to sync.
      </p>
    </div>
  );
};

// ─────────── Subcomponents ───────────

interface DocListProps {
  title: string;
  empty: string;
  items: { id: string; primary: string; secondary: string; expiryDate?: string }[];
  onRemove: (id: string) => void;
}

const DocList: React.FC<DocListProps> = ({ title, empty, items, onRemove }) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">{title}</div>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground italic px-2 py-1">{empty}</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((d) => {
            const days = d.expiryDate
              ? Math.floor((new Date(d.expiryDate).getTime() - today.getTime()) / 86_400_000)
              : null;
            const expired = days !== null && days < 0;
            const soon = days !== null && days >= 0 && days <= 90;
            return (
              <li key={d.id} className="flex items-center justify-between text-sm bg-muted/30 rounded-md px-3 py-2 gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{d.primary}</div>
                  <div className={`text-xs ${expired ? 'text-destructive font-medium' : soon ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                    {d.secondary}
                    {expired && ' · EXPIRED'}
                    {soon && !expired && ` · ${days}d`}
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => onRemove(d.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const FamilyExpiryAlerts: React.FC<{ alerts: ExpiryAlert[] }> = ({ alerts }) => {
  const grouped = {
    expired: alerts.filter((a) => a.urgency === 'expired'),
    critical: alerts.filter((a) => a.urgency === 'critical'),
    warning: alerts.filter((a) => a.urgency === 'warning'),
    notice: alerts.filter((a) => a.urgency === 'notice'),
  };

  const sections: Array<{ key: keyof typeof grouped; label: string; tone: string; icon: React.ReactNode }> = [
    { key: 'expired', label: 'Expired', tone: 'border-destructive/40 bg-destructive/5 text-destructive', icon: <AlertTriangle className="h-4 w-4" /> },
    { key: 'critical', label: 'Within 7 days', tone: 'border-destructive/30 bg-destructive/5 text-destructive', icon: <AlertTriangle className="h-4 w-4" /> },
    { key: 'warning', label: 'Within 30 days', tone: 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400', icon: <Calendar className="h-4 w-4" /> },
    { key: 'notice', label: 'Within 90 days', tone: 'border-primary/30 bg-primary/5 text-primary', icon: <Calendar className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-2">
      {sections.map((s) =>
        grouped[s.key].length === 0 ? null : (
          <div key={s.key} className={`border rounded-md p-3 ${s.tone}`}>
            <div className="flex items-center gap-2 text-xs font-semibold mb-1.5">
              {s.icon} {s.label} ({grouped[s.key].length})
            </div>
            <ul className="space-y-1 text-xs">
              {grouped[s.key].slice(0, 5).map((a, i) => (
                <li key={`${a.memberId}-${a.docType}-${i}`} className="flex justify-between gap-3">
                  <span className="truncate">
                    <strong>{a.memberName}</strong> · {a.docLabel}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {a.daysUntilExpiry < 0 ? `${Math.abs(a.daysUntilExpiry)}d ago` : `${a.daysUntilExpiry}d`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      )}
    </div>
  );
};

export default FamilyVault;
