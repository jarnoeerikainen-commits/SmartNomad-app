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
  expiryDate: string;
  showNumber: boolean;
}

const PassportManager = () => {
  const [passports, setPassports] = useState<Passport[]>([]);
  const [isAddingPassport, setIsAddingPassport] = useState(false);
  const [newPassport, setNewPassport] = useState<Partial<Passport>>({
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
      expiryDate: newPassport.expiryDate!,
      showNumber: false
    };

    setPassports(prev => [...prev, passport]);
    setNewPassport({ showNumber: false });
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="w-6 h-6 text-blue-600" />
          Passport Manager
          {passports.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {passports.length} passport{passports.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Existing Passports */}
        {passports.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Your Passports
              <div className="h-px bg-gray-300 flex-1 ml-4"></div>
            </h3>
            <div className="grid gap-4">
              {passports.map(passport => {
                const expiryStatus = getExpiryStatus(passport.expiryDate);
                const daysUntilExpiry = getDaysUntilExpiry(passport.expiryDate);
                
                return (
                  <div key={passport.id} className="p-5 border-2 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-xl text-gray-800">{passport.country}</h4>
                          <Badge className={`${expiryStatus.color} text-white text-sm px-3 py-1`}>
                            {expiryStatus.text}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          {daysUntilExpiry > 0 ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {daysUntilExpiry} days until expiry
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                              <AlertTriangle className="w-4 h-4" />
                              Expired {Math.abs(daysUntilExpiry)} days ago
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => removePassport(passport.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Passport Number</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-mono text-lg font-semibold">
                            {passport.showNumber ? passport.passportNumber : maskPassportNumber(passport.passportNumber)}
                          </span>
                          <Button
                            onClick={() => toggleNumberVisibility(passport.id)}
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7 hover:bg-gray-100"
                          >
                            {passport.showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expiry Date</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-semibold">{new Date(passport.expiryDate).toLocaleDateString()}</span>
                          {expiryStatus.status !== 'valid' && (
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {passports.length > 0 && <Separator className="my-6" />}

        {/* Add New Passport */}
        {!isAddingPassport ? (
          <Button
            onClick={() => setIsAddingPassport(true)}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Passport
          </Button>
        ) : (
          <div className="space-y-6 p-6 border-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="font-bold text-xl text-gray-800">Add New Passport</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country *</Label>
                <Select
                  value={newPassport.country || ''}
                  onValueChange={(value) => setNewPassport(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiryDate" className="text-sm font-semibold text-gray-700">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  className="mt-2 h-12"
                  value={newPassport.expiryDate || ''}
                  onChange={(e) => setNewPassport(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="passportNumber" className="text-sm font-semibold text-gray-700">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  className="mt-2 h-12 font-mono"
                  value={newPassport.passportNumber || ''}
                  onChange={(e) => setNewPassport(prev => ({ ...prev, passportNumber: e.target.value.toUpperCase() }))}
                  placeholder="Enter passport number"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={addPassport} size="lg" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Passport
              </Button>
              <Button 
                onClick={() => {
                  setIsAddingPassport(false);
                  setNewPassport({ showNumber: false });
                }}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-2xl">🔒</div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Your data is secure</p>
              <p>Passport numbers are stored locally on your device and masked for security. You'll receive automatic reminders when passports need renewal (7 months and 1 month before expiry).</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassportManager;
