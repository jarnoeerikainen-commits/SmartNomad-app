
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, CheckCircle, Edit, Trash2, Plus, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Passport {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  type: 'regular' | 'diplomatic' | 'service' | 'emergency';
  status: 'active' | 'expired' | 'renewed';
}

const PASSPORT_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' }
];

const PassportManager: React.FC = () => {
  const [passports, setPassports] = useState<Passport[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    countryCode: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    type: 'regular' as const
  });

  useEffect(() => {
    loadPassports();
    checkExpiryAlerts();
  }, [passports]);

  const loadPassports = () => {
    const stored = localStorage.getItem('passports');
    if (stored) {
      setPassports(JSON.parse(stored));
    }
  };

  const savePassports = (newPassports: Passport[]) => {
    localStorage.setItem('passports', JSON.stringify(newPassports));
    setPassports(newPassports);
  };

  const checkExpiryAlerts = () => {
    const now = new Date();
    const sevenMonthsFromNow = new Date();
    sevenMonthsFromNow.setMonth(now.getMonth() + 7);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    const newAlerts = passports.map(passport => {
      const expiryDate = new Date(passport.expiryDate);
      const monthsUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (expiryDate < now) {
        return {
          id: passport.id,
          type: 'expired',
          message: `${passport.flag} ${passport.countryName} passport has expired!`,
          severity: 'critical'
        };
      } else if (monthsUntilExpiry <= 1) {
        return {
          id: passport.id,
          type: 'expiring_soon',
          message: `${passport.flag} ${passport.countryName} passport expires in ${Math.ceil(monthsUntilExpiry * 30)} days`,
          severity: 'high'
        };
      } else if (monthsUntilExpiry <= 7) {
        return {
          id: passport.id,
          type: 'expiring_warning',
          message: `${passport.flag} ${passport.countryName} passport expires in ${Math.ceil(monthsUntilExpiry)} months`,
          severity: 'medium'
        };
      }
      return null;
    }).filter(Boolean);

    setAlerts(newAlerts);

    // Show toast notifications for critical alerts
    newAlerts.forEach(alert => {
      if (alert.severity === 'critical' || alert.severity === 'high') {
        toast({
          title: "Passport Alert",
          description: alert.message,
          variant: alert.severity === 'critical' ? 'destructive' : 'default'
        });
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.countryCode || !formData.expiryDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedCountry = PASSPORT_COUNTRIES.find(c => c.code === formData.countryCode);
    if (!selectedCountry) return;

    const passport: Passport = {
      id: editingId || Date.now().toString(),
      countryCode: formData.countryCode,
      countryName: selectedCountry.name,
      flag: selectedCountry.flag,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      issuingAuthority: formData.issuingAuthority,
      type: formData.type,
      status: new Date(formData.expiryDate) > new Date() ? 'active' : 'expired'
    };

    let newPassports;
    if (editingId) {
      newPassports = passports.map(p => p.id === editingId ? passport : p);
    } else {
      newPassports = [...passports, passport];
    }

    savePassports(newPassports);
    resetForm();
    
    toast({
      title: "Success",
      description: `Passport ${editingId ? 'updated' : 'added'} successfully`,
    });
  };

  const resetForm = () => {
    setFormData({
      countryCode: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      type: 'regular'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (passport: Passport) => {
    setFormData({
      countryCode: passport.countryCode,
      issueDate: passport.issueDate,
      expiryDate: passport.expiryDate,
      issuingAuthority: passport.issuingAuthority,
      type: passport.type
    });
    setEditingId(passport.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const newPassports = passports.filter(p => p.id !== id);
    savePassports(newPassports);
    toast({
      title: "Success",
      description: "Passport deleted successfully",
    });
  };

  const getExpiryStatus = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const monthsUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (expiry < now) {
      return { status: 'Expired', variant: 'destructive' as const, icon: AlertTriangle };
    } else if (monthsUntilExpiry <= 6) {
      return { status: 'Renew Soon', variant: 'secondary' as const, icon: AlertTriangle };
    } else {
      return { status: 'Valid', variant: 'default' as const, icon: CheckCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Passport Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add'} Passport</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PASSPORT_COUNTRIES.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Passport Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
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

                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="authority">Issuing Authority</Label>
                  <Input
                    id="authority"
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({...formData, issuingAuthority: e.target.value})}
                    placeholder="e.g., U.S. Department of State"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Update' : 'Add'} Passport
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Passports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              My Passports ({passports.length})
            </CardTitle>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Passport
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {passports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No passports added yet. Click "Add Passport" to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passports.map((passport) => {
                const expiryStatus = getExpiryStatus(passport.expiryDate);
                const StatusIcon = expiryStatus.icon;

                return (
                  <div key={passport.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{passport.flag}</div>
                        <div>
                          <h3 className="font-semibold">{passport.countryName}</h3>
                          <p className="text-sm text-gray-600 capitalize">{passport.type} Passport</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={expiryStatus.variant} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {expiryStatus.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Expires: {new Date(passport.expiryDate).toLocaleDateString()}</span>
                      </div>
                      {passport.issueDate && (
                        <div className="text-gray-600">
                          Issued: {new Date(passport.issueDate).toLocaleDateString()}
                        </div>
                      )}
                      {passport.issuingAuthority && (
                        <div className="text-gray-600">
                          Authority: {passport.issuingAuthority}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleEdit(passport)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(passport.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Travel Reminder</p>
              <p>Many countries require your passport to be valid for at least 6 months from your entry date. We'll alert you 7 months and 1 month before expiry to ensure you have time to renew.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PassportManager;
