import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, AlertTriangle, Calendar, FileText, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Passport {
  id: string;
  country: string;
  passportNumber: string;
  expiryDate: string;
  showNumber: boolean;
}

interface Visa {
  id: string;
  country: string;
  visaType: string;
  issueDate: string;
  expiryDate: string;
  visaNumber: string;
  showNumber: boolean;
}

interface WorkingPermit {
  id: string;
  country: string;
  permitType: string;
  issueDate: string;
  expiryDate: string;
  permitNumber: string;
  showNumber: boolean;
}

const PassportManager = () => {
  const [passports, setPassports] = useState<Passport[]>([]);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [workingPermits, setWorkingPermits] = useState<WorkingPermit[]>([]);
  const [isAddingPassport, setIsAddingPassport] = useState(false);
  const [isAddingVisa, setIsAddingVisa] = useState(false);
  const [isAddingPermit, setIsAddingPermit] = useState(false);
  const [newPassport, setNewPassport] = useState<Partial<Passport>>({
    showNumber: false
  });
  const [newVisa, setNewVisa] = useState<Partial<Visa>>({
    showNumber: false
  });
  const [newPermit, setNewPermit] = useState<Partial<WorkingPermit>>({
    showNumber: false
  });
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedPassports = localStorage.getItem('passports');
    const savedVisas = localStorage.getItem('visas');
    const savedPermits = localStorage.getItem('workingPermits');
    
    if (savedPassports) {
      setPassports(JSON.parse(savedPassports));
    }
    if (savedVisas) {
      setVisas(JSON.parse(savedVisas));
    }
    if (savedPermits) {
      setWorkingPermits(JSON.parse(savedPermits));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('passports', JSON.stringify(passports));
  }, [passports]);

  useEffect(() => {
    localStorage.setItem('visas', JSON.stringify(visas));
  }, [visas]);

  useEffect(() => {
    localStorage.setItem('workingPermits', JSON.stringify(workingPermits));
  }, [workingPermits]);

  // Check for expiring documents
  useEffect(() => {
    const checkExpiringDocuments = () => {
      const sevenMonthsFromNow = new Date();
      sevenMonthsFromNow.setMonth(sevenMonthsFromNow.getMonth() + 7);
      
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      // Check passports
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

      // Check visas
      visas.forEach(visa => {
        const expiryDate = new Date(visa.expiryDate);
        
        if (expiryDate <= oneMonthFromNow) {
          toast({
            title: "🚨 Visa Expiring Soon!",
            description: `Your ${visa.country} visa expires in less than 1 month (${expiryDate.toLocaleDateString()})`,
            variant: "destructive"
          });
        }
      });

      // Check working permits
      workingPermits.forEach(permit => {
        const expiryDate = new Date(permit.expiryDate);
        
        if (expiryDate <= oneMonthFromNow) {
          toast({
            title: "🚨 Working Permit Expiring Soon!",
            description: `Your ${permit.country} working permit expires in less than 1 month (${expiryDate.toLocaleDateString()})`,
            variant: "destructive"
          });
        }
      });
    };

    if (passports.length > 0 || visas.length > 0 || workingPermits.length > 0) {
      checkExpiringDocuments();
    }
  }, [passports, visas, workingPermits, toast]);

  const addPassport = () => {
    if (!newPassport.country || !newPassport.expiryDate) {
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
      passportNumber: '', // Keep empty for data safety
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

  const addVisa = () => {
    if (!newVisa.country || !newVisa.visaType || !newVisa.issueDate || !newVisa.expiryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const visa: Visa = {
      id: Date.now().toString(),
      country: newVisa.country!,
      visaType: newVisa.visaType!,
      visaNumber: '', // Keep empty for data safety
      issueDate: newVisa.issueDate!,
      expiryDate: newVisa.expiryDate!,
      showNumber: false
    };

    setVisas(prev => [...prev, visa]);
    setNewVisa({ showNumber: false });
    setIsAddingVisa(false);
    
    toast({
      title: "Visa Added",
      description: `${visa.country} visa has been added successfully.`,
    });
  };

  const addWorkingPermit = () => {
    if (!newPermit.country || !newPermit.permitType || !newPermit.issueDate || !newPermit.expiryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const permit: WorkingPermit = {
      id: Date.now().toString(),
      country: newPermit.country!,
      permitType: newPermit.permitType!,
      permitNumber: '', // Keep empty for data safety
      issueDate: newPermit.issueDate!,
      expiryDate: newPermit.expiryDate!,
      showNumber: false
    };

    setWorkingPermits(prev => [...prev, permit]);
    setNewPermit({ showNumber: false });
    setIsAddingPermit(false);
    
    toast({
      title: "Working Permit Added",
      description: `${permit.country} working permit has been added successfully.`,
    });
  };

  const removePassport = (id: string) => {
    setPassports(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Passport Removed",
      description: "Passport has been removed from your records.",
    });
  };

  const removeVisa = (id: string) => {
    setVisas(prev => prev.filter(v => v.id !== id));
    toast({
      title: "Visa Removed",
      description: "Visa has been removed from your records.",
    });
  };

  const removeWorkingPermit = (id: string) => {
    setWorkingPermits(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Working Permit Removed",
      description: "Working permit has been removed from your records.",
    });
  };

  const toggleNumberVisibility = (id: string) => {
    setPassports(prev => prev.map(p => 
      p.id === id ? { ...p, showNumber: !p.showNumber } : p
    ));
  };

  const toggleVisaNumberVisibility = (id: string) => {
    setVisas(prev => prev.map(v => 
      v.id === id ? { ...v, showNumber: !v.showNumber } : v
    ));
  };

  const togglePermitNumberVisibility = (id: string) => {
    setWorkingPermits(prev => prev.map(p => 
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

  const visaTypes = [
    'Tourist Visa', 'Business Visa', 'Student Visa', 'Work Visa', 'Transit Visa',
    'Family Visit Visa', 'Medical Visa', 'Conference Visa', 'Multiple Entry Visa'
  ];

  const permitTypes = [
    'Work Permit', 'Residence Permit', 'Temporary Work Authorization', 'Skilled Worker Visa',
    'Employer Sponsored Visa', 'Self-Employed Visa', 'Seasonal Work Permit'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Passports Section */}
      <Card>
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
                <p>Document information is stored locally on your device for privacy. You'll receive automatic reminders when documents need renewal (7 months and 1 month before expiry).</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visas Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-green-600" />
            Visa Manager
            {visas.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {visas.length} visa{visas.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Existing Visas */}
          {visas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                Your Visas
                <div className="h-px bg-gray-300 flex-1 ml-4"></div>
              </h3>
              <div className="grid gap-4">
                {visas.map(visa => {
                  const expiryStatus = getExpiryStatus(visa.expiryDate);
                  const daysUntilExpiry = getDaysUntilExpiry(visa.expiryDate);
                  
                  return (
                    <div key={visa.id} className="p-5 border-2 rounded-xl bg-gradient-to-r from-white to-green-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-xl text-gray-800">{visa.country}</h4>
                            <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                              {visa.visaType}
                            </Badge>
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
                          onClick={() => removeVisa(visa.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Issue Date</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold">{new Date(visa.issueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expiry Date</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold">{new Date(visa.expiryDate).toLocaleDateString()}</span>
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

          {visas.length > 0 && <Separator className="my-6" />}

          {/* Add New Visa */}
          {!isAddingVisa ? (
            <Button
              onClick={() => setIsAddingVisa(true)}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Visa
            </Button>
          ) : (
            <div className="space-y-6 p-6 border-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="font-bold text-xl text-gray-800">Add New Visa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="visaCountry" className="text-sm font-semibold text-gray-700">Country *</Label>
                  <Select
                    value={newVisa.country || ''}
                    onValueChange={(value) => setNewVisa(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger className="mt-2 h-12">
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
                  <Label htmlFor="visaType" className="text-sm font-semibold text-gray-700">Visa Type *</Label>
                  <Select
                    value={newVisa.visaType || ''}
                    onValueChange={(value) => setNewVisa(prev => ({ ...prev, visaType: value }))}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      {visaTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visaIssueDate" className="text-sm font-semibold text-gray-700">Issue Date *</Label>
                  <Input
                    id="visaIssueDate"
                    type="date"
                    className="mt-2 h-12"
                    value={newVisa.issueDate || ''}
                    onChange={(e) => setNewVisa(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="visaExpiryDate" className="text-sm font-semibold text-gray-700">Expiry Date *</Label>
                  <Input
                    id="visaExpiryDate"
                    type="date"
                    className="mt-2 h-12"
                    value={newVisa.expiryDate || ''}
                    onChange={(e) => setNewVisa(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={addVisa} size="lg" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Visa
                </Button>
                <Button 
                  onClick={() => {
                    setIsAddingVisa(false);
                    setNewVisa({ showNumber: false });
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
        </CardContent>
      </Card>

      {/* Working Permits Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="w-6 h-6 text-purple-600" />
            Working Permit Manager
            {workingPermits.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {workingPermits.length} permit{workingPermits.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Existing Working Permits */}
          {workingPermits.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                Your Working Permits
                <div className="h-px bg-gray-300 flex-1 ml-4"></div>
              </h3>
              <div className="grid gap-4">
                {workingPermits.map(permit => {
                  const expiryStatus = getExpiryStatus(permit.expiryDate);
                  const daysUntilExpiry = getDaysUntilExpiry(permit.expiryDate);
                  
                  return (
                    <div key={permit.id} className="p-5 border-2 rounded-xl bg-gradient-to-r from-white to-purple-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-xl text-gray-800">{permit.country}</h4>
                            <Badge className="bg-purple-600 text-white text-sm px-3 py-1">
                              {permit.permitType}
                            </Badge>
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
                          onClick={() => removeWorkingPermit(permit.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Issue Date</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold">{new Date(permit.issueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expiry Date</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold">{new Date(permit.expiryDate).toLocaleDateString()}</span>
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

          {workingPermits.length > 0 && <Separator className="my-6" />}

          {/* Add New Working Permit */}
          {!isAddingPermit ? (
            <Button
              onClick={() => setIsAddingPermit(true)}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Working Permit
            </Button>
          ) : (
            <div className="space-y-6 p-6 border-2 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
              <h3 className="font-bold text-xl text-gray-800">Add New Working Permit</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="permitCountry" className="text-sm font-semibold text-gray-700">Country *</Label>
                  <Select
                    value={newPermit.country || ''}
                    onValueChange={(value) => setNewPermit(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger className="mt-2 h-12">
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
                  <Label htmlFor="permitType" className="text-sm font-semibold text-gray-700">Permit Type *</Label>
                  <Select
                    value={newPermit.permitType || ''}
                    onValueChange={(value) => setNewPermit(prev => ({ ...prev, permitType: value }))}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select permit type" />
                    </SelectTrigger>
                    <SelectContent>
                      {permitTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="permitIssueDate" className="text-sm font-semibold text-gray-700">Issue Date *</Label>
                  <Input
                    id="permitIssueDate"
                    type="date"
                    className="mt-2 h-12"
                    value={newPermit.issueDate || ''}
                    onChange={(e) => setNewPermit(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="permitExpiryDate" className="text-sm font-semibold text-gray-700">Expiry Date *</Label>
                  <Input
                    id="permitExpiryDate"
                    type="date"
                    className="mt-2 h-12"
                    value={newPermit.expiryDate || ''}
                    onChange={(e) => setNewPermit(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={addWorkingPermit} size="lg" className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Working Permit
                </Button>
                <Button 
                  onClick={() => {
                    setIsAddingPermit(false);
                    setNewPermit({ showNumber: false });
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PassportManager;
