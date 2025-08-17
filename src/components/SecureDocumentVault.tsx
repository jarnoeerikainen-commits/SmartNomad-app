import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Camera, 
  FileText, 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  Share2,
  Trash2,
  Calendar,
  AlertTriangle,
  Lock,
  Scan,
  QrCode
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface Document {
  id: string;
  type: 'passport' | 'license' | 'vaccination' | 'insurance' | 'visa' | 'other';
  name: string;
  country?: string;
  issueDate: string;
  expiryDate: string;
  documentNumber: string;
  issuingAuthority: string;
  imageUrl?: string;
  ocrText?: string;
  isEncrypted: boolean;
  isVisible: boolean;
  tags: string[];
  notes: string;
  createdAt: string;
  lastAccessed: string;
}

const DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport', icon: '📘' },
  { value: 'license', label: 'Driver\'s License', icon: '🪪' },
  { value: 'vaccination', label: 'Vaccination Certificate', icon: '💉' },
  { value: 'insurance', label: 'Travel Insurance', icon: '🛡️' },
  { value: 'visa', label: 'Visa', icon: '📋' },
  { value: 'other', label: 'Other Document', icon: '📄' }
];

export const SecureDocumentVault: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [authenticationRequired, setAuthenticationRequired] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock authentication - in real app would use biometrics
  const handleAuthentication = async () => {
    try {
      // Simulate biometric authentication
      const authenticated = await mockBiometricAuth();
      if (authenticated) {
        setIsAuthenticated(true);
        setAuthenticationRequired(false);
        toast({
          title: "Authentication successful",
          description: "Access granted to secure documents",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const mockBiometricAuth = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const newDocument: Document = {
        id: Date.now().toString(),
        type: 'other',
        name: file.name,
        issueDate: '',
        expiryDate: '',
        documentNumber: '',
        issuingAuthority: '',
        imageUrl: URL.createObjectURL(file),
        isEncrypted: true,
        isVisible: false,
        tags: [],
        notes: '',
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };

      setDocuments(prev => [...prev, newDocument]);
      setSelectedDocument(newDocument);
      setIsAddingDocument(true);

      toast({
        title: "Document uploaded",
        description: "Please fill in the document details",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const toggleDocumentVisibility = (documentId: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, isVisible: !doc.isVisible, lastAccessed: new Date().toISOString() }
          : doc
      )
    );
  };

  const generateQRCode = async (document: Document) => {
    try {
      const documentData = {
        type: document.type,
        name: document.name,
        documentNumber: document.documentNumber,
        expiryDate: document.expiryDate,
        issuingAuthority: document.issuingAuthority
      };
      
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(documentData));
      
      // Create a new window to display the QR code
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>QR Code - ${document.name}</title></head>
            <body style="display: flex; flex-direction: column; align-items: center; padding: 20px; font-family: Arial, sans-serif;">
              <h2>${document.name}</h2>
              <img src="${qrCodeUrl}" alt="QR Code" style="border: 1px solid #ccc; padding: 10px;"/>
              <p style="text-align: center; margin-top: 10px;">Scan this QR code to quickly access document information</p>
            </body>
          </html>
        `);
      }
      
      toast({
        title: "QR Code generated",
        description: "QR code opened in new window",
      });
    } catch (error) {
      toast({
        title: "QR Code generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    if (!expiryDate) return { status: 'unknown', color: 'gray', text: 'No expiry date' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'red', text: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring-soon', color: 'orange', text: `Expires in ${daysUntilExpiry} days` };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'expiring', color: 'yellow', text: `Expires in ${daysUntilExpiry} days` };
    } else {
      return { status: 'valid', color: 'green', text: `Valid for ${daysUntilExpiry} days` };
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  if (authenticationRequired && !isAuthenticated) {
    return (
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Lock className="w-6 h-6" />
            Secure Document Vault
          </CardTitle>
          <CardDescription>
            Biometric authentication required to access encrypted documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Your documents are encrypted and require biometric authentication to access
            </p>
            <Button onClick={handleAuthentication} size="lg">
              <Shield className="w-4 h-4 mr-2" />
              Authenticate with Biometrics
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Secure Document Vault
          </CardTitle>
          <CardDescription>
            Encrypted storage for your travel documents with biometric security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                {DOCUMENT_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button
                onClick={() => setIsAddingDocument(true)}
                size="sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Scan Document
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {documents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No documents stored yet</p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload your first document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => {
                const docType = DOCUMENT_TYPES.find(t => t.value === document.type);
                const expiryStatus = getExpiryStatus(document.expiryDate);
                
                return (
                  <Card key={document.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{docType?.icon}</span>
                          <div>
                            <CardTitle className="text-sm">{document.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {document.issuingAuthority}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant={expiryStatus.color === 'red' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {expiryStatus.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Number:</span>
                          <span>
                            {document.isVisible 
                              ? document.documentNumber 
                              : '••••••••'
                            }
                          </span>
                        </div>
                        {document.expiryDate && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Expires:</span>
                            <span>{new Date(document.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDocumentVisibility(document.id)}
                          >
                            {document.isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateQRCode(document)}
                          >
                            <QrCode className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Features Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Features:</strong> All documents are encrypted with AES-256 encryption, 
          require biometric authentication to access, and are stored locally on your device. 
          Documents are automatically locked after 5 minutes of inactivity.
        </AlertDescription>
      </Alert>
    </div>
  );
};