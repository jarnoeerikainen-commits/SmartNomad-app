import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { PassportInfo } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

const PassportManager: React.FC = () => {
  const [passports, setPassports] = useState<PassportInfo[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPassport, setEditingPassport] = useState<PassportInfo | null>(null);
  const [formData, setFormData] = useState({
    passportNumber: '',
    issueDate: '',
    expiryDate: '',
    issuingCountry: '',
    holderName: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedPassports = localStorage.getItem('passports');
    if (savedPassports) {
      setPassports(JSON.parse(savedPassports));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('passports', JSON.stringify(passports));
    checkExpiryAlerts();
  }, [passports]);

  const checkExpiryAlerts = () => {
    const now = new Date();
    passports.forEach(passport => {
      const expiryDate = new Date(passport.expiryDate);
      const monthsUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsUntilExpiry <= 1 && monthsUntilExpiry > 0) {
        toast({
          title: "🚨 Passport Expiring Soon!",
          description: `${passport.holderName}'s passport expires in ${Math.ceil(monthsUntilExpiry)} month(s). Renew immediately!`,
          variant: "destructive"
        });
      } else if (monthsUntilExpiry <= 7 && monthsUntilExpiry > 1) {
        toast({
          title: "⚠️ Passport Renewal Reminder",
          description: `${passport.holderName}'s passport expires in ${Math.ceil(monthsUntilExpiry)} months. Start renewal process soon.`,
        });
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passportData: PassportInfo = {
      id: editingPassport?.id || Date.now().toString(),
      ...formData
    };

    if (editingPassport) {
      setPassports(prev => prev.map(p => p.id === editingPassport.id ? passportData : p));
      toast({
        title: "Passport Updated",
        description: "Passport information has been successfully updated.",
      });
    } else {
      setPassports(prev => [...prev, passportData]);
      toast({
        title: "Passport Added",
        description: "New passport has been added to your profile.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      passportNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingCountry: '',
      holderName: ''
    });
    setEditingPassport(null);
    setIsAddModalOpen(false);
  };

  const handleEdit = (passport: PassportInfo) => {
    setFormData({
      passportNumber: passport.passportNumber,
      issueDate: passport.issueDate,
      expiryDate: passport.expiryDate,
      issuingCountry: passport.issuingCountry,
      holderName: passport.holderName
    });
    setEditingPassport(passport);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPassports(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Passport Removed",
      description: "Passport has been removed from your profile.",
    });
  };

  const getExpiryStatus = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const monthsUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsUntilExpiry <= 0) {
      return { status: 'expired', color: 'bg-red-500', text: 'Expired' };
    } else if (monthsUntilExpiry <= 1) {
      return { status: 'critical', color: 'bg-red-500', text: 'Expires Soon' };
    } else if (monthsUntilExpiry <= 6) {
      return { status: 'warning', color: 'bg-orange-500', text: 'Renewal Needed' };
    } else if (monthsUntilExpiry <= 7) {
      return { status: 'caution', color: 'bg-yellow-500', text: 'Plan Renewal' };
    }
    return { status: 'valid', color: 'bg-green-500', text: 'Valid' };
  };

  const maskPassportNumber = (number: string) => {
    if (number.length <= 4) return number;
    return '*'.repeat(number.length - 4) + number.slice(-4);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Passport Manager
        </h3>
        <Button onClick={() => setIsAddModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Passport
        </Button>
      </div>

      {passports.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No passports added yet</p>
            <Button onClick={() => setIsAddModalOpen(true)} variant="outline">
              Add Your First Passport
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passports.map(passport => {
            const expiryStatus = getExpiryStatus(passport.expiryDate);
            return (
              <Card key={passport.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{passport.holderName}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(passport)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(passport.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className={`${expiryStatus.color} text-white w-fit`}>
                    {expiryStatus.text}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Country:</span> {passport.issuingCountry}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Number:</span> {maskPassportNumber(passport.passportNumber)}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Expires:</span> {new Date(passport.expiryDate).toLocaleDateString()}
                  </div>
                  {expiryStatus.status !== 'valid' && (
                    <div className="flex items-center gap-2 mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-700">
                        Action required for travel
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPassport ? 'Edit Passport' : 'Add Passport'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="holderName">Full Name</Label>
              <Input
                id="holderName"
                value={formData.holderName}
                onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
                placeholder="As shown on passport"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuingCountry">Issuing Country</Label>
              <Input
                id="issuingCountry"
                value={formData.issuingCountry}
                onChange={(e) => setFormData(prev => ({ ...prev, issuingCountry: e.target.value }))}
                placeholder="e.g., United States"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
                placeholder="Passport number"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gradient-success text-white">
                {editingPassport ? 'Update' : 'Add'} Passport
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PassportManager;
