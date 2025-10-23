import { ThreatIncident, WatchlistLocation, ThreatStatistics, ThreatSeverity } from '@/types/threat';
import { dummyThreats, dummyWatchlist, dummyStatistics } from '@/data/threatData';

export class ThreatIntelligenceService {
  // Get all active threats
  static getActiveThreats(maxDistance?: number): ThreatIncident[] {
    let threats = dummyThreats.filter(t => t.isActive);
    
    if (maxDistance) {
      threats = threats.filter(t => t.distanceFromUser <= maxDistance);
    }
    
    return threats.sort((a, b) => {
      const severityOrder: Record<ThreatSeverity, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
        info: 4
      };
      
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      
      return a.distanceFromUser - b.distanceFromUser;
    });
  }

  // Get threats near user
  static getNearbyThreats(radius: number = 50): ThreatIncident[] {
    return this.getActiveThreats(radius);
  }

  // Get critical threats that require immediate attention
  static getCriticalThreats(): ThreatIncident[] {
    return dummyThreats.filter(t => 
      t.isActive && 
      (t.severity === 'critical' || t.severity === 'high') &&
      t.distanceFromUser < 100
    );
  }

  // Check if user is in danger zone
  static isUserInDangerZone(): boolean {
    const criticalNearby = this.getCriticalThreats()
      .filter(t => t.distanceFromUser < 25);
    return criticalNearby.length > 0;
  }

  // Get watchlist locations
  static getWatchlist(): WatchlistLocation[] {
    return dummyWatchlist;
  }

  // Get threat statistics
  static getStatistics(): ThreatStatistics {
    return dummyStatistics;
  }

  // Get severity info
  static getSeverityInfo(severity: ThreatSeverity) {
    const severityMap = {
      critical: {
        icon: '🔴',
        label: 'Critical',
        color: 'destructive',
        description: 'Immediate danger - take action now'
      },
      high: {
        icon: '🟠',
        label: 'High',
        color: 'destructive',
        description: 'Serious threat - exercise extreme caution'
      },
      medium: {
        icon: '🟡',
        label: 'Medium',
        color: 'secondary',
        description: 'Moderate risk - stay alert'
      },
      low: {
        icon: '🟢',
        label: 'Low',
        color: 'default',
        description: 'Minor concern - be aware'
      },
      info: {
        icon: '🔵',
        label: 'Info',
        color: 'default',
        description: 'General advisory'
      }
    };
    
    return severityMap[severity];
  }

  // Get category info
  static getCategoryInfo(category: string) {
    const categoryMap: Record<string, { icon: string; label: string }> = {
      terrorism: { icon: '💣', label: 'Terrorism' },
      civil_unrest: { icon: '⚠️', label: 'Civil Unrest' },
      natural_disaster: { icon: '🌪️', label: 'Natural Disaster' },
      cyber_attack: { icon: '💻', label: 'Cyber Attack' },
      crime: { icon: '🚨', label: 'Crime' },
      health_emergency: { icon: '🏥', label: 'Health Emergency' },
      transport_disruption: { icon: '🚇', label: 'Transport Disruption' },
      severe_weather: { icon: '⛈️', label: 'Severe Weather' }
    };
    
    return categoryMap[category] || { icon: '⚠️', label: 'Unknown' };
  }

  // Format time ago
  static getTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
}
