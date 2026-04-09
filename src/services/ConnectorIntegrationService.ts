/**
 * Managed OAuth Connector Integration Service
 * Leverages Lovable Connectors pattern for unified third-party integrations.
 * Provides a demo-friendly abstraction over external service connections.
 */

export type ConnectorStatus = 'connected' | 'disconnected' | 'expired' | 'error';

export interface ConnectorInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'communication' | 'productivity' | 'finance' | 'travel' | 'security' | 'ai';
  status: ConnectorStatus;
  capabilities: string[];
  demoMode: boolean; // true = simulated in demo
  setupUrl?: string;
}

// All available connectors in the SuperNomad ecosystem
const CONNECTOR_REGISTRY: ConnectorInfo[] = [
  // Communication
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    description: 'Team notifications & travel alerts',
    category: 'communication',
    status: 'disconnected',
    capabilities: ['send_alerts', 'team_notifications', 'travel_updates'],
    demoMode: true,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '✈️',
    description: 'Instant travel alerts & bot commands',
    category: 'communication',
    status: 'disconnected',
    capabilities: ['instant_alerts', 'bot_commands', 'document_sharing'],
    demoMode: true,
  },
  {
    id: 'resend',
    name: 'Email (Resend)',
    icon: '📧',
    description: 'Automated email reports & summaries',
    category: 'communication',
    status: 'disconnected',
    capabilities: ['weekly_reports', 'tax_summaries', 'visa_reminders'],
    demoMode: true,
  },

  // Productivity
  {
    id: 'linear',
    name: 'Linear',
    icon: '📋',
    description: 'Task management for relocation projects',
    category: 'productivity',
    status: 'disconnected',
    capabilities: ['task_tracking', 'project_management', 'deadline_reminders'],
    demoMode: true,
  },
  {
    id: 'contentful',
    name: 'Contentful',
    icon: '📝',
    description: 'Country guides & travel content',
    category: 'productivity',
    status: 'disconnected',
    capabilities: ['content_delivery', 'country_guides', 'travel_tips'],
    demoMode: true,
  },
  {
    id: 'aws_s3',
    name: 'AWS S3',
    icon: '☁️',
    description: 'Cloud document backup & storage',
    category: 'productivity',
    status: 'disconnected',
    capabilities: ['document_backup', 'file_storage', 'encrypted_vault_sync'],
    demoMode: true,
  },

  // AI & Voice
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    icon: '🎙️',
    description: 'AI voice for Concierge',
    category: 'ai',
    status: 'connected', // Already integrated
    capabilities: ['text_to_speech', 'voice_cloning', 'multilingual_voice'],
    demoMode: false,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: '🔍',
    description: 'Real-time research & fact-checking',
    category: 'ai',
    status: 'disconnected',
    capabilities: ['web_search', 'fact_checking', 'real_time_data'],
    demoMode: true,
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    icon: '🕷️',
    description: 'Web scraping for visa & embassy updates',
    category: 'ai',
    status: 'disconnected',
    capabilities: ['web_scraping', 'data_extraction', 'visa_tracking'],
    demoMode: true,
  },

  // Security
  {
    id: 'aikido',
    name: 'Aikido Security',
    icon: '🛡️',
    description: 'Security scanning & threat detection',
    category: 'security',
    status: 'disconnected',
    capabilities: ['vulnerability_scan', 'threat_detection', 'compliance_check'],
    demoMode: true,
  },
];

/**
 * Get all connectors, optionally filtered by category
 */
export function getConnectors(category?: ConnectorInfo['category']): ConnectorInfo[] {
  if (category) return CONNECTOR_REGISTRY.filter(c => c.category === category);
  return [...CONNECTOR_REGISTRY];
}

/**
 * Get a specific connector by ID
 */
export function getConnector(id: string): ConnectorInfo | undefined {
  return CONNECTOR_REGISTRY.find(c => c.id === id);
}

/**
 * Get connectors by status
 */
export function getConnectedServices(): ConnectorInfo[] {
  return CONNECTOR_REGISTRY.filter(c => c.status === 'connected');
}

/**
 * Simulate connecting a service (demo mode)
 */
export function simulateConnect(connectorId: string): ConnectorInfo | null {
  const connector = CONNECTOR_REGISTRY.find(c => c.id === connectorId);
  if (connector) {
    connector.status = 'connected';
    return { ...connector };
  }
  return null;
}

/**
 * Simulate disconnecting a service (demo mode)
 */
export function simulateDisconnect(connectorId: string): ConnectorInfo | null {
  const connector = CONNECTOR_REGISTRY.find(c => c.id === connectorId);
  if (connector && connector.id !== 'elevenlabs') {
    connector.status = 'disconnected';
    return { ...connector };
  }
  return null;
}

/**
 * Get capabilities across all connected services
 */
export function getActiveCapabilities(): string[] {
  return CONNECTOR_REGISTRY
    .filter(c => c.status === 'connected')
    .flatMap(c => c.capabilities);
}

/**
 * Check if a specific capability is available via any connected service
 */
export function hasCapability(capability: string): boolean {
  return getActiveCapabilities().includes(capability);
}

/**
 * Get connector recommendations based on user's current features
 */
export function getRecommendedConnectors(activeFeatureIds: string[]): ConnectorInfo[] {
  const recommendations: ConnectorInfo[] = [];

  // If using tax features, recommend email for reports
  if (activeFeatureIds.some(id => id.includes('tax'))) {
    const resend = getConnector('resend');
    if (resend && resend.status !== 'connected') recommendations.push(resend);
  }

  // If using safety features, recommend Telegram for instant alerts
  if (activeFeatureIds.some(id => ['threats', 'emergency', 'sos-services'].includes(id))) {
    const telegram = getConnector('telegram');
    if (telegram && telegram.status !== 'connected') recommendations.push(telegram);
  }

  // If using AI features, recommend Perplexity for real-time data
  if (activeFeatureIds.some(id => id.includes('ai-'))) {
    const perplexity = getConnector('perplexity');
    if (perplexity && perplexity.status !== 'connected') recommendations.push(perplexity);
  }

  // If using document vault, recommend S3 backup
  if (activeFeatureIds.includes('vault')) {
    const s3 = getConnector('aws_s3');
    if (s3 && s3.status !== 'connected') recommendations.push(s3);
  }

  return recommendations.slice(0, 3);
}

/**
 * Get a summary for the AI concierge to know what integrations are active
 */
export function getIntegrationContextForAI(): string {
  const connected = getConnectedServices();
  if (connected.length === 0) {
    return 'No third-party integrations are currently active. All features operate in standalone mode.';
  }

  return `Active integrations: ${connected.map(c => `${c.name} (${c.capabilities.join(', ')})`).join('; ')}. ` +
    `These can be leveraged for enhanced functionality.`;
}
