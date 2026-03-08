import React, { useState, useMemo } from 'react';
import { Phone, AlertCircle, Search, X, Copy, Check, MapPin, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/contexts/LocationContext';

interface EmergencyNumber {
  country: string;
  countryCode: string;
  flag: string;
  police: string;
  ambulance: string;
  fire: string;
  general?: string;
  region: string;
}

const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  // ═══ EUROPE ═══
  { country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Europe' },
  { country: 'Germany', countryCode: 'DE', flag: '🇩🇪', police: '110', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'France', countryCode: 'FR', flag: '🇫🇷', police: '17', ambulance: '15', fire: '18', general: '112', region: 'Europe' },
  { country: 'Spain', countryCode: 'ES', flag: '🇪🇸', police: '091', ambulance: '061', fire: '080', general: '112', region: 'Europe' },
  { country: 'Italy', countryCode: 'IT', flag: '🇮🇹', police: '113', ambulance: '118', fire: '115', general: '112', region: 'Europe' },
  { country: 'Netherlands', countryCode: 'NL', flag: '🇳🇱', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Belgium', countryCode: 'BE', flag: '🇧🇪', police: '101', ambulance: '100', fire: '100', general: '112', region: 'Europe' },
  { country: 'Switzerland', countryCode: 'CH', flag: '🇨🇭', police: '117', ambulance: '144', fire: '118', general: '112', region: 'Europe' },
  { country: 'Austria', countryCode: 'AT', flag: '🇦🇹', police: '133', ambulance: '144', fire: '122', general: '112', region: 'Europe' },
  { country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Greece', countryCode: 'GR', flag: '🇬🇷', police: '100', ambulance: '166', fire: '199', general: '112', region: 'Europe' },
  { country: 'Poland', countryCode: 'PL', flag: '🇵🇱', police: '997', ambulance: '999', fire: '998', general: '112', region: 'Europe' },
  { country: 'Czech Republic', countryCode: 'CZ', flag: '🇨🇿', police: '158', ambulance: '155', fire: '150', general: '112', region: 'Europe' },
  { country: 'Ireland', countryCode: 'IE', flag: '🇮🇪', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Europe' },
  { country: 'Denmark', countryCode: 'DK', flag: '🇩🇰', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Sweden', countryCode: 'SE', flag: '🇸🇪', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Norway', countryCode: 'NO', flag: '🇳🇴', police: '112', ambulance: '113', fire: '110', general: '112', region: 'Europe' },
  { country: 'Finland', countryCode: 'FI', flag: '🇫🇮', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Croatia', countryCode: 'HR', flag: '🇭🇷', police: '192', ambulance: '194', fire: '193', general: '112', region: 'Europe' },
  { country: 'Romania', countryCode: 'RO', flag: '🇷🇴', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Hungary', countryCode: 'HU', flag: '🇭🇺', police: '107', ambulance: '104', fire: '105', general: '112', region: 'Europe' },
  { country: 'Iceland', countryCode: 'IS', flag: '🇮🇸', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Luxembourg', countryCode: 'LU', flag: '🇱🇺', police: '113', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Malta', countryCode: 'MT', flag: '🇲🇹', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Cyprus', countryCode: 'CY', flag: '🇨🇾', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Estonia', countryCode: 'EE', flag: '🇪🇪', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Latvia', countryCode: 'LV', flag: '🇱🇻', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Lithuania', countryCode: 'LT', flag: '🇱🇹', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Slovenia', countryCode: 'SI', flag: '🇸🇮', police: '113', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Slovakia', countryCode: 'SK', flag: '🇸🇰', police: '158', ambulance: '155', fire: '150', general: '112', region: 'Europe' },
  { country: 'Bulgaria', countryCode: 'BG', flag: '🇧🇬', police: '166', ambulance: '150', fire: '160', general: '112', region: 'Europe' },
  { country: 'Serbia', countryCode: 'RS', flag: '🇷🇸', police: '192', ambulance: '194', fire: '193', general: '112', region: 'Europe' },
  { country: 'Montenegro', countryCode: 'ME', flag: '🇲🇪', police: '122', ambulance: '124', fire: '123', general: '112', region: 'Europe' },
  { country: 'North Macedonia', countryCode: 'MK', flag: '🇲🇰', police: '192', ambulance: '194', fire: '193', general: '112', region: 'Europe' },
  { country: 'Bosnia and Herzegovina', countryCode: 'BA', flag: '🇧🇦', police: '122', ambulance: '124', fire: '123', general: '112', region: 'Europe' },
  { country: 'Albania', countryCode: 'AL', flag: '🇦🇱', police: '129', ambulance: '127', fire: '128', general: '112', region: 'Europe' },
  { country: 'Kosovo', countryCode: 'XK', flag: '🇽🇰', police: '192', ambulance: '194', fire: '193', general: '112', region: 'Europe' },
  { country: 'Moldova', countryCode: 'MD', flag: '🇲🇩', police: '902', ambulance: '903', fire: '901', general: '112', region: 'Europe' },
  { country: 'Russia', countryCode: 'RU', flag: '🇷🇺', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Europe' },
  { country: 'Ukraine', countryCode: 'UA', flag: '🇺🇦', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Europe' },
  { country: 'Belarus', countryCode: 'BY', flag: '🇧🇾', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Europe' },
  { country: 'Georgia', countryCode: 'GE', flag: '🇬🇪', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Europe' },
  { country: 'Armenia', countryCode: 'AM', flag: '🇦🇲', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Europe' },
  { country: 'Azerbaijan', countryCode: 'AZ', flag: '🇦🇿', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Europe' },
  { country: 'Monaco', countryCode: 'MC', flag: '🇲🇨', police: '17', ambulance: '15', fire: '18', general: '112', region: 'Europe' },
  { country: 'Liechtenstein', countryCode: 'LI', flag: '🇱🇮', police: '117', ambulance: '144', fire: '118', general: '112', region: 'Europe' },
  { country: 'Andorra', countryCode: 'AD', flag: '🇦🇩', police: '110', ambulance: '116', fire: '118', general: '112', region: 'Europe' },
  { country: 'San Marino', countryCode: 'SM', flag: '🇸🇲', police: '112', ambulance: '118', fire: '115', general: '112', region: 'Europe' },

  // ═══ NORTH AMERICA ═══
  { country: 'United States', countryCode: 'US', flag: '🇺🇸', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Canada', countryCode: 'CA', flag: '🇨🇦', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Guatemala', countryCode: 'GT', flag: '🇬🇹', police: '110', ambulance: '128', fire: '122', general: '110', region: 'North America' },
  { country: 'Belize', countryCode: 'BZ', flag: '🇧🇿', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Honduras', countryCode: 'HN', flag: '🇭🇳', police: '199', ambulance: '195', fire: '198', general: '911', region: 'North America' },
  { country: 'El Salvador', countryCode: 'SV', flag: '🇸🇻', police: '911', ambulance: '911', fire: '913', general: '911', region: 'North America' },
  { country: 'Nicaragua', countryCode: 'NI', flag: '🇳🇮', police: '118', ambulance: '128', fire: '115', region: 'North America' },
  { country: 'Costa Rica', countryCode: 'CR', flag: '🇨🇷', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Panama', countryCode: 'PA', flag: '🇵🇦', police: '104', ambulance: '911', fire: '103', general: '911', region: 'North America' },
  { country: 'Cuba', countryCode: 'CU', flag: '🇨🇺', police: '106', ambulance: '104', fire: '105', region: 'North America' },
  { country: 'Jamaica', countryCode: 'JM', flag: '🇯🇲', police: '119', ambulance: '110', fire: '110', general: '119', region: 'North America' },
  { country: 'Haiti', countryCode: 'HT', flag: '🇭🇹', police: '114', ambulance: '116', fire: '115', region: 'North America' },
  { country: 'Dominican Republic', countryCode: 'DO', flag: '🇩🇴', police: '911', ambulance: '911', fire: '911', general: '911', region: 'North America' },
  { country: 'Trinidad and Tobago', countryCode: 'TT', flag: '🇹🇹', police: '999', ambulance: '990', fire: '990', general: '999', region: 'North America' },
  { country: 'Barbados', countryCode: 'BB', flag: '🇧🇧', police: '211', ambulance: '511', fire: '311', general: '211', region: 'North America' },
  { country: 'Bahamas', countryCode: 'BS', flag: '🇧🇸', police: '919', ambulance: '919', fire: '919', general: '919', region: 'North America' },

  // ═══ SOUTH AMERICA ═══
  { country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', police: '190', ambulance: '192', fire: '193', region: 'South America' },
  { country: 'Argentina', countryCode: 'AR', flag: '🇦🇷', police: '911', ambulance: '107', fire: '100', general: '911', region: 'South America' },
  { country: 'Chile', countryCode: 'CL', flag: '🇨🇱', police: '133', ambulance: '131', fire: '132', region: 'South America' },
  { country: 'Colombia', countryCode: 'CO', flag: '🇨🇴', police: '112', ambulance: '125', fire: '119', general: '123', region: 'South America' },
  { country: 'Peru', countryCode: 'PE', flag: '🇵🇪', police: '105', ambulance: '116', fire: '116', region: 'South America' },
  { country: 'Venezuela', countryCode: 'VE', flag: '🇻🇪', police: '171', ambulance: '171', fire: '171', general: '911', region: 'South America' },
  { country: 'Ecuador', countryCode: 'EC', flag: '🇪🇨', police: '911', ambulance: '911', fire: '911', general: '911', region: 'South America' },
  { country: 'Bolivia', countryCode: 'BO', flag: '🇧🇴', police: '110', ambulance: '118', fire: '119', region: 'South America' },
  { country: 'Paraguay', countryCode: 'PY', flag: '🇵🇾', police: '911', ambulance: '141', fire: '132', general: '911', region: 'South America' },
  { country: 'Uruguay', countryCode: 'UY', flag: '🇺🇾', police: '911', ambulance: '105', fire: '104', general: '911', region: 'South America' },
  { country: 'Guyana', countryCode: 'GY', flag: '🇬🇾', police: '911', ambulance: '913', fire: '912', general: '911', region: 'South America' },
  { country: 'Suriname', countryCode: 'SR', flag: '🇸🇷', police: '115', ambulance: '113', fire: '110', region: 'South America' },

  // ═══ ASIA PACIFIC ═══
  { country: 'Australia', countryCode: 'AU', flag: '🇦🇺', police: '000', ambulance: '000', fire: '000', general: '000', region: 'Asia Pacific' },
  { country: 'New Zealand', countryCode: 'NZ', flag: '🇳🇿', police: '111', ambulance: '111', fire: '111', general: '111', region: 'Asia Pacific' },
  { country: 'Japan', countryCode: 'JP', flag: '🇯🇵', police: '110', ambulance: '119', fire: '119', region: 'Asia Pacific' },
  { country: 'South Korea', countryCode: 'KR', flag: '🇰🇷', police: '112', ambulance: '119', fire: '119', general: '112', region: 'Asia Pacific' },
  { country: 'China', countryCode: 'CN', flag: '🇨🇳', police: '110', ambulance: '120', fire: '119', region: 'Asia Pacific' },
  { country: 'India', countryCode: 'IN', flag: '🇮🇳', police: '100', ambulance: '102', fire: '101', general: '112', region: 'Asia Pacific' },
  { country: 'Thailand', countryCode: 'TH', flag: '🇹🇭', police: '191', ambulance: '1669', fire: '199', general: '1155', region: 'Asia Pacific' },
  { country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', police: '999', ambulance: '995', fire: '995', general: '999', region: 'Asia Pacific' },
  { country: 'Malaysia', countryCode: 'MY', flag: '🇲🇾', police: '999', ambulance: '999', fire: '994', general: '999', region: 'Asia Pacific' },
  { country: 'Indonesia', countryCode: 'ID', flag: '🇮🇩', police: '110', ambulance: '118', fire: '113', general: '112', region: 'Asia Pacific' },
  { country: 'Philippines', countryCode: 'PH', flag: '🇵🇭', police: '117', ambulance: '911', fire: '911', general: '911', region: 'Asia Pacific' },
  { country: 'Vietnam', countryCode: 'VN', flag: '🇻🇳', police: '113', ambulance: '115', fire: '114', region: 'Asia Pacific' },
  { country: 'Taiwan', countryCode: 'TW', flag: '🇹🇼', police: '110', ambulance: '119', fire: '119', region: 'Asia Pacific' },
  { country: 'Hong Kong', countryCode: 'HK', flag: '🇭🇰', police: '999', ambulance: '999', fire: '999', general: '999', region: 'Asia Pacific' },
  { country: 'Pakistan', countryCode: 'PK', flag: '🇵🇰', police: '15', ambulance: '115', fire: '16', general: '1122', region: 'Asia Pacific' },
  { country: 'Bangladesh', countryCode: 'BD', flag: '🇧🇩', police: '999', ambulance: '999', fire: '999', general: '999', region: 'Asia Pacific' },
  { country: 'Sri Lanka', countryCode: 'LK', flag: '🇱🇰', police: '119', ambulance: '110', fire: '110', general: '118', region: 'Asia Pacific' },
  { country: 'Cambodia', countryCode: 'KH', flag: '🇰🇭', police: '117', ambulance: '119', fire: '118', region: 'Asia Pacific' },
  { country: 'Myanmar', countryCode: 'MM', flag: '🇲🇲', police: '199', ambulance: '192', fire: '191', region: 'Asia Pacific' },
  { country: 'Laos', countryCode: 'LA', flag: '🇱🇦', police: '191', ambulance: '195', fire: '190', region: 'Asia Pacific' },
  { country: 'Nepal', countryCode: 'NP', flag: '🇳🇵', police: '100', ambulance: '102', fire: '101', general: '100', region: 'Asia Pacific' },
  { country: 'Mongolia', countryCode: 'MN', flag: '🇲🇳', police: '102', ambulance: '103', fire: '101', region: 'Asia Pacific' },
  { country: 'Maldives', countryCode: 'MV', flag: '🇲🇻', police: '119', ambulance: '102', fire: '118', region: 'Asia Pacific' },
  { country: 'Bhutan', countryCode: 'BT', flag: '🇧🇹', police: '113', ambulance: '112', fire: '110', region: 'Asia Pacific' },
  { country: 'Fiji', countryCode: 'FJ', flag: '🇫🇯', police: '917', ambulance: '911', fire: '910', general: '917', region: 'Asia Pacific' },
  { country: 'Papua New Guinea', countryCode: 'PG', flag: '🇵🇬', police: '112', ambulance: '111', fire: '110', region: 'Asia Pacific' },
  { country: 'Kazakhstan', countryCode: 'KZ', flag: '🇰🇿', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Asia Pacific' },
  { country: 'Uzbekistan', countryCode: 'UZ', flag: '🇺🇿', police: '102', ambulance: '103', fire: '101', region: 'Asia Pacific' },
  { country: 'Kyrgyzstan', countryCode: 'KG', flag: '🇰🇬', police: '102', ambulance: '103', fire: '101', general: '112', region: 'Asia Pacific' },
  { country: 'Tajikistan', countryCode: 'TJ', flag: '🇹🇯', police: '102', ambulance: '103', fire: '101', region: 'Asia Pacific' },
  { country: 'Turkmenistan', countryCode: 'TM', flag: '🇹🇲', police: '02', ambulance: '03', fire: '01', region: 'Asia Pacific' },

  // ═══ MIDDLE EAST ═══
  { country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', police: '999', ambulance: '998', fire: '997', general: '112', region: 'Middle East' },
  { country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦', police: '999', ambulance: '997', fire: '998', general: '911', region: 'Middle East' },
  { country: 'Qatar', countryCode: 'QA', flag: '🇶🇦', police: '999', ambulance: '999', fire: '999', general: '999', region: 'Middle East' },
  { country: 'Kuwait', countryCode: 'KW', flag: '🇰🇼', police: '112', ambulance: '112', fire: '112', general: '112', region: 'Middle East' },
  { country: 'Bahrain', countryCode: 'BH', flag: '🇧🇭', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Middle East' },
  { country: 'Oman', countryCode: 'OM', flag: '🇴🇲', police: '9999', ambulance: '9999', fire: '9999', general: '9999', region: 'Middle East' },
  { country: 'Israel', countryCode: 'IL', flag: '🇮🇱', police: '100', ambulance: '101', fire: '102', region: 'Middle East' },
  { country: 'Jordan', countryCode: 'JO', flag: '🇯🇴', police: '911', ambulance: '911', fire: '911', general: '911', region: 'Middle East' },
  { country: 'Lebanon', countryCode: 'LB', flag: '🇱🇧', police: '112', ambulance: '140', fire: '175', general: '112', region: 'Middle East' },
  { country: 'Iraq', countryCode: 'IQ', flag: '🇮🇶', police: '104', ambulance: '122', fire: '115', region: 'Middle East' },
  { country: 'Iran', countryCode: 'IR', flag: '🇮🇷', police: '110', ambulance: '115', fire: '125', region: 'Middle East' },
  { country: 'Yemen', countryCode: 'YE', flag: '🇾🇪', police: '199', ambulance: '191', fire: '199', region: 'Middle East' },
  { country: 'Syria', countryCode: 'SY', flag: '🇸🇾', police: '112', ambulance: '110', fire: '113', region: 'Middle East' },
  { country: 'Palestine', countryCode: 'PS', flag: '🇵🇸', police: '100', ambulance: '101', fire: '102', region: 'Middle East' },
  { country: 'Turkey', countryCode: 'TR', flag: '🇹🇷', police: '155', ambulance: '112', fire: '110', general: '112', region: 'Middle East' },

  // ═══ AFRICA ═══
  { country: 'South Africa', countryCode: 'ZA', flag: '🇿🇦', police: '10111', ambulance: '10177', fire: '10111', region: 'Africa' },
  { country: 'Egypt', countryCode: 'EG', flag: '🇪🇬', police: '122', ambulance: '123', fire: '180', region: 'Africa' },
  { country: 'Kenya', countryCode: 'KE', flag: '🇰🇪', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Africa' },
  { country: 'Nigeria', countryCode: 'NG', flag: '🇳🇬', police: '199', ambulance: '199', fire: '199', general: '112', region: 'Africa' },
  { country: 'Morocco', countryCode: 'MA', flag: '🇲🇦', police: '19', ambulance: '15', fire: '15', region: 'Africa' },
  { country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿', police: '114', ambulance: '114', fire: '114', region: 'Africa' },
  { country: 'Ghana', countryCode: 'GH', flag: '🇬🇭', police: '191', ambulance: '193', fire: '192', region: 'Africa' },
  { country: 'Ethiopia', countryCode: 'ET', flag: '🇪🇹', police: '991', ambulance: '907', fire: '939', region: 'Africa' },
  { country: 'Senegal', countryCode: 'SN', flag: '🇸🇳', police: '17', ambulance: '15', fire: '18', region: 'Africa' },
  { country: "Côte d'Ivoire", countryCode: 'CI', flag: '🇨🇮', police: '111', ambulance: '185', fire: '180', region: 'Africa' },
  { country: 'Cameroon', countryCode: 'CM', flag: '🇨🇲', police: '117', ambulance: '119', fire: '118', region: 'Africa' },
  { country: 'Uganda', countryCode: 'UG', flag: '🇺🇬', police: '999', ambulance: '999', fire: '999', general: '112', region: 'Africa' },
  { country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼', police: '112', ambulance: '912', fire: '112', general: '112', region: 'Africa' },
  { country: 'Angola', countryCode: 'AO', flag: '🇦🇴', police: '113', ambulance: '112', fire: '115', region: 'Africa' },
  { country: 'Mozambique', countryCode: 'MZ', flag: '🇲🇿', police: '119', ambulance: '117', fire: '198', region: 'Africa' },
  { country: 'Zambia', countryCode: 'ZM', flag: '🇿🇲', police: '999', ambulance: '991', fire: '993', general: '112', region: 'Africa' },
  { country: 'Zimbabwe', countryCode: 'ZW', flag: '🇿🇼', police: '995', ambulance: '994', fire: '993', region: 'Africa' },
  { country: 'Botswana', countryCode: 'BW', flag: '🇧🇼', police: '999', ambulance: '997', fire: '998', general: '911', region: 'Africa' },
  { country: 'Namibia', countryCode: 'NA', flag: '🇳🇦', police: '10111', ambulance: '211111', fire: '2032270', general: '10111', region: 'Africa' },
  { country: 'Mauritius', countryCode: 'MU', flag: '🇲🇺', police: '999', ambulance: '114', fire: '115', general: '999', region: 'Africa' },
  { country: 'Tunisia', countryCode: 'TN', flag: '🇹🇳', police: '197', ambulance: '190', fire: '198', region: 'Africa' },
  { country: 'Algeria', countryCode: 'DZ', flag: '🇩🇿', police: '17', ambulance: '14', fire: '14', region: 'Africa' },
  { country: 'Libya', countryCode: 'LY', flag: '🇱🇾', police: '1515', ambulance: '191', fire: '180', region: 'Africa' },
  { country: 'Sudan', countryCode: 'SD', flag: '🇸🇩', police: '999', ambulance: '999', fire: '999', region: 'Africa' },
  { country: 'Madagascar', countryCode: 'MG', flag: '🇲🇬', police: '117', ambulance: '118', fire: '118', region: 'Africa' },
  { country: 'DR Congo', countryCode: 'CD', flag: '🇨🇩', police: '112', ambulance: '112', fire: '118', general: '112', region: 'Africa' },
  { country: 'Mali', countryCode: 'ML', flag: '🇲🇱', police: '17', ambulance: '15', fire: '18', region: 'Africa' },
  { country: 'Burkina Faso', countryCode: 'BF', flag: '🇧🇫', police: '17', ambulance: '112', fire: '18', region: 'Africa' },
  { country: 'Niger', countryCode: 'NE', flag: '🇳🇪', police: '17', ambulance: '15', fire: '18', region: 'Africa' },
  { country: 'Somalia', countryCode: 'SO', flag: '🇸🇴', police: '888', ambulance: '999', fire: '555', region: 'Africa' },
  { country: 'South Sudan', countryCode: 'SS', flag: '🇸🇸', police: '999', ambulance: '999', fire: '999', region: 'Africa' },
];

const REGIONS = [...new Set(EMERGENCY_NUMBERS.map(n => n.region))];

const EmergencyContacts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use LocationContext for current location
  let locationCountryCode: string | null = null;
  try {
    const loc = useLocation();
    locationCountryCode = loc.location?.country_code?.toUpperCase() || null;
  } catch {
    // LocationProvider not available
  }

  const filtered = useMemo(() => {
    let items = EMERGENCY_NUMBERS;
    if (activeRegion) items = items.filter(n => n.region === activeRegion);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(n => n.country.toLowerCase().includes(q) || n.countryCode.toLowerCase().includes(q));
    }
    return items.sort((a, b) => {
      if (locationCountryCode) {
        if (a.countryCode === locationCountryCode && b.countryCode !== locationCountryCode) return -1;
        if (b.countryCode === locationCountryCode && a.countryCode !== locationCountryCode) return 1;
      }
      return a.country.localeCompare(b.country);
    });
  }, [searchQuery, locationCountryCode, activeRegion]);

  const copyNumber = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    toast({ title: 'Copied!', description: `${number} copied to clipboard` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Highlight the current location country
  const currentLocationEntry = locationCountryCode ? EMERGENCY_NUMBERS.find(n => n.countryCode === locationCountryCode) : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Emergency Numbers</h1>
        <p className="text-muted-foreground">{EMERGENCY_NUMBERS.length} countries — official police, ambulance & fire numbers</p>
      </div>

      {/* Current location hero card */}
      {currentLocationEntry && (
        <Card className="border-primary bg-primary/5 shadow-md">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Your Current Location</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentLocationEntry.flag}</span>
              <div>
                <p className="text-lg font-bold">{currentLocationEntry.country}</p>
                <p className="text-xs text-muted-foreground">{currentLocationEntry.region}</p>
              </div>
            </div>
            {currentLocationEntry.general && (
              <div className="rounded-md bg-destructive/10 p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold tracking-wider">GENERAL EMERGENCY</p>
                  <p className="text-3xl font-bold text-destructive font-mono">{currentLocationEntry.general}</p>
                </div>
                <Button size="sm" variant="destructive" onClick={() => copyNumber(currentLocationEntry.general!, `hero-gen`)}>
                  {copiedId === 'hero-gen' ? <Check className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                </Button>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: '🚔 Police', num: currentLocationEntry.police, key: 'hero-pol' },
                { label: '🚑 Ambulance', num: currentLocationEntry.ambulance, key: 'hero-amb' },
                { label: '🚒 Fire', num: currentLocationEntry.fire, key: 'hero-fir' },
              ].map(s => (
                <div key={s.key} className="rounded-md border border-primary/20 p-2 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => copyNumber(s.num, s.key)}>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold font-mono">{s.num}</p>
                  {copiedId === s.key && <p className="text-[9px] text-primary">Copied!</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span>In life-threatening emergencies, dial local emergency services first. EU: <strong>112</strong> | US/CA/MX: <strong>911</strong></span>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search country..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-10" />
        {searchQuery && <Button variant="ghost" size="sm" className="absolute right-1 top-1" onClick={() => setSearchQuery('')}><X className="h-4 w-4" /></Button>}
      </div>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={activeRegion === null ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(null)}>
          All ({EMERGENCY_NUMBERS.length})
        </Badge>
        {REGIONS.map(r => (
          <Badge key={r} variant={activeRegion === r ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setActiveRegion(activeRegion === r ? null : r)}>
            {r} ({EMERGENCY_NUMBERS.filter(n => n.region === r).length})
          </Badge>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Showing {filtered.length} countries</p>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <Card key={item.countryCode} className={`transition-all hover:shadow-md ${item.countryCode === locationCountryCode ? 'border-primary ring-1 ring-primary/20' : ''}`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.country}</p>
                    <p className="text-xs text-muted-foreground">{item.region}</p>
                  </div>
                </div>
                {item.countryCode === locationCountryCode && <Badge variant="default" className="text-xs">📍 You</Badge>}
              </div>

              {item.general && (
                <div className="rounded-md bg-destructive/10 p-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground">GENERAL EMERGENCY</p>
                    <p className="text-xl font-bold text-destructive font-mono">{item.general}</p>
                  </div>
                  <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => copyNumber(item.general!, `${item.countryCode}-gen`)}>
                    {copiedId === `${item.countryCode}-gen` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Police', num: item.police, key: 'pol' },
                  { label: 'Ambulance', num: item.ambulance, key: 'amb' },
                  { label: 'Fire', num: item.fire, key: 'fir' },
                ].map(s => (
                  <div key={s.key} className="rounded-md border p-1.5 cursor-pointer hover:bg-accent transition-colors" onClick={() => copyNumber(s.num, `${item.countryCode}-${s.key}`)}>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-bold font-mono">{s.num}</p>
                    {copiedId === `${item.countryCode}-${s.key}` && <p className="text-[9px] text-primary">Copied!</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card><CardContent className="py-12 text-center"><AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No countries found</p></CardContent></Card>
      )}
    </div>
  );
};

export default EmergencyContacts;
