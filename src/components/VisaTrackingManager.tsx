import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, AlertTriangle, Edit, FileText, Plane, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisaTracking {
  id: string;
  countryCode: string;
  countryName: string;
  visaType: string;
  dayLimit: number;
  daysUsed: number;
  startDate: string;
  endDate: string;
  passportExpiry?: string;
  passportNotifications: number[]; // months before expiry to notify
  isActive: boolean;
}

interface VisaTrackingManagerProps {
  subscription: any;
  countries: any[];
}

const VISA_TYPES = [
  { 
    id: 'tourist', 
    name: 'Tourist Visa', 
    icon: '🏖️', 
    description: 'Leisure travel and sightseeing',
    commonDays: [30, 60, 90, 180]
  },
  { 
    id: 'business', 
    name: 'Business Visa', 
    icon: '💼', 
    description: 'Business meetings and conferences',
    commonDays: [30, 90, 180]
  },
  { 
    id: 'student', 
    name: 'Student Visa', 
    icon: '🎓', 
    description: 'Academic studies and education',
    commonDays: [180, 365, 730]
  },
  { 
    id: 'work', 
    name: 'Work Permit', 
    icon: '🏢', 
    description: 'Employment authorization',
    commonDays: [90, 180, 365, 730]
  },
  { 
    id: 'schengen', 
    name: 'Schengen Area', 
    icon: '🇪🇺', 
    description: 'EU Schengen zone travel',
    commonDays: [90]
  },
  { 
    id: 'transit', 
    name: 'Transit Visa', 
    icon: '✈️', 
    description: 'Airport or country transit',
    commonDays: [1, 3, 5, 10]
  },
  { 
    id: 'digital-nomad', 
    name: 'Digital Nomad', 
    icon: '💻', 
    description: 'Remote work visa',
    commonDays: [180, 365]
  },
  { 
    id: 'tax-residence', 
    name: 'Tax Residence', 
    icon: '📊', 
    description: 'Tax residency tracking',
    commonDays: [183, 365]
  }
];

const PASSPORT_NOTIFICATION_OPTIONS = [
  { months: 9, label: '9 months before expiry' },
  { months: 8, label: '8 months before expiry' },
  { months: 7, label: '7 months before expiry' },
  { months: 6, label: '6 months before expiry' },
  { months: 3, label: '3 months before expiry' },
  { months: 1, label: '1 month before expiry' }
];

