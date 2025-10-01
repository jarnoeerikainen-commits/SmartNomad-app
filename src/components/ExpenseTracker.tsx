
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Receipt, Plus, CreditCard, Car, FileText, 
  Upload, Calculator, DollarSign, Camera
} from 'lucide-react';
import { Expense, DailyAllowance } from '@/types/expense';
import { useToast } from '@/hooks/use-toast';
import ExpenseService from '@/services/ExpenseService';

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'meal',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Business Travel',
    country_code: 'US',
    vendor: '',
    payment_method: 'Credit Card',
    distance: '',
    unit: 'km'
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateMileageAmount = () => {
    if (formData.type === 'mileage' && formData.distance && formData.country_code) {
      const distance = parseFloat(formData.distance);
      const amount = ExpenseService.calculateMileageExpense(
        distance, 
        formData.country_code, 
        formData.unit as 'km' | 'mile'
      );
      setFormData(prev => ({ ...prev, amount: amount.toFixed(2) }));
    }
  };

  const addDailyAllowance = (countryCode: string) => {
    const allowance = ExpenseService.getDailyAllowance(countryCode);
    if (allowance) {
      const expense: Expense = {
        id: Date.now().toString(),
        country_code: countryCode,
        type: 'daily_allowance',
        amount: allowance.daily_rate_usd,
        currency: 'USD',
        date: formData.date,
        description: `Daily allowance for ${allowance.country_name}`,
        category: 'Daily Allowance',
        is_business: true,
        created_at: new Date().toISOString()
      };

      setExpenses(prev => [...prev, expense]);
      toast({
        title: "Daily Allowance Added",
        description: `$${allowance.daily_rate_usd} added for ${allowance.country_name}`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expense: Expense = {
      id: Date.now().toString(),
      country_code: formData.country_code,
      type: formData.type as any,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: formData.date,
      description: formData.description,
      category: formData.category,
      vendor: formData.vendor,
      payment_method: formData.payment_method,
      receipt_image: selectedImage || undefined,
      is_business: true,
      created_at: new Date().toISOString()
    };

    setExpenses(prev => [...prev, expense]);
    resetForm();
    
    toast({
      title: "Expense Added",
      description: `${formData.type} expense of ${formData.currency} ${formData.amount} added successfully.`,
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'meal',
      amount: '',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Business Travel',
      country_code: 'US',
      vendor: '',
      payment_method: 'Credit Card',
      distance: '',
      unit: 'km'
    });
    setSelectedImage(null);
    setIsAddModalOpen(false);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesByType = () => {
    return expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  };

  const generateTaxReport = () => {
    const report = ExpenseService.generateExpenseReport(
      expenses,
      expenses[0]?.date || new Date().toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );
    
    toast({
      title: "Tax Report Generated",
      description: `Total: $${report.total_expenses.toFixed(2)} across ${report.expense_count} expenses`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Business Expense Tracker
        </h3>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button onClick={generateTaxReport} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Tax Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${getTotalExpenses().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Receipt className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Receipts</p>
                <p className="text-2xl font-bold">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tax Deductible</p>
                <p className="text-2xl font-bold">${getTotalExpenses().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ExpenseService.getAllDailyAllowances().slice(0, 4).map((allowance) => (
              <Button
                key={allowance.country_code}
                variant="outline"
                size="sm"
                onClick={() => addDailyAllowance(allowance.country_code)}
                className="flex flex-col gap-1 h-auto py-2"
              >
                <span className="text-xs font-medium">{allowance.country_name}</span>
                <span className="text-xs text-muted-foreground">${allowance.daily_rate_usd}/day</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No expenses recorded yet. Add your first expense to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(-5).reverse().map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {expense.type === 'mileage' ? <Car className="w-5 h-5 text-blue-600" /> : 
                       expense.receipt_image ? <Camera className="w-5 h-5 text-blue-600" /> :
                       <Receipt className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.date} • {expense.vendor || expense.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{expense.currency} {expense.amount.toFixed(2)}</p>
                    <Badge variant="secondary" className="text-xs">
                      {expense.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Business Expense</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expense Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="meal">Meal</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="mileage">Mileage</SelectItem>
                    <SelectItem value="daily_allowance">Daily Allowance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={formData.country_code} onValueChange={(value) => setFormData(prev => ({ ...prev, country_code: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">🇺🇸 United States</SelectItem>
                    <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                    <SelectItem value="FR">🇫🇷 France</SelectItem>
                    <SelectItem value="JP">🇯🇵 Japan</SelectItem>
                    <SelectItem value="SG">🇸🇬 Singapore</SelectItem>
                    <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === 'mileage' && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Distance</Label>
                  <Input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers</SelectItem>
                      <SelectItem value="mile">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button type="button" onClick={calculateMileageAmount} className="w-full">
                    Calculate
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Business dinner with client, Flight to conference, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor/Company</Label>
                <Input
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  placeholder="Airline, Hotel, Restaurant"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Company Card">Company Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Receipt Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Scan Receipt
                </Button>
              </div>
              {selectedImage && (
                <img src={selectedImage} alt="Receipt" className="w-32 h-32 object-cover rounded border" />
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gradient-success text-primary-foreground">
                Add Expense
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseTracker;
