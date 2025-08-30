
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Syringe, Plus, Calendar, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocationData } from '@/types/country';

interface Vaccination {
  id: string;
  name: string;
  dateReceived: string;
  expiryDate: string;
  isRequired: boolean;
  notes?: string;
}

interface VaccinationTrackerProps {
  currentLocation?: LocationData | null;
  trackedCountries?: Array<{ name: string; code: string; }>;
}

const COMMON_VACCINATIONS = [
  { name: 'Yellow Fever', duration: 10, required: ['Angola', 'Brazil', 'Ghana', 'Kenya', 'Nigeria', 'Peru', 'Colombia', 'Ecuador', 'Bolivia'] },
  { name: 'Hepatitis A', duration: 1, required: ['India', 'Thailand', 'Vietnam', 'Mexico', 'Egypt', 'Morocco', 'Turkey', 'Guatemala', 'Honduras'] },
  { name: 'Hepatitis B', duration: 10, required: ['China', 'Thailand', 'India', 'Philippines', 'Vietnam', 'Indonesia', 'Malaysia', 'Myanmar', 'Cambodia'] },
  { name: 'Typhoid', duration: 3, required: ['India', 'Pakistan', 'Bangladesh', 'Nepal', 'Cambodia', 'Laos', 'Burma', 'Afghanistan', 'Iraq'] },
  { name: 'Japanese Encephalitis', duration: 2, required: ['Japan', 'China', 'Thailand', 'Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'Philippines', 'Indonesia'] },
  { name: 'Meningitis', duration: 3, required: ['Saudi Arabia', 'Chad', 'Niger', 'Sudan', 'Mali', 'Burkina Faso', 'Senegal', 'Gambia', 'Guinea'] },
  { name: 'Cholera', duration: 2, required: ['Haiti', 'Yemen', 'Somalia', 'Congo', 'Afghanistan', 'South Sudan', 'Nigeria', 'Bangladesh', 'India'] },
  { name: 'Rabies', duration: 2, required: ['India', 'Thailand', 'Philippines', 'Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'Indonesia', 'Malaysia'] },
  { name: 'Polio', duration: 10, required: ['Afghanistan', 'Pakistan', 'Nigeria', 'Syria', 'Somalia', 'Yemen'] },
  { name: 'COVID-19', duration: 1, required: ['Global'] },
  { name: 'Malaria Prophylaxis', duration: 0, required: ['Sub-Saharan Africa', 'Parts of Asia', 'Central America', 'Haiti', 'Papua New Guinea'] },
  { name: 'Tick-borne Encephalitis', duration: 3, required: ['Central Europe', 'Eastern Europe', 'Russia', 'Scandinavia', 'Baltic States'] },
  { name: 'Influenza', duration: 1, required: ['Recommended Globally'] },
  { name: 'MMR (Measles, Mumps, Rubella)', duration: 20, required: ['Global - especially developing countries'] },
  { name: 'Tetanus-Diphtheria', duration: 10, required: ['Global'] },
  { name: 'Varicella (Chickenpox)', duration: 20, required: ['Recommended for non-immune travelers'] },
  { name: 'Pneumococcal', duration: 5, required: ['High-risk areas and elderly travelers'] },
  { name: 'Dengue Fever', duration: 3, required: ['Southeast Asia', 'Latin America', 'Caribbean', 'Pacific Islands'] },
  { name: 'Chikungunya', duration: 0, required: ['Africa', 'Asia', 'Caribbean', 'Central America'] },
  { name: 'Zika Virus', duration: 0, required: ['Latin America', 'Caribbean', 'Southeast Asia', 'Pacific Islands'] }
];

const VaccinationTracker: React.FC<VaccinationTrackerProps> = ({ currentLocation, trackedCountries = [] }) => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedVaccinations = localStorage.getItem('vaccinations');
    if (savedVaccinations) {
      setVaccinations(JSON.parse(savedVaccinations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vaccinations', JSON.stringify(vaccinations));
    
    // Check for expiring vaccinations
    checkExpiringVaccinations();
  }, [vaccinations]);

  const checkExpiringVaccinations = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    vaccinations.forEach(vaccination => {
      const expiryDate = new Date(vaccination.expiryDate);
      if (expiryDate <= thirtyDaysFromNow && expiryDate > today) {
        toast({
          title: "💉 Vaccination Expiring Soon",
          description: `${vaccination.name} expires on ${expiryDate.toLocaleDateString()}`,
          variant: "destructive"
        });
      } else if (expiryDate <= today) {
        toast({
          title: "💉 Vaccination Expired",
          description: `${vaccination.name} expired on ${expiryDate.toLocaleDateString()}`,
          variant: "destructive"
        });
      }
    });
  };

  const addVaccination = () => {
    if (!selectedVaccination || !dateReceived) return;

    const vaccinationInfo = COMMON_VACCINATIONS.find(v => v.name === selectedVaccination);
    if (!vaccinationInfo) return;

    const receivedDate = new Date(dateReceived);
    const expiryDate = new Date(receivedDate.getTime() + (vaccinationInfo.duration * 365 * 24 * 60 * 60 * 1000));

    const newVaccination: Vaccination = {
      id: Date.now().toString(),
      name: selectedVaccination,
      dateReceived,
      expiryDate: expiryDate.toISOString().split('T')[0],
      isRequired: vaccinationInfo.required.includes(currentLocation?.country || ''),
      notes
    };

    setVaccinations(prev => [...prev, newVaccination]);
    setIsAddModalOpen(false);
    setSelectedVaccination('');
    setDateReceived('');
    setNotes('');

    toast({
      title: "Vaccination Added",
      description: `${selectedVaccination} has been added to your records.`,
    });
  };

  const removeVaccination = (id: string) => {
    setVaccinations(prev => prev.filter(v => v.id !== id));
    toast({
      title: "Vaccination Removed",
      description: "Vaccination has been removed from your records.",
    });
  };

  const getRecommendedVaccinations = () => {
    const allCountries = [
      ...(currentLocation ? [currentLocation.country] : []),
      ...trackedCountries.map(c => c.name)
    ];
    
    if (allCountries.length === 0) return [];
    
    return COMMON_VACCINATIONS.filter(vaccination => 
      vaccination.required.some(req => 
        allCountries.some(country => 
          req.includes(country) || country.includes(req) || req === 'Global'
        )
      ) &&
      !vaccinations.some(v => v.name === vaccination.name)
    );
  };

  const quickAddVaccination = (vaccineName: string) => {
    const vaccinationInfo = COMMON_VACCINATIONS.find(v => v.name === vaccineName);
    if (!vaccinationInfo) return;

    const today = new Date();
    const expiryDate = vaccinationInfo.duration > 0 
      ? new Date(today.getTime() + (vaccinationInfo.duration * 365 * 24 * 60 * 60 * 1000))
      : new Date(today.getTime() + (365 * 24 * 60 * 60 * 1000)); // Default 1 year for prophylaxis

    const newVaccination: Vaccination = {
      id: Date.now().toString(),
      name: vaccineName,
      dateReceived: today.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      isRequired: true,
      notes: 'Quick added'
    };

    setVaccinations(prev => [...prev, newVaccination]);
    toast({
      title: "Vaccination Added",
      description: `${vaccineName} has been added to your records.`,
    });
  };

  const getVaccinationStatus = (vaccination: Vaccination) => {
    const expiryDate = new Date(vaccination.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    if (expiryDate <= today) return 'expired';
    if (expiryDate <= thirtyDaysFromNow) return 'expiring';
    return 'valid';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'expiring': return <Bell className="w-4 h-4 text-orange-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired': return <Badge variant="destructive">Expired</Badge>;
      case 'expiring': return <Badge variant="secondary">Expiring Soon</Badge>;
      default: return <Badge className="bg-green-600">Valid</Badge>;
    }
  };

  const recommendedVaccinations = getRecommendedVaccinations();

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Syringe className="w-5 h-5" />
          Vaccination Tracker
        </CardTitle>
        <p className="text-sm text-purple-600">
          Track your vaccinations and get travel recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recommended Vaccinations for Tracked Countries */}
        {recommendedVaccinations.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Recommended for Your Destinations
            </h4>
            <div className="space-y-2">
              {recommendedVaccinations.map(vaccine => (
                <div key={vaccine.name} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      {vaccine.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {vaccine.duration > 0 ? `Valid ${vaccine.duration} years` : 'Prophylaxis'}
                    </span>
                  </div>
                  <Button
                    onClick={() => quickAddVaccination(vaccine.name)}
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    ✓ Add Quick
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Vaccinations */}
        {vaccinations.length > 0 ? (
          <div className="space-y-3">
            {vaccinations.map(vaccination => {
              const status = getVaccinationStatus(vaccination);
              return (
                <div key={vaccination.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <p className="font-medium">{vaccination.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(vaccination.expiryDate).toLocaleDateString()}
                      </p>
                      {vaccination.notes && (
                        <p className="text-xs text-gray-600">{vaccination.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status)}
                    <Button
                      onClick={() => removeVaccination(vaccination.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500">
            <Syringe className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No vaccinations tracked yet</p>
          </div>
        )}

        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full gradient-success text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vaccination
        </Button>

        {/* Add Vaccination Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Vaccination</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Vaccination Type</Label>
                <Select value={selectedVaccination} onValueChange={setSelectedVaccination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccination..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_VACCINATIONS.map(vaccine => (
                      <SelectItem key={vaccine.name} value={vaccine.name}>
                        {vaccine.name} (Valid for {vaccine.duration} years)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Date Received</Label>
                <Input
                  type="date"
                  value={dateReceived}
                  onChange={(e) => setDateReceived(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Notes (Optional)</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Clinic, batch number, etc."
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={addVaccination}
                  disabled={!selectedVaccination || !dateReceived}
                  className="flex-1"
                >
                  Add Vaccination
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default VaccinationTracker;
