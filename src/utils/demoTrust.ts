import { TrustTier } from '@/services/TrustPassService';

/**
 * Deterministic demo tier assignment for community profiles.
 * Used so Pulse / Vibe / Marketplace show a believable spread of verification tiers.
 *
 * Hash distribution (~roughly):
 *   • 15% Sovereign (gold)
 *   • 35% Nomad
 *   • 35% Human
 *   • 15% Unverified
 */
export function getDemoTierForId(id: string): TrustTier {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const bucket = Math.abs(hash) % 100;
  if (bucket < 15) return 'sovereign';
  if (bucket < 50) return 'nomad';
  if (bucket < 85) return 'human';
  return 'unverified';
}

/** Deterministic Vibe-Match score (0-100) between current user and another id. */
export function getDemoVibeScore(myId: string, theirId: string): number {
  let hash = 0;
  const combined = [myId, theirId].sort().join('|');
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  // Cluster scores in the 60-99 range to feel realistic
  return 60 + (Math.abs(hash) % 40);
}