const VisaTrackingManager: React.FC<VisaTrackingManagerProps> = ({ subscription, countries }) => {
  const [visaTrackings, setVisaTrackings] = useState<VisaTracking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<VisaTracking | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [dayLimit, setDayLimit] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([9, 6, 3]);
  const { toast } = useToast();

  // Check subscription limits
  const getVisaTrackingLimit = () => {
    switch (subscription.tier) {
      case 'free': return 1;
      case 'student': return 5;
      case 'business-individual': return 10;
      case 'personal': return 15;
      case 'family': return 25;
      case 'business': return 100;
      case 'enterprise': return 999;
      default: return 1;
    }
  };

  const canAddMoreVisas = () => {
    return visaTrackings.length < getVisaTrackingLimit();
  };

  const getAllowedVisaTypes = () => {
    switch (subscription.tier) {
      case 'free': return ['tourist'];
      case 'student': return ['tourist', 'student', 'transit'];
      case 'business-individual': return ['tourist', 'business', 'work'];
      case 'personal': return ['tourist', 'business', 'transit', 'digital-nomad'];
      case 'family': return VISA_TYPES.map(v => v.id);
      case 'business': return VISA_TYPES.map(v => v.id);
      case 'enterprise': return VISA_TYPES.map(v => v.id);
      default: return ['tourist'];
    }
  };

  const handleAddVisa = () => {
    if (!canAddMoreVisas()) {
      toast({
        title: "Upgrade Required",
        description: `Your ${subscription.tier} plan allows only ${getVisaTrackingLimit()} visa tracking(s). Please upgrade to add more.`,
        variant: "destructive"
      });
      return;
    }

    const selectedCountryData = countries.find(c => c.code === selectedCountry);
    const selectedVisaData = VISA_TYPES.find(v => v.id === selectedVisaType);
    
    if (!selectedCountryData || !selectedVisaData) return;

    const newVisa: VisaTracking = {
      id: `visa-${Date.now()}`,
      countryCode: selectedCountry,
      countryName: selectedCountryData.name,
      visaType: selectedVisaType,
      dayLimit: parseInt(dayLimit) || 90,
      daysUsed: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      passportExpiry: passportExpiry || undefined,
      passportNotifications: selectedNotifications,
      isActive: true
    };

    setVisaTrackings(prev => [...prev, newVisa]);
    resetForm();
    setIsModalOpen(false);
    
    toast({
      title: "Visa Tracking Added",
      description: `Now tracking ${selectedVisaData.name} for ${selectedCountryData.name}`,
    });
  };

  const handleEditVisa = (visa: VisaTracking) => {
    setEditingVisa(visa);
    setSelectedCountry(visa.countryCode);
    setSelectedVisaType(visa.visaType);
    setDayLimit(visa.dayLimit.toString());
    setPassportExpiry(visa.passportExpiry || '');
    setSelectedNotifications(visa.passportNotifications);
    setIsModalOpen(true);
  };

  const handleUpdateVisa = () => {
    if (!editingVisa) return;

    const updatedVisa = {
      ...editingVisa,
      dayLimit: parseInt(dayLimit) || 90,
      passportExpiry: passportExpiry || undefined,
      passportNotifications: selectedNotifications
    };

    setVisaTrackings(prev => prev.map(v => v.id === editingVisa.id ? updatedVisa : v));
    resetForm();
    setIsModalOpen(false);
    
    toast({
      title: "Visa Updated",
      description: "Visa tracking has been updated successfully",
    });
  };

  const resetForm = () => {
    setEditingVisa(null);
    setSelectedCountry('');
    setSelectedVisaType('');
    setDayLimit('');
    setPassportExpiry('');
    setSelectedNotifications([9, 6, 3]);
  };

  const updateDaysUsed = (visaId: string, newDays: number) => {
    setVisaTrackings(prev => prev.map(v => 
      v.id === visaId ? { ...v, daysUsed: Math.max(0, newDays) } : v
    ));
  };

  const getVisaProgress = (visa: VisaTracking) => {
    return Math.min((visa.daysUsed / visa.dayLimit) * 100, 100);
  };

  const getRemainingDays = (visa: VisaTracking) => {
    return Math.max(visa.dayLimit - visa.daysUsed, 0);
  };

  const getPassportWarnings = (visa: VisaTracking) => {
    if (!visa.passportExpiry) return [];
    
    const expiryDate = new Date(visa.passportExpiry);
    const today = new Date();
    const monthsUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    return visa.passportNotifications.filter(months => 
      monthsUntilExpiry <= months && monthsUntilExpiry > 0
    );
  };

  const allowedVisaTypes = getAllowedVisaTypes();

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="w-5 h-5" />
            Visa Tracking Manager
          </CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            {visaTrackings.length}/{getVisaTrackingLimit()} Visas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subscription Notice */}
        {subscription.tier === 'free' && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-orange-800">
              Free plan: Limited to 1 tourist visa tracking. Upgrade for multiple visa types and unlimited tracking.
            </AlertDescription>
          </Alert>
        )}

        {/* Active Visa Trackings */}
        <div className="space-y-3">
          {visaTrackings.map((visa) => {
            const progress = getVisaProgress(visa);
            const remaining = getRemainingDays(visa);
            const passportWarnings = getPassportWarnings(visa);
            const visaTypeData = VISA_TYPES.find(v => v.id === visa.visaType);

            return (
              <Card key={visa.id} className="border-white bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{visaTypeData?.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {visa.countryName} - {visaTypeData?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {visa.daysUsed}/{visa.dayLimit} days used • {remaining} days remaining
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditVisa(visa)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          progress > 80 ? 'bg-red-500' : 
                          progress > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Days Used Adjuster */}
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm">Days used:</Label>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDaysUsed(visa.id, visa.daysUsed - 1)}
                        disabled={visa.daysUsed === 0}
                        className="h-6 w-6 p-0"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={visa.daysUsed}
                        onChange={(e) => updateDaysUsed(visa.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-6 text-center text-sm"
                        min="0"
                        max={visa.dayLimit}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDaysUsed(visa.id, visa.daysUsed + 1)}
                        disabled={visa.daysUsed >= visa.dayLimit}
                        className="h-6 w-6 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Passport Warnings */}
                  {passportWarnings.length > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-red-800">
                        Passport expires in {passportWarnings[0]} months! Consider renewal.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Visa Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={!canAddMoreVisas()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Plane className="w-4 h-4 mr-2" />
          {canAddMoreVisas() ? 'Add Visa Tracking' : `Upgrade for More (${visaTrackings.length}/${getVisaTrackingLimit()})`}
        </Button>

        {/* Add/Edit Visa Modal */}
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingVisa ? 'Edit Visa Tracking' : 'Add Visa Tracking'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Country Selection */}
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={!!editingVisa}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country..." />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Visa Type Selection */}
              <div className="space-y-2">
                <Label>Visa Type</Label>
                <Select value={selectedVisaType} onValueChange={(value) => {
                  setSelectedVisaType(value);
                  const visaType = VISA_TYPES.find(v => v.id === value);
                  if (visaType) setDayLimit(visaType.commonDays[0].toString());
                }} disabled={!!editingVisa}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {VISA_TYPES.filter(vt => allowedVisaTypes.includes(vt.id)).map(visaType => (
                      <SelectItem key={visaType.id} value={visaType.id}>
                        <div className="flex items-center gap-2">
                          <span>{visaType.icon}</span>
                          <div>
                            <div className="font-medium">{visaType.name}</div>
                            <div className="text-xs text-gray-500">{visaType.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Day Limit with Presets */}
              {selectedVisaType && (
                <div className="space-y-2">
                  <Label>Day Limit</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {VISA_TYPES.find(v => v.id === selectedVisaType)?.commonDays.map(days => (
                        <Button
                          key={days}
                          type="button"
                          variant={dayLimit === days.toString() ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDayLimit(days.toString())}
                        >
                          {days} days
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      value={dayLimit}
                      onChange={(e) => setDayLimit(e.target.value)}
                      placeholder="Custom day limit"
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
              )}

              {/* Passport Expiry */}
              <div className="space-y-2">
                <Label>Passport Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  value={passportExpiry}
                  onChange={(e) => setPassportExpiry(e.target.value)}
                />
              </div>

              {/* Passport Notifications */}
              {passportExpiry && (
                <div className="space-y-2">
                  <Label>Passport Expiry Notifications</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PASSPORT_NOTIFICATION_OPTIONS.map(option => (
                      <label key={option.months} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(option.months)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNotifications(prev => [...prev, option.months]);
                            } else {
                              setSelectedNotifications(prev => prev.filter(m => m !== option.months));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={editingVisa ? handleUpdateVisa : handleAddVisa}
                  disabled={!selectedCountry || !selectedVisaType || !dayLimit}
                  className="flex-1"
                >
                  {editingVisa ? 'Update' : 'Add'} Visa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default VisaTrackingManager;