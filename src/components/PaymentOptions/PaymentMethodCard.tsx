import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Star, Trash2, Edit, Shield, Eye, EyeOff } from 'lucide-react';
import { PaymentMethod, PAYMENT_METHOD_CONFIG, CRYPTO_CONFIG } from './types';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onToggleActive: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (method: PaymentMethod) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method, onToggleActive, onSetDefault, onDelete, onEdit
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const config = PAYMENT_METHOD_CONFIG[method.type];

  const getMaskedInfo = () => {
    if (method.lastFour) return `•••• •••• •••• ${method.lastFour}`;
    if (method.email) return showDetails ? method.email : `${method.email.slice(0, 3)}•••@•••`;
    if (method.walletAddress) {
      if (showDetails) return method.walletAddress;
      return `${method.walletAddress.slice(0, 6)}••••${method.walletAddress.slice(-4)}`;
    }
    if (method.iban) return showDetails ? method.iban : `${method.iban.slice(0, 4)} •••• •••• ${method.iban.slice(-4)}`;
    return '';
  };

  return (
    <Card className={`transition-all hover:shadow-md border-2 ${method.isDefault ? 'border-primary shadow-md' : 'border-transparent'} ${!method.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${config.bgClass} shrink-0`}>
              {config.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">{config.label}</span>
                {method.isDefault && (
                  <Badge variant="default" className="text-xs gap-1">
                    <Star className="h-3 w-3" /> Default
                  </Badge>
                )}
                {method.cryptoType && (
                  <Badge variant="outline" className="text-xs">
                    {CRYPTO_CONFIG[method.cryptoType].symbol}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground font-mono">{getMaskedInfo()}</span>
                <button onClick={() => setShowDetails(!showDetails)} className="text-muted-foreground hover:text-foreground">
                  {showDetails ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {method.holderName && (
                <p className="text-xs text-muted-foreground mt-0.5">{method.holderName}</p>
              )}
              {method.expiryDate && (
                <p className="text-xs text-muted-foreground">Exp: {method.expiryDate}</p>
              )}
              {method.bankName && (
                <p className="text-xs text-muted-foreground">{method.bankName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Encrypted</span>
            </div>
            <Switch checked={method.isActive} onCheckedChange={() => onToggleActive(method.id)} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSetDefault(method.id)}>
                  <Star className="h-4 w-4 mr-2" /> Set as Default
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(method)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(method.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
