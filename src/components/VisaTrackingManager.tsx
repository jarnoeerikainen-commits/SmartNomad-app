import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, AlertTriangle, Edit, FileText, Plane, Settings, MapPin, Calculator, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedLocationService from '@/services/EnhancedLocationService';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';
import { SchengenCalculator } from './SchengenCalculator';
import { PDFReportGenerator } from './PDFReportGenerator';
import { TravelTimeline } from './TravelTimeline';
import { YearComparisonView } from './YearComparisonView';
import { TrackingSettings } from './TrackingSettings';
import { CountrySelector } from './CountrySelector';

interface LocationEntry {
  date: string;
  countryCode: string;
  entryTime?: string;
  exitTime?: string;
  isFullDay: boolean;
}

interface TaxTracking {
  id: string;
  countryCode: string;
  countryName: string;
  dayLimit: number; // 183 days by default
  daysSpent: number;
  trackingStartDate: string;
  locationEntries: LocationEntry[];
  isAutoTracking: boolean;
  isActive: boolean;
}

interface VisaTracking {
  id: string;
  countryCode: string;
  countryName: string;
  visaType: string;
  dayLimit: number;
  daysUsed: number;
  startDate: string;
  trackingStartDate: string; // Date when tracking should start counting
  endDate: string;
  passportExpiry?: string;
  passportNotifications: number[]; // months before expiry to notify
  isActive: boolean;
}

interface VisaTrackingManagerProps {
  subscription?: Subscription;
  countries?: Country[];
}

interface TaxTrackingManagerProps {
  subscription: Subscription;
  countries: Country[];
}

