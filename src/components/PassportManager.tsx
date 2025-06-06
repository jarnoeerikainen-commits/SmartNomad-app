import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, AlertTriangle, Calendar, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Passport {
  id: string;
  country: string;
  passportNumber: string;
  type: 'regular' | 'diplomatic' | 'service' | 'emergency';
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  showNumber: boolean;
}

const PassportManager = () => {
  const [passports, setPassports] = useState<Passport[]>([]);
  const [isAddingPassport, setIsAddingPassport] = useState(false);
  const [newPassport, setNewPassport] = useState<Partial<Passport>>({
    type: 'regular',
    showNumber: false
  });
  const { toast } = useToast();

  // Load passports from localStorage
  useEffect(() => {
    const savedPassports = localStorage.getItem('passports');
    if (savedPassports) {
      setPassports(JSON.parse(savedPassports));
    }
  }, []);

  // Save passports to localStorage
  useEffect(() => {
    localStorage.setItem('passports', JSON.stringify(passports));
  }, [passports]);

  // Check for expiring passports
  useEffect(() => {
    const checkExpiringPassports = () => {
      const sevenMonthsFromNow = new Date();
      sevenMonthsFromNow.setMonth(sevenMonthsFromNow.getMonth() + 7);
      
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      passports.forEach(passport => {
        const expiryDate = new Date(passport.expiryDate);
        
        if (expiryDate <= oneMonthFromNow) {
          toast({
            title: "🚨 Passport Expiring Soon!",
            description: `Your ${passport.country} passport expires in less than 1 month (${expiryDate.toLocaleDateString()})`,
            variant: "destructive"
          });
        } else if (expiryDate <= sevenMonthsFromNow) {
          toast({
            title: "⚠️ Passport Renewal Reminder",
            description: `Your ${passport.country} passport expires in ${expiryDate.toLocaleDateString()}. Consider renewing soon for international travel.`,
          });
        }
      });
    };

    if (passports.length > 0) {
      checkExpiringPassports();
    }
  }, [passports, toast]);

  const addPassport = () => {
    if (!newPassport.country || !newPassport.passportNumber || !newPassport.expiryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const passport: Passport = {
      id: Date.now().toString(),
      country: newPassport.country!,
      passportNumber: newPassport.passportNumber!,
      type: newPassport.type || 'regular',
      issueDate: newPassport.issueDate || '',
      expiryDate: newPassport.expiryDate!,
      issuingAuthority: newPassport.issuingAuthority || '',
      showNumber: false
    };

    setPassports(prev => [...prev, passport]);
    setNewPassport({ type: 'regular', showNumber: false });
    setIsAddingPassport(false);
    
    toast({
      title: "Passport Added",
      description: `${passport.country} passport has been added successfully.`,
    });
  };

  const removePassport = (id: string) => {
    setPassports(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Passport Removed",
      description: "Passport has been removed from your records.",
    });
  };

  const toggleNumberVisibility = (id: string) => {
    setPassports(prev => prev.map(p => 
      p.id === id ? { ...p, showNumber: !p.showNumber } : p
    ));
  };

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const oneMonth = new Date();
    oneMonth.setMonth(oneMonth.getMonth() + 1);
    const sevenMonths = new Date();
    sevenMonths.setMonth(sevenMonths.getMonth() + 7);

    if (expiry <= now) {
      return { status: 'expired', color: 'bg-red-500', text: 'Expired' };
    } else if (expiry <= oneMonth) {
      return { status: 'critical', color: 'bg-red-400', text: 'Expires Soon' };
    } else if (expiry <= sevenMonths) {
      return { status: 'warning', color: 'bg-yellow-500', text: 'Renewal Needed' };
    } else {
      return { status: 'valid', color: 'bg-green-500', text: 'Valid' };
    }
  };

  const maskPassportNumber = (number: string) => {
    if (number.length <= 4) return '****';
    return '*'.repeat(number.length - 4) + number.slice(-4);
  };

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
    'Switzerland', 'Austria', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Australia', 'New Zealand',
    'Canada', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia', 'Vietnam', 'India',
    'China', 'United Arab Emirates', 'Saudi Arabia', 'Israel', 'Turkey', 'Russia',
    'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'South Africa',
    'Egypt', 'Morocco', 'Kenya', 'Nigeria', 'Portugal', 'Greece', 'Poland',
    'Czech Republic', 'Hungary', 'Ireland', 'Iceland'
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Passport Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Passports */}
        {passports.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Your Passports</h3>
            {passports.map(passport => {
              const expiryStatus = getExpiryStatus(passport.expiryDate);
              return (
                <div key={passport.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{passport.country}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {passport.type.charAt(0).toUpperCase() + passport.type.slice(1)}
                        </Badge>
                        <Badge className={`${expiryStatus.color} text-white text-xs`}>
                          {expiryStatus.text}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => removePassport(passport.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">Passport Number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono">
                          {passport.showNumber ? passport.passportNumber : maskPassportNumber(passport.passportNumber)}
                        </span>
                        <Button
                          onClick={() => toggleNumberVisibility(passport.id)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                        >
                          {passport.showNumber ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Expiry Date</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <span>{new Date(passport.expiryDate).toLocaleDateString()}</span>
                        {expiryStatus.status !== 'valid' && (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    
                    {passport.issueDate && (
                      <div>
                        <Label className="text-xs text-gray-600">Issue Date</Label>
                        <p className="mt-1">{new Date(passport.issueDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    
                    {passport.issuingAuthority && (
                      <div>
                        <Label className="text-xs text-gray-600">Issuing Authority</Label>
                        <p className="mt-1">{passport.issuingAuthority}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {passports.length > 0 && <Separator />}

        {/* Add New Passport */}
        {!isAddingPassport ? (
          <Button
            onClick={() => setIsAddingPassport(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Passport
          </Button>
        ) : (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold">Add New Passport</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={newPassport.country}
                  onValueChange={(value) => setNewPassport(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Passport Type</Label>
                <Select
                  value={newPassport.type}
                  onValueChange={(value: 'regular' | 'diplomatic' | 'service' | 'emergency') => 
                    setNewPassport(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="diplomatic">Diplomatic</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="passportNumber">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  value={newPassport.passportNumber || ''}
                  onChange={(e) => setNewPassport(prev => ({ ...prev, passportNumber: e.target.value }))}
                  placeholder="Enter passport number"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newPassport.expiryDate || ''}
                  onChange={(e) => setNewPassport(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={newPassport.issueDate || ''}
                  onChange={(e) => setNewPassport(prev => ({ ...prev, issueDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  value={newPassport.issuingAuthority || ''}
                  onChange={(e) => setNewPassport(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                  placeholder="e.g., U.S. Department of State"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addPassport}>Add Passport</Button>
              <Button 
                onClick={() => {
                  setIsAddingPassport(false);
                  setNewPassport({ type: 'regular', showNumber: false });
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>🔒 Your passport numbers are stored locally and masked for security.</p>
          <p>📅 You'll receive automatic reminders when passports need renewal.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassportManager;
