export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ThreatCategory = 
  | 'terrorism' 
  | 'civil_unrest' 
  | 'natural_disaster' 
  | 'cyber_attack' 
  | 'crime' 
  | 'health_emergency' 
  | 'transport_disruption' 
  | 'severe_weather';

export interface ThreatLocation {
  lat: number;
  lng: number;
  radius: number;
  address: string;
  city: string;
  country: string;
}

export interface ThreatIncident {
  id: string;
  type: ThreatCategory;
  severity: ThreatSeverity;
  title: string;
  description: string;
  location: ThreatLocation;
  timestamp: string;
  distanceFromUser: number;
  recommendedActions: string[];
  sources: string[];
  confidence: number;
  isActive: boolean;
}

export interface WatchlistLocation {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  radius: number;
  alertLevel: ThreatSeverity[];
  activeThreats: number;
  currentStatus: 'safe' | 'caution' | 'danger';
}

export interface ThreatStatistics {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  activeNearby: number;
  trend: 'improving' | 'stable' | 'deteriorating';
}

export interface AlertPreferences {
  pushNotifications: {
    critical: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    overrideFor: ThreatSeverity[];
  };
  monitoringRadius: number;
  categories: ThreatCategory[];
}
