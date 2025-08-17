import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  country: string;
  isPrimary: boolean;
  type: 'personal' | 'embassy' | 'medical' | 'legal';
}

const CONTACT_TYPES = [
  { value: 'personal', label: 'Personal Contact', icon: '👤' },
  { value: 'embassy', label: 'Embassy/Consulate', icon: '🏛️' },
  { value: 'medical', label: 'Medical Emergency', icon: '🏥' },
  { value: 'legal', label: 'Legal Assistance', icon: '⚖️' }
];

export const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Emergency Services',
      relationship: 'Local Emergency',
      phone: '112',
      email: '',
      country: 'EU',
      isPrimary: true,
      type: 'medical'
    }
  ]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    country: '',
    type: 'personal' as EmergencyContact['type']
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      country: '',
      type: 'personal'
    });
  };

  const handleSaveContact = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Name and phone number are required",
        variant: "destructive",
      });
      return;
    }

    const contactData: EmergencyContact = {
      id: editingContact?.id || Date.now().toString(),
      ...formData,
      isPrimary: false
    };

    if (editingContact) {
      setContacts(prev => prev.map(contact => 
        contact.id === editingContact.id ? contactData : contact
      ));
      toast({
        title: "Contact updated",
        description: "Emergency contact has been updated successfully",
      });
    } else {
      setContacts(prev => [...prev, contactData]);
      toast({
        title: "Contact added",
        description: "Emergency contact has been added successfully",
      });
    }

    resetForm();
    setIsAddingContact(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
    toast({
      title: "Contact deleted",
      description: "Emergency contact has been removed",
    });
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email,
      country: contact.country,
      type: contact.type
    });
    setEditingContact(contact);
    setIsAddingContact(true);
  };

  const makeCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Emergency Contacts
        </CardTitle>
        <CardDescription>
          Quick access to important contacts while traveling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No emergency contacts added yet</p>
              <Button onClick={() => setIsAddingContact(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Emergency Contact
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {contacts.map((contact) => {
                  const contactType = CONTACT_TYPES.find(t => t.value === contact.type);
                  return (
                    <Card key={contact.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{contactType?.icon}</span>
                              <h3 className="font-semibold">{contact.name}</h3>
                              {contact.isPrimary && (
                                <Badge variant="secondary">Primary</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {contact.relationship}
                            </p>
                            {contact.country && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                <MapPin className="w-3 h-3" />
                                {contact.country}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => makeCall(contact.phone)}
                                className="text-xs"
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                {contact.phone}
                              </Button>
                              {contact.email && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => sendEmail(contact.email)}
                                  className="text-xs"
                                >
                                  {contact.email}
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContact(contact)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            {!contact.isPrimary && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <Button 
                onClick={() => setIsAddingContact(true)}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Emergency Contact
              </Button>
            </>
          )}
        </div>

        <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </DialogTitle>
              <DialogDescription>
                Add important contacts for emergency situations
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact-type">Contact Type</Label>
                <select
                  id="contact-type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EmergencyContact['type'] }))}
                  className="w-full p-2 border rounded-md"
                >
                  {CONTACT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship/Role</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                  placeholder="e.g., Family member, Embassy staff"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Country or region"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveContact} className="flex-1">
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingContact(false);
                    setEditingContact(null);
                    resetForm();
                  }}
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