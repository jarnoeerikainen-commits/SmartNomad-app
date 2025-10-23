import { ThreatIncident, WatchlistLocation, ThreatStatistics } from '@/types/threat';

export const dummyThreats: ThreatIncident[] = [
  {
    id: 'T001',
    type: 'civil_unrest',
    severity: 'critical',
    title: 'Major Protests in City Center',
    description: 'Large-scale protests reported near central square. Road closures in effect. Avoid the area.',
    location: {
      lat: 51.5074,
      lng: -0.1278,
      radius: 5,
      address: 'Trafalgar Square',
      city: 'London',
      country: 'United Kingdom'
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    distanceFromUser: 2.3,
    recommendedActions: [
      'Avoid central square area',
      'Use alternative routes',
      'Monitor local news',
      'Keep emergency contacts ready'
    ],
    sources: ['Local Police', 'Intelligence Fusion', 'Media Reports'],
    confidence: 95,
    isActive: true
  },
  {
    id: 'T002',
    type: 'terrorism',
    severity: 'high',
    title: 'Terrorism Alert - Increased Security',
    description: 'Security services have raised threat level. Increased security measures at public venues.',
    location: {
      lat: 51.5074,
      lng: -0.1278,
      radius: 50,
      address: 'London Metropolitan Area',
      city: 'London',
      country: 'United Kingdom'
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    distanceFromUser: 15,
    recommendedActions: [
      'Be vigilant in crowded places',
      'Report suspicious activities',
      'Follow official guidance',
      'Have evacuation plan ready'
    ],
    sources: ['UK Home Office', 'Intelligence Fusion'],
    confidence: 88,
    isActive: true
  },
  {
    id: 'T003',
    type: 'severe_weather',
    severity: 'medium',
    title: 'Severe Storm Warning',
    description: 'Heavy rainfall and strong winds expected. Possible flooding in low-lying areas.',
    location: {
      lat: 13.7563,
      lng: 100.5018,
      radius: 30,
      address: 'Bangkok Metropolitan',
      city: 'Bangkok',
      country: 'Thailand'
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    distanceFromUser: 5420,
    recommendedActions: [
      'Secure loose outdoor items',
      'Stay indoors during peak storm',
      'Avoid flood-prone areas',
      'Keep emergency supplies ready'
    ],
    sources: ['Thai Meteorological Department', 'Intelligence Fusion'],
    confidence: 92,
    isActive: true
  },
  {
    id: 'T004',
    type: 'crime',
    severity: 'high',
    title: 'High Crime Alert - Tourist Areas',
    description: 'Increased reports of pickpocketing and scams targeting tourists. Extra caution advised.',
    location: {
      lat: 19.4326,
      lng: -99.1332,
      radius: 10,
      address: 'Historic Center',
      city: 'Mexico City',
      country: 'Mexico'
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    distanceFromUser: 8950,
    recommendedActions: [
      'Keep valuables secure',
      'Stay in well-lit areas',
      'Use official taxi services only',
      'Travel in groups when possible'
    ],
    sources: ['Local Police', 'US Embassy', 'Intelligence Fusion'],
    confidence: 85,
    isActive: true
  },
  {
    id: 'T005',
    type: 'transport_disruption',
    severity: 'low',
    title: 'Metro Service Delays',
    description: 'Signal failure causing delays on multiple lines. Allow extra travel time.',
    location: {
      lat: 48.8566,
      lng: 2.3522,
      radius: 15,
      address: 'Paris Metro Network',
      city: 'Paris',
      country: 'France'
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    distanceFromUser: 340,
    recommendedActions: [
      'Use alternative transport',
      'Allow extra travel time',
      'Check real-time updates'
    ],
    sources: ['RATP', 'Intelligence Fusion'],
    confidence: 98,
    isActive: true
  },
  {
    id: 'T006',
    type: 'cyber_attack',
    severity: 'medium',
    title: 'Phishing Campaign Targeting Travelers',
    description: 'Sophisticated phishing emails targeting hotel bookings and travel documents.',
    location: {
      lat: 0,
      lng: 0,
      radius: 0,
      address: 'Global',
      city: 'Worldwide',
      country: 'Global'
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    distanceFromUser: 0,
    recommendedActions: [
      'Verify sender email addresses',
      'Do not click suspicious links',
      'Use official booking platforms only',
      'Enable two-factor authentication'
    ],
    sources: ['Cyber Security Agencies', 'Intelligence Fusion'],
    confidence: 90,
    isActive: true
  },
  {
    id: 'T007',
    type: 'health_emergency',
    severity: 'info',
    title: 'Health Advisory - Flu Season',
    description: 'Seasonal flu cases rising. Vaccination recommended for travelers.',
    location: {
      lat: 1.3521,
      lng: 103.8198,
      radius: 50,
      address: 'Singapore',
      city: 'Singapore',
      country: 'Singapore'
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    distanceFromUser: 10800,
    recommendedActions: [
      'Consider flu vaccination',
      'Practice good hygiene',
      'Carry hand sanitizer'
    ],
    sources: ['WHO', 'Singapore Health Ministry'],
    confidence: 95,
    isActive: false
  },
  {
    id: 'T008',
    type: 'natural_disaster',
    severity: 'medium',
    title: 'Seismic Activity Detected',
    description: 'Minor earthquake recorded. No damage reported but aftershocks possible.',
    location: {
      lat: 35.6762,
      lng: 139.6503,
      radius: 100,
      address: 'Tokyo Region',
      city: 'Tokyo',
      country: 'Japan'
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    distanceFromUser: 9580,
    recommendedActions: [
      'Review emergency procedures',
      'Identify safe spaces',
      'Keep emergency kit ready',
      'Monitor official updates'
    ],
    sources: ['Japan Meteorological Agency', 'Intelligence Fusion'],
    confidence: 100,
    isActive: true
  }
];

export const dummyWatchlist: WatchlistLocation[] = [
  {
    id: 'W001',
    name: 'London, UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    radius: 25,
    alertLevel: ['critical', 'high', 'medium'],
    activeThreats: 2,
    currentStatus: 'danger'
  },
  {
    id: 'W002',
    name: 'Bangkok, Thailand',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    radius: 30,
    alertLevel: ['critical', 'high', 'medium'],
    activeThreats: 1,
    currentStatus: 'caution'
  },
  {
    id: 'W003',
    name: 'Mexico City, Mexico',
    coordinates: { lat: 19.4326, lng: -99.1332 },
    radius: 20,
    alertLevel: ['critical', 'high'],
    activeThreats: 1,
    currentStatus: 'danger'
  },
  {
    id: 'W004',
    name: 'Paris, France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    radius: 15,
    alertLevel: ['critical', 'high', 'medium'],
    activeThreats: 1,
    currentStatus: 'caution'
  },
  {
    id: 'W005',
    name: 'Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    radius: 50,
    alertLevel: ['critical', 'high', 'medium', 'low'],
    activeThreats: 0,
    currentStatus: 'safe'
  }
];

export const dummyStatistics: ThreatStatistics = {
  total: 8,
  critical: 1,
  high: 2,
  medium: 3,
  low: 1,
  info: 1,
  activeNearby: 2,
  trend: 'stable'
};