const VISA_TYPES = [
  // Electronic Travel Authorizations (ETAs)
  { id: 'uk-eta', name: 'UK ETA', icon: '🇬🇧', description: 'UK Electronic Travel Authorisation', commonDays: [180], persona: ['traveller'] },
  { id: 'us-esta', name: 'US ESTA', icon: '🇺🇸', description: 'Electronic System for Travel Authorization', commonDays: [90], persona: ['traveller'] },
  { id: 'canada-eta', name: 'Canada eTA', icon: '🇨🇦', description: 'Canada Electronic Travel Authorization', commonDays: [180], persona: ['traveller'] },
  { id: 'australia-eta', name: 'Australia ETA', icon: '🇦🇺', description: 'Australia Electronic Travel Authority', commonDays: [90], persona: ['traveller'] },
  { id: 'nz-nzeta', name: 'New Zealand NZeTA', icon: '🇳🇿', description: 'New Zealand Electronic Travel Authority', commonDays: [90], persona: ['traveller'] },
  // Traditional Visas
  { id: 'tourist', name: 'Tourist Visa', icon: '🏖️', description: 'Leisure travel and sightseeing', commonDays: [30, 60, 90, 180], persona: ['traveller'] },
  { id: 'business', name: 'Business Visa', icon: '💼', description: 'Business meetings and conferences', commonDays: [30, 90, 180], persona: ['traveller', 'expat'] },
  { id: 'student-visa', name: 'Student Visa', icon: '🎓', description: 'Academic studies and education', commonDays: [180, 365, 730], persona: ['traveller'] },
  { id: 'student', name: 'Student Entry', icon: '📚', description: 'Student exchange programs', commonDays: [90, 180, 365], persona: ['traveller'] },
  { id: 'work', name: 'Work Permit', icon: '🏢', description: 'Employment authorization', commonDays: [90, 180, 365, 730], persona: ['expat'] },
  { id: 'schengen', name: 'Schengen Area', icon: '🇪🇺', description: 'EU Schengen zone travel (90/180)', commonDays: [90], persona: ['traveller'] },
  { id: 'transit', name: 'Transit Visa', icon: '✈️', description: 'Airport or country transit', commonDays: [1, 3, 5, 10], persona: ['traveller'] },
  { id: 'digital-nomad', name: 'Digital Nomad', icon: '💻', description: 'Remote work visa', commonDays: [180, 365], persona: ['traveller', 'expat'] },
  { id: 'tax-residence', name: 'Tax Residence', icon: '📊', description: 'Tax residency tracking', commonDays: [183, 365], persona: ['expat'] },
  // Diplomat & Government
  { id: 'diplomatic', name: 'Diplomatic Visa', icon: '🏛️', description: 'Official government/diplomatic mission', commonDays: [365, 730, 1095], persona: ['diplomat'] },
  { id: 'official', name: 'Official/Service Visa', icon: '📋', description: 'Government official duty travel', commonDays: [90, 180, 365], persona: ['diplomat', 'politics'] },
  { id: 'courtesy', name: 'Courtesy Visa', icon: '🤝', description: 'Extended to foreign dignitaries', commonDays: [30, 90, 180], persona: ['diplomat', 'politics'] },
  { id: 'un-laissez', name: 'UN Laissez-Passer', icon: '🇺🇳', description: 'United Nations travel document', commonDays: [365, 730], persona: ['diplomat'] },
  // Military & NATO
  { id: 'nato-sofa', name: 'NATO SOFA', icon: '🎖️', description: 'NATO Status of Forces Agreement', commonDays: [365, 730, 1095], persona: ['military'] },
  { id: 'military-orders', name: 'Military Orders', icon: '⭐', description: 'PCS/TDY military deployment', commonDays: [180, 365, 730, 1095], persona: ['military'] },
  { id: 'military-leave', name: 'Military R&R Leave', icon: '🏠', description: 'Rest & recuperation leave', commonDays: [14, 30, 45], persona: ['military'] },
  { id: 'military-dependent', name: 'Military Dependent', icon: '👨‍👩‍👧', description: 'SOFA-covered family member', commonDays: [365, 730, 1095], persona: ['military'] },
  // Political & Special
  { id: 'asylum', name: 'Asylum / Refugee', icon: '🕊️', description: 'Refugee or asylum seeker status', commonDays: [365, 730, 1825], persona: ['politics'] },
  { id: 'humanitarian', name: 'Humanitarian Visa', icon: '❤️', description: 'Humanitarian protection visa', commonDays: [180, 365], persona: ['politics'] },
  { id: 'journalist', name: 'Journalist/Media Visa', icon: '📰', description: 'Press and media credentials', commonDays: [30, 90, 180, 365], persona: ['politics'] },
  // Investment & Residency
  { id: 'investor', name: 'Investor Visa', icon: '💰', description: 'Investment-based entry/residency', commonDays: [365, 730, 1825], persona: ['expat'] },
  { id: 'golden-visa', name: 'Golden Visa', icon: '🏆', description: 'Residency by investment programme', commonDays: [365, 730, 1825], persona: ['expat'] },
  { id: 'retirement', name: 'Retirement Visa', icon: '🌴', description: 'Retiree residency programme', commonDays: [365, 730], persona: ['expat'] },
  { id: 'entrepreneur', name: 'Entrepreneur Visa', icon: '🚀', description: 'Startup/entrepreneur programme', commonDays: [365, 730], persona: ['expat'] },
  // Crew & Special
  { id: 'crew', name: 'Crew Visa (C1/D)', icon: '🚢', description: 'Airline/maritime crew transit', commonDays: [29, 90], persona: ['traveller'] },
  { id: 'religious', name: 'Religious Worker', icon: '⛪', description: 'Religious mission or ministry', commonDays: [180, 365, 730], persona: ['traveller'] },
  { id: 'medical', name: 'Medical Treatment', icon: '🏥', description: 'Medical travel and treatment', commonDays: [30, 90, 180], persona: ['traveller'] },
  { id: 'exchange', name: 'Exchange Visitor (J-1)', icon: '🔄', description: 'Cultural exchange programme', commonDays: [365, 730], persona: ['traveller'] },
  { id: 'fiancee', name: 'Fiancé(e) Visa (K-1)', icon: '💍', description: 'Marriage-based entry', commonDays: [90], persona: ['traveller'] },
  { id: 'family-reunion', name: 'Family Reunification', icon: '👪', description: 'Join family members abroad', commonDays: [365, 730, 1825], persona: ['expat'] },
  { id: 'permanent-resident', name: 'Permanent Residency', icon: '🏠', description: 'Long-term/permanent residence', commonDays: [1825, 3650], persona: ['expat'] },
  { id: 'citizenship-track', name: 'Citizenship Track', icon: '🛂', description: 'Naturalisation day tracking', commonDays: [1825, 3650], persona: ['expat'] },
];

