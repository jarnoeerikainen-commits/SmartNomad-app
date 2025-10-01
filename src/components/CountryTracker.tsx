
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, X, Search, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Country } from '@/types/country';

interface CountryTrackerProps {
  countries: Country[];
  onAddCountry: (country: Country) => void;
  onRemoveCountry: (countryCode: string) => void;
}

// World countries data (excluding sanctioned countries) + US States for tax tracking
const AVAILABLE_COUNTRIES = [
  // US States for tax residency tracking
  { code: 'US-AL', name: 'Alabama (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-AK', name: 'Alaska (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  { code: 'US-AZ', name: 'Arizona (US State)', flag: '🇺🇸', category: 'US State', taxDays: 269, taxType: 'hybrid' },
  { code: 'US-AR', name: 'Arkansas (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-CA', name: 'California (US State)', flag: '🇺🇸', category: 'US State', taxDays: 269, taxType: 'hybrid' },
  { code: 'US-CO', name: 'Colorado (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-CT', name: 'Connecticut (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-DE', name: 'Delaware (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'day_count' },
  { code: 'US-FL', name: 'Florida (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  { code: 'US-GA', name: 'Georgia (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-HI', name: 'Hawaii (US State)', flag: '🇺🇸', category: 'US State', taxDays: 199, taxType: 'hybrid' },
  { code: 'US-ID', name: 'Idaho (US State)', flag: '🇺🇸', category: 'US State', taxDays: 269, taxType: 'hybrid' },
  { code: 'US-IL', name: 'Illinois (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-IN', name: 'Indiana (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-IA', name: 'Iowa (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-KS', name: 'Kansas (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-KY', name: 'Kentucky (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'day_count' },
  { code: 'US-LA', name: 'Louisiana (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-ME', name: 'Maine (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-MD', name: 'Maryland (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-MA', name: 'Massachusetts (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-MI', name: 'Michigan (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'day_count' },
  { code: 'US-MN', name: 'Minnesota (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'day_count' },
  { code: 'US-MS', name: 'Mississippi (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-MO', name: 'Missouri (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-MT', name: 'Montana (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-NE', name: 'Nebraska (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-NV', name: 'Nevada (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  { code: 'US-NH', name: 'New Hampshire (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-NJ', name: 'New Jersey (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-NM', name: 'New Mexico (US State)', flag: '🇺🇸', category: 'US State', taxDays: 184, taxType: 'day_count' },
  { code: 'US-NY', name: 'New York (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-NC', name: 'North Carolina (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-ND', name: 'North Dakota (US State)', flag: '🇺🇸', category: 'US State', taxDays: 209, taxType: 'hybrid' },
  { code: 'US-OH', name: 'Ohio (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-OK', name: 'Oklahoma (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-OR', name: 'Oregon (US State)', flag: '🇺🇸', category: 'US State', taxDays: 199, taxType: 'hybrid' },
  { code: 'US-PA', name: 'Pennsylvania (US State)', flag: '🇺🇸', category: 'US State', taxDays: 180, taxType: 'day_count' },
  { code: 'US-RI', name: 'Rhode Island (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-SC', name: 'South Carolina (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-SD', name: 'South Dakota (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  { code: 'US-TN', name: 'Tennessee (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  { code: 'US-TX', name: 'Texas (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  { code: 'US-UT', name: 'Utah (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'day_count' },
  { code: 'US-VT', name: 'Vermont (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'hybrid' },
  { code: 'US-VA', name: 'Virginia (US State)', flag: '🇺🇸', category: 'US State', taxDays: 182, taxType: 'day_count' },
  { code: 'US-WA', name: 'Washington (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  { code: 'US-WV', name: 'West Virginia (US State)', flag: '🇺🇸', category: 'US State', taxDays: 29, taxType: 'hybrid' },
  { code: 'US-WI', name: 'Wisconsin (US State)', flag: '🇺🇸', category: 'US State', taxDays: 365, taxType: 'domicile' },
  { code: 'US-WY', name: 'Wyoming (US State)', flag: '🇺🇸', category: 'US State', taxDays: 0, taxType: 'none' },
  
  // World Countries
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', category: 'Country' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', category: 'Country' },
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
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'YT', name: 'Mayotte', flag: '🇾🇹' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
];

const CountryTracker: React.FC<CountryTrackerProps> = ({ 
  countries, 
  onAddCountry, 
  onRemoveCountry 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [followEmbassyNews, setFollowEmbassyNews] = useState(true);
  const { toast } = useToast();

  const filteredCountries = AVAILABLE_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !countries.find(c => c.code === country.code)
  );

  const handleAddCountry = (countryData: { code: string; name: string; flag: string; category?: string; taxDays?: number; taxType?: string }) => {
    // Set appropriate day limit based on category and tax rules
    let dayLimit = 90; // Default for tourism
    let reason = 'Tourism/Business';
    
    if (countryData.category === 'US State') {
      if (countryData.taxType === 'none') {
        dayLimit = 365;
        reason = 'US State Tax Tracking (No Income Tax)';
      } else if (countryData.taxDays) {
        dayLimit = countryData.taxDays;
        reason = `US State Tax Tracking (${countryData.taxDays} day limit)`;
      }
    }
    
    const fullCountry: Country = {
      id: `country-${countryData.code}-${Date.now()}`,
      code: countryData.code,
      name: countryData.name,
      flag: countryData.flag,
      dayLimit: dayLimit,
      daysSpent: 0,
      reason: reason,
      lastUpdate: null,
      countTravelDays: true,
      yearlyDaysSpent: 0,
      lastEntry: null,
      totalEntries: 0,
      followEmbassyNews: followEmbassyNews
    };
    onAddCountry(fullCountry);
    setSearchTerm('');
    setShowAddCountry(false);
    
    if (followEmbassyNews && countryData.category !== 'US State') {
      toast({
        title: "Embassy News Enabled",
        description: `Now following embassy updates for ${countryData.name}`,
      });
    } else if (countryData.category === 'US State') {
      toast({
        title: "US State Tax Tracking Added",
        description: `Now tracking tax compliance for ${countryData.name}`,
      });
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MapPin className="w-5 h-5" />
          Tracked Countries ({countries.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tracked Countries List */}
        <div className="space-y-2">
          {countries.length === 0 ? (
            <div className="text-center py-4 text-success">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-sm">No countries tracked yet</p>
              <p className="text-xs text-muted-foreground">Add countries to get travel updates</p>
            </div>
          ) : (
            countries.map((country) => (
              <div key={country.code} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                 <div className="flex items-center gap-3">
                   <span className="text-2xl">{country.flag}</span>
                   <div>
                     <p className="font-medium text-gray-900">{country.name}</p>
                     <div className="flex items-center gap-2">
                       <p className="text-xs text-gray-500">{country.code}</p>
                       {country.followEmbassyNews && (
                         <Badge variant="secondary" className="text-xs">
                           <Building2 className="w-3 h-3 mr-1" />
                           Embassy
                         </Badge>
                       )}
                     </div>
                   </div>
                 </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveCountry(country.code)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Add Country Section */}
        {!showAddCountry ? (
          <Button
            onClick={() => setShowAddCountry(true)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Country
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchTerm && (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {filteredCountries.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2">No countries found</p>
                ) : (
                  filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      onClick={() => handleAddCountry(country)}
                      className="flex items-center gap-3 p-2 hover:bg-green-100 rounded cursor-pointer"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div>
                        <p className="text-sm font-medium">{country.name}</p>
                        <p className="text-xs text-gray-500">{country.code}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Embassy News Toggle */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <Label htmlFor="embassy-news" className="text-sm font-medium">
                  Follow Embassy News
                </Label>
              </div>
              <Switch
                id="embassy-news"
                checked={followEmbassyNews}
                onCheckedChange={setFollowEmbassyNews}
              />
            </div>
            <p className="text-xs text-gray-500 -mt-2">
              Get automatic updates from embassy websites and official sources
            </p>
            
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCountry(false);
                setSearchTerm('');
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryTracker;
