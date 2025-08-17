import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  MapPin,
  Plus,
  Syringe,
  Pill,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthRequirement {
  id: string;
  country: string;
  countryCode: string;
  requirements: {
    vaccinations: string[];
    medications: string[];
    documents: string[];
    restrictions: string[];
  };
  lastUpdated: string;
  isCompliant: boolean;
}

interface UserHealthRecord {
  id: string;
  type: 'vaccination' | 'medication' | 'document';
  name: string;
  date: string;
  expiryDate?: string;
  verified: boolean;
  notes: string;
}

const COMMON_VACCINATIONS = [
  'COVID-19',
  'Yellow Fever',
  'Hepatitis A',
  'Hepatitis B',
  'Typhoid',
  'Japanese Encephalitis',
  'Meningitis',
  'Rabies',
  'Tetanus',
  'Polio',
  'MMR (Measles, Mumps, Rubella)',
  'Influenza'
];

const COMMON_MEDICATIONS = [
  'Malaria Prophylaxis',
  'Altitude Sickness Medication',
  'Motion Sickness Medication',
  'Antibiotics',
  'Anti-diarrheal',
  'Pain Relievers',
  'Allergy Medication'
];

export const HealthRequirementsTracker: React.FC = () => {
  const [requirements, setRequirements] = useState<HealthRequirement[]>([
    {
      id: '1',
      country: 'Thailand',
      countryCode: 'TH',
      requirements: {
        vaccinations: ['COVID-19', 'Hepatitis A', 'Typhoid'],
        medications: ['Malaria Prophylaxis'],
        documents: ['Travel Insurance with Medical Coverage'],
        restrictions: ['No health restrictions for most travelers']
      },
      lastUpdated: '2024-01-15',
      isCompliant: false
    }
  ]);

  const [userRecords, setUserRecords] = useState<UserHealthRecord[]>([
    {
      id: '1',
      type: 'vaccination',
      name: 'COVID-19',
      date: '2023-12-15',
      expiryDate: '2024-12-15',
      verified: true,
      notes: 'Pfizer-BioNTech vaccine, 2 doses'
    }
  ]);

  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [isAddingRequirement, setIsAddingRequirement] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [recordForm, setRecordForm] = useState({
    type: 'vaccination' as UserHealthRecord['type'],
    name: '',
    date: '',
    expiryDate: '',
    notes: ''
  });
  const { toast } = useToast();

  const checkCompliance = (requirement: HealthRequirement): boolean => {
    const requiredVaccinations = requirement.requirements.vaccinations;
    const userVaccinations = userRecords
      .filter(r => r.type === 'vaccination' && r.verified)
      .map(r => r.name);
    
    return requiredVaccinations.every(vac => 
      userVaccinations.some(userVac => userVac.includes(vac))
    );
  };

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return { status: 'no-expiry', color: 'gray', text: 'No expiry' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'red', text: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring-soon', color: 'orange', text: `Expires in ${daysUntilExpiry} days` };
    } else {
      return { status: 'valid', color: 'green', text: `Valid for ${daysUntilExpiry} days` };
    }
  };

  const handleAddRecord = () => {
    if (!recordForm.name || !recordForm.date) {
      toast({
        title: "Missing information",
        description: "Name and date are required",
        variant: "destructive",
      });
      return;
    }

    const newRecord: UserHealthRecord = {
      id: Date.now().toString(),
      ...recordForm,
      verified: true
    };

    setUserRecords(prev => [...prev, newRecord]);
    setRecordForm({
      type: 'vaccination',
      name: '',
      date: '',
      expiryDate: '',
      notes: ''
    });
    setIsAddingRecord(false);

    toast({
      title: "Health record added",
      description: "Your health record has been saved successfully",
    });
  };

  const getTypeIcon = (type: UserHealthRecord['type']) => {
    switch (type) {
      case 'vaccination': return <Syringe className="w-4 h-4" />;
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Health Requirements Tracker
          </CardTitle>
          <CardDescription>
            Track vaccination requirements and health records for your destinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Country Requirements */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Country Health Requirements</h3>
                <Button
                  onClick={() => setIsAddingRequirement(true)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Country
                </Button>
              </div>

              <div className="space-y-4">
                {requirements.map((req) => {
                  const isCompliant = checkCompliance(req);
                  return (
                    <Card key={req.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <h4 className="font-semibold">{req.country}</h4>
                            <Badge 
                              variant={isCompliant ? "default" : "destructive"}
                              className="flex items-center gap-1"
                            >
                              {isCompliant ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {isCompliant ? 'Compliant' : 'Not Compliant'}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(req.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {req.requirements.vaccinations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                                <Syringe className="w-3 h-3" />
                                Required Vaccinations
                              </h5>
                              <div className="space-y-1">
                                {req.requirements.vaccinations.map((vac, index) => {
                                  const hasVaccination = userRecords.some(r => 
                                    r.type === 'vaccination' && r.name.includes(vac) && r.verified
                                  );
                                  return (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      {hasVaccination ? (
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                                      )}
                                      {vac}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {req.requirements.medications.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                                <Pill className="w-3 h-3" />
                                Recommended Medications
                              </h5>
                              <div className="space-y-1">
                                {req.requirements.medications.map((med, index) => (
                                  <div key={index} className="text-sm text-muted-foreground">
                                    • {med}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* User Health Records */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Health Records</h3>
                <Button
                  onClick={() => setIsAddingRecord(true)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </Button>
              </div>

              <div className="grid gap-3">
                {userRecords.map((record) => {
                  const expiryStatus = getExpiryStatus(record.expiryDate);
                  return (
                    <Card key={record.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(record.type)}
                            <div>
                              <div className="font-medium">{record.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(record.date).toLocaleDateString()}
                                {record.notes && ` • ${record.notes}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {record.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {record.expiryDate && (
                              <Badge 
                                variant={expiryStatus.color === 'red' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                {expiryStatus.text}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add Health Record Dialog */}
          <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
                <DialogDescription>
                  Add a vaccination, medication, or health document to your records
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="record-type">Type</Label>
                  <Select 
                    value={recordForm.type} 
                    onValueChange={(value) => setRecordForm(prev => ({ ...prev, type: value as UserHealthRecord['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vaccination">💉 Vaccination</SelectItem>
                      <SelectItem value="medication">💊 Medication</SelectItem>
                      <SelectItem value="document">📄 Health Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="record-name">Name *</Label>
                  {recordForm.type === 'vaccination' ? (
                    <Select 
                      value={recordForm.name} 
                      onValueChange={(value) => setRecordForm(prev => ({ ...prev, name: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vaccination" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_VACCINATIONS.map(vac => (
                          <SelectItem key={vac} value={vac}>{vac}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : recordForm.type === 'medication' ? (
                    <Select 
                      value={recordForm.name} 
                      onValueChange={(value) => setRecordForm(prev => ({ ...prev, name: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_MEDICATIONS.map(med => (
                          <SelectItem key={med} value={med}>{med}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={recordForm.name}
                      onChange={(e) => setRecordForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Document name"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="record-date">Date *</Label>
                  <Input
                    id="record-date"
                    type="date"
                    value={recordForm.date}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="record-expiry">Expiry Date</Label>
                  <Input
                    id="record-expiry"
                    type="date"
                    value={recordForm.expiryDate}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="record-notes">Notes</Label>
                  <Input
                    id="record-notes"
                    value={recordForm.notes}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddRecord} className="flex-1">
                    Add Record
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingRecord(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};