const COUNTRIES = [
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AI', name: 'Anguilla', flag: '🇦🇮' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AQ', name: 'Antarctica', flag: '🇦🇶' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AS', name: 'American Samoa', flag: '🇦🇸' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AW', name: 'Aruba', flag: '🇦🇼' },
  { code: 'AX', name: 'Åland Islands', flag: '🇦🇽' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BL', name: 'Saint Barthélemy', flag: '🇧🇱' },
  { code: 'BM', name: 'Bermuda', flag: '🇧🇲' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BQ', name: 'Caribbean Netherlands', flag: '🇧🇶' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'BV', name: 'Bouvet Island', flag: '🇧🇻' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CC', name: 'Cocos Islands', flag: '🇨🇨' },
  { code: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'CG', name: 'Republic of the Congo', flag: '🇨🇬' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'CK', name: 'Cook Islands', flag: '🇨🇰' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻' },
  { code: 'CW', name: 'Curaçao', flag: '🇨🇼' },
  { code: 'CX', name: 'Christmas Island', flag: '🇨🇽' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'EH', name: 'Western Sahara', flag: '🇪🇭' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FK', name: 'Falkland Islands', flag: '🇫🇰' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'FO', name: 'Faroe Islands', flag: '🇫🇴' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'GF', name: 'French Guiana', flag: '🇬🇫' },
  { code: 'GG', name: 'Guernsey', flag: '🇬🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GI', name: 'Gibraltar', flag: '🇬🇮' },
  { code: 'GL', name: 'Greenland', flag: '🇬🇱' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands', flag: '🇬🇸' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GU', name: 'Guam', flag: '🇬🇺' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'HM', name: 'Heard Island and McDonald Islands', flag: '🇭🇲' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IM', name: 'Isle of Man', flag: '🇮🇲' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'IO', name: 'British Indian Ocean Territory', flag: '🇮🇴' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JE', name: 'Jersey', flag: '🇯🇪' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MF', name: 'Saint Martin', flag: '🇲🇫' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'MO', name: 'Macao', flag: '🇲🇴' },
  { code: 'MP', name: 'Northern Mariana Islands', flag: '🇲🇵' },
  { code: 'MQ', name: 'Martinique', flag: '🇲🇶' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MS', name: 'Montserrat', flag: '🇲🇸' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NF', name: 'Norfolk Island', flag: '🇳🇫' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NU', name: 'Niue', flag: '🇳🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PF', name: 'French Polynesia', flag: '🇵🇫' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PM', name: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
  { code: 'PN', name: 'Pitcairn', flag: '🇵🇳' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RE', name: 'Réunion', flag: '🇷🇪' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SH', name: 'Saint Helena', flag: '🇸🇭' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen', flag: '🇸🇯' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'SX', name: 'Sint Maarten', flag: '🇸🇽' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'TC', name: 'Turks and Caicos Islands', flag: '🇹🇨' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'TF', name: 'French Southern Territories', flag: '🇹🇫' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TK', name: 'Tokelau', flag: '🇹🇰' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UM', name: 'United States Minor Outlying Islands', flag: '🇺🇲' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VG', name: 'British Virgin Islands', flag: '🇻🇬' },
  { code: 'VI', name: 'U.S. Virgin Islands', flag: '🇻🇮' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'WF', name: 'Wallis and Futuna', flag: '🇼🇫' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
];

const PASSPORT_NOTIFICATION_OPTIONS = [
  { months: 9, label: '9 months before expiry' },
  { months: 8, label: '8 months before expiry' },
  { months: 7, label: '7 months before expiry' },
  { months: 6, label: '6 months before expiry' },
  { months: 3, label: '3 months before expiry' },
  { months: 1, label: '1 month before expiry' }
];

const VisaTrackingManager: React.FC<VisaTrackingManagerProps> = ({ 
  subscription = { 
    tier: 'free', 
    isActive: true, 
    expiryDate: null,
    features: ['✈️ Basic travel tracking', '📊 Simple day counting', '📍 Manual location entry', '⚠️ Basic alerts'],
    aiRequestsRemaining: 0,
    aiRequestsLimit: 0
  }, 
  countries = [] 
}) => {
  const [visaTrackings, setVisaTrackings] = useState<VisaTracking[]>(() => {
    const saved = localStorage.getItem('visaTrackings');
    return saved ? JSON.parse(saved) : [];
  });
  const [taxTrackings, setTaxTrackings] = useState<TaxTracking[]>(() => {
    const saved = localStorage.getItem('taxTrackings');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<VisaTracking | null>(null);
  const [editingTax, setEditingTax] = useState<TaxTracking | null>(null);
const [selectedCountry, setSelectedCountry] = useState('');
const [selectedVisaType, setSelectedVisaType] = useState('');
const [dayLimit, setDayLimit] = useState('');
const [passportExpiry, setPassportExpiry] = useState('');
// Country selector integration
const [showVisaCountrySelector, setShowVisaCountrySelector] = useState(false);
const [showTaxCountrySelector, setShowTaxCountrySelector] = useState(false);
const [selectedVisaCountryName, setSelectedVisaCountryName] = useState('');
const [selectedVisaCountryFlag, setSelectedVisaCountryFlag] = useState('');
const [selectedTaxCountryName, setSelectedTaxCountryName] = useState('');
const [selectedTaxCountryFlag, setSelectedTaxCountryFlag] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([9, 6, 3]);
  const [trackingStartDate, setTrackingStartDate] = useState('');
  const [startFromNow, setStartFromNow] = useState(true);
  const [activeTab, setActiveTab] = useState('visa');
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [currentSubscription, setCurrentSubscription] = useState(subscription);
  
  // Tracking settings state - load from localStorage
  const [countingMode, setCountingMode] = useState<'days' | 'nights'>(() => {
    const saved = localStorage.getItem('trackingSettings');
    return saved ? JSON.parse(saved).countingMode || 'days' : 'days';
  });
  const [partialDayRule, setPartialDayRule] = useState<'full' | 'half' | 'exclude'>(() => {
    const saved = localStorage.getItem('trackingSettings');
    return saved ? JSON.parse(saved).partialDayRule || 'full' : 'full';
  });
  const [countDepartureDay, setCountDepartureDay] = useState(() => {
    const saved = localStorage.getItem('trackingSettings');
    return saved ? JSON.parse(saved).countDepartureDay !== false : true;
  });
  const [countArrivalDay, setCountArrivalDay] = useState(() => {
    const saved = localStorage.getItem('trackingSettings');
    return saved ? JSON.parse(saved).countArrivalDay !== false : true;
  });
  
  const { toast } = useToast();

  // Save tracking settings to localStorage
  useEffect(() => {
    localStorage.setItem('trackingSettings', JSON.stringify({
      countingMode,
      partialDayRule,
      countDepartureDay,
      countArrivalDay
    }));
  }, [countingMode, partialDayRule, countDepartureDay, countArrivalDay]);

  // Save visa trackings to localStorage
  useEffect(() => {
    localStorage.setItem('visaTrackings', JSON.stringify(visaTrackings));
    // Dispatch event to update dashboard stats
    window.dispatchEvent(new Event('visaTrackingsUpdated'));
  }, [visaTrackings]);

  // Save tax trackings to localStorage
  useEffect(() => {
    localStorage.setItem('taxTrackings', JSON.stringify(taxTrackings));
  }, [taxTrackings]);

  // Update subscription when it changes
  useEffect(() => {
    setCurrentSubscription(subscription);
  }, [subscription]);

  const updateLocationEntry = useCallback((countryCode: string, countryName: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setTaxTrackings(prev => prev.map(tracking => {
      if (tracking.countryCode === countryCode && tracking.isAutoTracking && tracking.isActive) {
        const existingEntry = tracking.locationEntries.find(entry => entry.date === today);
        
        if (!existingEntry) {
          const newEntry: LocationEntry = {
            date: today,
            countryCode,
            isFullDay: true
          };
          
          return {
            ...tracking,
            locationEntries: [...tracking.locationEntries, newEntry],
            daysSpent: tracking.daysSpent + 1
          };
        }
      }
      return tracking;
    }));
  }, []);

  // Location tracking effect
  useEffect(() => {
    const initializeLocationTracking = async () => {
      if (taxTrackings.some(t => t.isAutoTracking && t.isActive)) {
        const hasPermission = await EnhancedLocationService.requestBackgroundPermissions();
        if (hasPermission) {
          setIsLocationTracking(true);
          EnhancedLocationService.startBackgroundTracking((location) => {
            setCurrentLocation(`${location.city}, ${location.country}`);
            updateLocationEntry(location.country_code, location.country);
          });
        }
      } else {
        EnhancedLocationService.stopBackgroundTracking();
        setIsLocationTracking(false);
      }
    };

    initializeLocationTracking();

    return () => {
      EnhancedLocationService.stopBackgroundTracking();
    };
  }, [taxTrackings, updateLocationEntry]);

  // Check subscription limits
  const getVisaTrackingLimit = () => {
    switch (currentSubscription.tier) {
      case 'free': return 1;
      case 'premium': return 999;
      default: return 1;
    }
  };

  const canAddMoreVisas = () => {
    return visaTrackings.length < getVisaTrackingLimit();
  };

  const getAllowedVisaTypes = () => {
    switch (currentSubscription.tier) {
      case 'free': return ['tourist'];
      case 'premium': return VISA_TYPES.map(v => v.id);
      default: return ['tourist'];
    }
  };

  const handleAddVisa = () => {
    if (!canAddMoreVisas()) {
      toast({
        title: "Upgrade Required",
        description: `Your ${currentSubscription.tier} plan allows only ${getVisaTrackingLimit()} visa tracking(s). Please upgrade to add more.`,
        variant: "destructive"
      });
      return;
    }

const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry);
const selectedVisaData = VISA_TYPES.find(v => v.id === selectedVisaType);
    
    if (!selectedCountryData || !selectedVisaData) return;

    const trackingStart = startFromNow ? 
      new Date().toISOString().split('T')[0] : 
      trackingStartDate || new Date().toISOString().split('T')[0];

    const newVisa: VisaTracking = {
      id: `visa-${Date.now()}`,
      countryCode: selectedCountry,
      countryName: selectedCountryData.name,
      visaType: selectedVisaType,
      dayLimit: parseInt(dayLimit) || 90,
      daysUsed: 0,
      startDate: new Date().toISOString().split('T')[0],
      trackingStartDate: trackingStart,
      endDate: '',
      passportExpiry: passportExpiry || undefined,
      passportNotifications: selectedNotifications,
      isActive: true
    };

    setVisaTrackings(prev => [...prev, newVisa]);
    resetForm();
    setIsModalOpen(false);
    
    toast({
      title: "Visa Tracking Added",
      description: `Now tracking ${selectedVisaData.name} for ${selectedCountryData.name}`,
    });
  };

  const handleEditVisa = (visa: VisaTracking) => {
    setEditingVisa(visa);
    setSelectedCountry(visa.countryCode);
    setSelectedVisaType(visa.visaType);
    setDayLimit(visa.dayLimit.toString());
    setPassportExpiry(visa.passportExpiry || '');
    setSelectedNotifications(visa.passportNotifications);
    setIsModalOpen(true);
  };

  const handleUpdateVisa = () => {
    if (!editingVisa) return;

    const updatedVisa = {
      ...editingVisa,
      dayLimit: parseInt(dayLimit) || 90,
      passportExpiry: passportExpiry || undefined,
      passportNotifications: selectedNotifications
    };

    setVisaTrackings(prev => prev.map(v => v.id === editingVisa.id ? updatedVisa : v));
    resetForm();
    setIsModalOpen(false);
    
    toast({
      title: "Visa Updated",
      description: "Visa tracking has been updated successfully",
    });
  };

  const getTaxTrackingLimit = () => {
    switch (currentSubscription.tier) {
      case 'free': return 1;
      case 'premium': return 50;
      default: return 1;
    }
  };

  const openTaxModal = () => {
    if (taxTrackings.length >= getTaxTrackingLimit()) {
      toast({
        title: "Limit Reached",
        description: `You can only track ${getTaxTrackingLimit()} tax residence(s) with your ${currentSubscription.tier} plan.`,
        variant: "destructive"
      });
      return;
    }
    setIsTaxModalOpen(true);
  };

  const addTaxTracking = () => {
    if (!selectedCountry || !dayLimit) {
      toast({
        title: "Missing Information",
        description: "Please select a country and set day limit.",
        variant: "destructive"
      });
      return;
    }

    const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry);
    if (!selectedCountryData) return;

    const trackingStart = startFromNow ? 
      new Date().toISOString().split('T')[0] : 
      trackingStartDate || new Date().toISOString().split('T')[0];

    const newTaxTracking: TaxTracking = {
      id: `tax-${Date.now()}`,
      countryCode: selectedCountry,
      countryName: selectedCountryData.name,
      dayLimit: parseInt(dayLimit) || 183,
      daysSpent: 0,
      trackingStartDate: trackingStart,
      locationEntries: [],
      isAutoTracking: true,
      isActive: true
    };

    setTaxTrackings(prev => [...prev, newTaxTracking]);
    
    toast({
      title: "Tax Tracking Added",
      description: `Started tracking tax residency for ${selectedCountryData.name}`,
    });

    closeTaxModal();
  };

  const closeTaxModal = () => {
    setIsTaxModalOpen(false);
    setEditingTax(null);
    setSelectedCountry('');
    setDayLimit('183');
    setTrackingStartDate('');
    setStartFromNow(true);
  };

  const toggleTaxTracking = (taxId: string) => {
    setTaxTrackings(prev => prev.map(tax => 
      tax.id === taxId ? { ...tax, isActive: !tax.isActive } : tax
    ));
  };

  const deleteTaxTracking = (taxId: string) => {
    setTaxTrackings(prev => prev.filter(tax => tax.id !== taxId));
    toast({
      title: "Tax Tracking Deleted",
      description: "Tax tracking has been removed.",
    });
  };

  const addManualDays = (taxId: string, days: number, date: string) => {
    setTaxTrackings(prev => prev.map(tax => {
      if (tax.id === taxId) {
        const existingEntry = tax.locationEntries.find(entry => entry.date === date);
        if (!existingEntry) {
          const newEntry: LocationEntry = {
            date,
            countryCode: tax.countryCode,
            isFullDay: true
          };
          return {
            ...tax,
            locationEntries: [...tax.locationEntries, newEntry],
            daysSpent: tax.daysSpent + days
          };
        }
      }
      return tax;
    }));
  };

  const resetForm = () => {
    setEditingVisa(null);
    setSelectedCountry('');
    setSelectedVisaType('');
    setDayLimit('');
    setPassportExpiry('');
    setSelectedNotifications([9, 6, 3]);
    setTrackingStartDate('');
    setStartFromNow(true);
  };

  const updateDaysUsed = (visaId: string, newDays: number) => {
    setVisaTrackings(prev => prev.map(v => 
      v.id === visaId ? { ...v, daysUsed: Math.max(0, newDays) } : v
    ));
  };

  const getVisaProgress = (visa: VisaTracking) => {
    return Math.min((visa.daysUsed / visa.dayLimit) * 100, 100);
  };

  const getRemainingDays = (visa: VisaTracking) => {
    return Math.max(visa.dayLimit - visa.daysUsed, 0);
  };

  const getPassportWarnings = (visa: VisaTracking) => {
    if (!visa.passportExpiry) return [];
    
    const expiryDate = new Date(visa.passportExpiry);
    const today = new Date();
    const monthsUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    return visa.passportNotifications.filter(months => 
      monthsUntilExpiry <= months && monthsUntilExpiry > 0
    );
  };

  const allowedVisaTypes = getAllowedVisaTypes();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Travel Day Guardian
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              {visaTrackings.length}/{getVisaTrackingLimit()} Visas
            </Badge>
            <Badge variant="secondary">
              {taxTrackings.length}/{getTaxTrackingLimit()} Tax
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Track visa days, tax residency & document deadlines</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 gap-1">
            <TabsTrigger value="visa">Visa</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="schengen">Schengen</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visa" className="space-y-4">
          {/* Subscription Notice */}
          {currentSubscription.tier === 'free' && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Free plan: Limited to 1 tourist visa tracking. Upgrade for multiple visa types and unlimited tracking.
              </AlertDescription>
            </Alert>
          )}

        {/* Active Visa Trackings */}
        <div className="space-y-3">
          {visaTrackings.map((visa) => {
            const progress = getVisaProgress(visa);
            const remaining = getRemainingDays(visa);
            const passportWarnings = getPassportWarnings(visa);
            const visaTypeData = VISA_TYPES.find(v => v.id === visa.visaType);

            return (
              <Card key={visa.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{visaTypeData?.icon}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {visa.countryName} — {visaTypeData?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {visa.daysUsed}/{visa.dayLimit} days • {remaining} remaining
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditVisa(visa)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          progress > 80 ? 'bg-destructive' : 
                          progress > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Days Used Adjuster */}
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm">Days used:</Label>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDaysUsed(visa.id, visa.daysUsed - 1)}
                        disabled={visa.daysUsed === 0}
                        className="h-6 w-6 p-0"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={visa.daysUsed}
                        onChange={(e) => updateDaysUsed(visa.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-6 text-center text-sm"
                        min="0"
                        max={visa.dayLimit}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDaysUsed(visa.id, visa.daysUsed + 1)}
                        disabled={visa.daysUsed >= visa.dayLimit}
                        className="h-6 w-6 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Passport Warnings */}
                  {passportWarnings.length > 0 && (
                    <Alert className="border-destructive/30 bg-destructive/5">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        Passport expires in {passportWarnings[0]} months! Consider renewal.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Visa Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={!canAddMoreVisas()}
            className="w-full disabled:opacity-50"
            size="lg">
          <Plane className="w-4 h-4 mr-2" />
          {canAddMoreVisas() ? 'Add Visa Tracking' : `Upgrade for More (${visaTrackings.length}/${getVisaTrackingLimit()})`}
        </Button>

        {/* Add/Edit Visa Modal */}
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingVisa ? 'Edit Visa Tracking' : 'Add Visa Tracking'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Country Selection */}
              <div className="space-y-2">
                <Label>Country</Label>
                {selectedCountry && !editingVisa ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedVisaCountryFlag}</span>
                      <span className="font-medium">{selectedVisaCountryName}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCountry('');
                        setSelectedVisaCountryName('');
                        setSelectedVisaCountryFlag('');
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : editingVisa ? (
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted">
                    <span className="text-2xl">{COUNTRIES.find(c => c.code === selectedCountry)?.flag}</span>
                    <span className="font-medium">{COUNTRIES.find(c => c.code === selectedCountry)?.name}</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowVisaCountrySelector(true)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Select Country
                  </Button>
                )}
              </div>

              {/* Visa Type Selection */}
              <div className="space-y-2">
                <Label>Visa Type</Label>
                <Select value={selectedVisaType} onValueChange={(value) => {
                  setSelectedVisaType(value);
                  const visaType = VISA_TYPES.find(v => v.id === value);
                  if (visaType) setDayLimit(visaType.commonDays[0].toString());
                }} disabled={!!editingVisa}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {VISA_TYPES.filter(vt => allowedVisaTypes.includes(vt.id)).map(visaType => (
                      <SelectItem key={visaType.id} value={visaType.id}>
                        <div className="flex items-center gap-2">
                          <span>{visaType.icon}</span>
                          <div>
                            <div className="font-medium">{visaType.name}</div>
                            <div className="text-xs text-gray-500">{visaType.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Day Limit with Presets */}
              {selectedVisaType && (
                <div className="space-y-2">
                  <Label>Day Limit</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {VISA_TYPES.find(v => v.id === selectedVisaType)?.commonDays.map(days => (
                        <Button
                          key={days}
                          type="button"
                          variant={dayLimit === days.toString() ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDayLimit(days.toString())}
                        >
                          {days} days
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      value={dayLimit}
                      onChange={(e) => setDayLimit(e.target.value)}
                      placeholder="Custom day limit"
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
              )}

              {/* Tracking Start Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tracking Start Date
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="start-now"
                      checked={startFromNow}
                      onChange={() => setStartFromNow(true)}
                      className="rounded"
                    />
                    <label htmlFor="start-now" className="text-sm">
                      Start tracking from now
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="start-custom"
                      checked={!startFromNow}
                      onChange={() => setStartFromNow(false)}
                      className="rounded"
                    />
                    <label htmlFor="start-custom" className="text-sm">
                      Start tracking from custom date
                    </label>
                  </div>
                  {!startFromNow && (
                    <Input
                      type="date"
                      value={trackingStartDate}
                      onChange={(e) => setTrackingStartDate(e.target.value)}
                      placeholder="Select start date"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              {/* Passport Expiry */}
              <div className="space-y-2">
                <Label>Passport Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  value={passportExpiry}
                  onChange={(e) => setPassportExpiry(e.target.value)}
                />
              </div>

              {/* Passport Notifications */}
              {passportExpiry && (
                <div className="space-y-2">
                  <Label>Passport Expiry Notifications</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PASSPORT_NOTIFICATION_OPTIONS.map(option => (
                      <label key={option.months} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(option.months)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNotifications(prev => [...prev, option.months]);
                            } else {
                              setSelectedNotifications(prev => prev.filter(m => m !== option.months));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={editingVisa ? handleUpdateVisa : handleAddVisa}
                  disabled={!selectedCountry || !selectedVisaType || !dayLimit}
                  className="flex-1"
                >
                  {editingVisa ? 'Update' : 'Add'} Visa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          {/* Location Tracking Status */}
          {isLocationTracking && (
            <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
              <MapPin className="w-4 h-4" />
              <AlertDescription>
                Location tracking active. Current location: {currentLocation || 'Detecting...'}
              </AlertDescription>
            </Alert>
          )}

          {/* Tax Residency Trackings */}
          <div className="space-y-3">
            {taxTrackings.map((tax) => {
              const progress = Math.min((tax.daysSpent / tax.dayLimit) * 100, 100);
              const remaining = Math.max(tax.dayLimit - tax.daysSpent, 0);
              const isNearLimit = progress > 80;

              return (
                <Card key={tax.id} className={`hover:shadow-md transition-all ${isNearLimit ? 'ring-2 ring-destructive/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {tax.countryName} Tax Residency
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {tax.daysSpent}/{tax.dayLimit} days • {remaining} remaining
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Switch
                              checked={tax.isActive}
                              onCheckedChange={() => toggleTaxTracking(tax.id)}
                            />
                            <span className="text-xs text-muted-foreground">
                              {tax.isActive ? 'Active' : 'Paused'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTaxTracking(tax.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            progress > 80 ? 'bg-destructive' : 
                            progress > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{Math.round(progress)}% used</span>
                        <span>{remaining > 0 ? `${remaining} days left` : 'Limit reached'}</span>
                      </div>
                    </div>

                    {/* Manual Day Entry */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Manual entry:</span>
                      <Input
                        type="date"
                        className="w-32 h-6 text-xs"
                        onChange={(e) => {
                          if (e.target.value) {
                            addManualDays(tax.id, 1, e.target.value);
                          }
                        }}
                      />
                      <Badge variant={tax.isAutoTracking ? 'default' : 'outline'} className="text-xs">
                        {tax.isAutoTracking ? 'Auto' : 'Manual'}
                      </Badge>
                    </div>

                    {isNearLimit && (
                      <Alert className="border-destructive/30 bg-destructive/5 mt-3">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          Approaching tax residency threshold of {tax.dayLimit} days!
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add New Tax Tracking Button */}
          <Button
            onClick={openTaxModal}
            disabled={taxTrackings.length >= getTaxTrackingLimit()}
            className="w-full disabled:opacity-50"
            size="lg"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {taxTrackings.length < getTaxTrackingLimit() ? 'Add Tax Residence Tracking' : `Upgrade for More (${taxTrackings.length}/${getTaxTrackingLimit()})`}
          </Button>

          {/* Tax Tracking Modal */}
          <Dialog open={isTaxModalOpen} onOpenChange={(open) => {
            setIsTaxModalOpen(open);
            if (!open) closeTaxModal();
          }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Tax Residence Tracking</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <Calculator className="w-4 h-4" />
                  <AlertDescription className="text-blue-800">
                    Tax residence tracking monitors days spent in a country. Most countries use 183 days as the threshold for tax residency.
                  </AlertDescription>
                </Alert>

                {/* Country Selection */}
                <div className="space-y-2">
                  <Label>Country</Label>
                  {selectedCountry ? (
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selectedTaxCountryFlag}</span>
                        <span className="font-medium">{selectedTaxCountryName}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCountry('');
                          setSelectedTaxCountryName('');
                          setSelectedTaxCountryFlag('');
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowTaxCountrySelector(true)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Select Country
                    </Button>
                  )}
                </div>

                {/* Day Limit */}
                <div className="space-y-2">
                  <Label>Tax Residency Threshold (Days)</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={dayLimit === '183' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDayLimit('183')}
                    >
                      183 days (Standard)
                    </Button>
                    <Button
                      type="button"
                      variant={dayLimit === '90' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDayLimit('90')}
                    >
                      90 days
                    </Button>
                    <Button
                      type="button"
                      variant={dayLimit === '365' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDayLimit('365')}
                    >
                      365 days
                    </Button>
                  </div>
                  <Input
                    type="number"
                    value={dayLimit}
                    onChange={(e) => setDayLimit(e.target.value)}
                    placeholder="Custom day limit"
                    min="1"
                    max="365"
                  />
                </div>

                {/* Tracking Start Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tracking Start Date
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="tax-start-now"
                        checked={startFromNow}
                        onChange={() => setStartFromNow(true)}
                        className="rounded"
                      />
                      <label htmlFor="tax-start-now" className="text-sm">
                        Start tracking from now
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="tax-start-custom"
                        checked={!startFromNow}
                        onChange={() => setStartFromNow(false)}
                        className="rounded"
                      />
                      <label htmlFor="tax-start-custom" className="text-sm">
                        Start tracking from custom date
                      </label>
                    </div>
                    {!startFromNow && (
                      <Input
                        type="date"
                        value={trackingStartDate}
                        onChange={(e) => setTrackingStartDate(e.target.value)}
                        placeholder="Select start date"
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={closeTaxModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={addTaxTracking}
                    disabled={!selectedCountry || !dayLimit}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Add Tax Tracking
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Schengen Calculator Tab */}
        <TabsContent value="schengen" className="space-y-4">
          <SchengenCalculator />
        </TabsContent>

        {/* PDF Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <PDFReportGenerator countries={countries} />
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <TravelTimeline countries={countries} />
        </TabsContent>

        {/* Year Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <YearComparisonView countries={countries} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <TrackingSettings
            countingMode={countingMode}
            onCountingModeChange={setCountingMode}
            partialDayRule={partialDayRule}
            onPartialDayRuleChange={setPartialDayRule}
            countDepartureDay={countDepartureDay}
            onCountDepartureDayChange={setCountDepartureDay}
            countArrivalDay={countArrivalDay}
            onCountArrivalDayChange={setCountArrivalDay}
          />
        </TabsContent>
        
        </Tabs>

        {/* Country Selectors */}
        <CountrySelector
          isOpen={showVisaCountrySelector}
          onClose={() => setShowVisaCountrySelector(false)}
          onSelect={(countryCode, countryName, countryFlag) => {
            setSelectedCountry(countryCode);
            setSelectedVisaCountryName(countryName);
            setSelectedVisaCountryFlag(countryFlag);
            setShowVisaCountrySelector(false);
          }}
          existingCountries={[]}
          maxCountries={999}
        />

        <CountrySelector
          isOpen={showTaxCountrySelector}
          onClose={() => setShowTaxCountrySelector(false)}
          onSelect={(countryCode, countryName, countryFlag) => {
            setSelectedCountry(countryCode);
            setSelectedTaxCountryName(countryName);
            setSelectedTaxCountryFlag(countryFlag);
            setShowTaxCountrySelector(false);
          }}
          existingCountries={taxTrackings.map(t => ({
            id: t.id,
            code: t.countryCode,
            name: t.countryName,
            flag: COUNTRIES.find(c => c.code === t.countryCode)?.flag || '',
            dayLimit: t.dayLimit,
            daysSpent: t.daysSpent,
            reason: 'Tax residence tracking',
            lastUpdate: null,
            countTravelDays: true,
            yearlyDaysSpent: t.daysSpent,
            lastEntry: null,
            totalEntries: 0,
            followEmbassyNews: false,
            countingMode: 'days',
            partialDayRule: 'full',
            countArrivalDay: true,
            countDepartureDay: true,
          }))}
          maxCountries={999}
        />
      </CardContent>
    </Card>
  );
};

export default VisaTrackingManager;