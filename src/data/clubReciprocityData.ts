// Club reciprocity networks — which memberships unlock access at other clubs
export interface ReciprocityNetwork {
  networkName: string;
  description: string;
  memberClubs: string[]; // club names that participate
  accessLevel: 'full' | 'limited' | 'dining-only';
  maxVisitsPerYear: number;
}

export const RECIPROCITY_NETWORKS: ReciprocityNetwork[] = [
  {
    networkName: 'International Associate Clubs (IAC)',
    description: 'The world\'s largest private club reciprocal network with 200+ clubs across 40 countries.',
    memberClubs: ['The Arts Club', 'The Automobile Club de France', 'The Metropolitan Club', 'The Capital Club', 'The Hong Kong Club', 'The Tower Club', 'The Royal Automobile Club'],
    accessLevel: 'full',
    maxVisitsPerYear: 12,
  },
  {
    networkName: 'Soho House Global',
    description: 'All Soho House memberships grant access to any location worldwide.',
    memberClubs: ['Soho House London', 'Soho House New York', 'Soho House Barcelona', 'Soho House Istanbul', 'Soho House Mumbai', 'Soho House Bangkok', 'Soho House Tokyo'],
    accessLevel: 'full',
    maxVisitsPerYear: 999,
  },
  {
    networkName: 'Leading Clubs of the World',
    description: 'Ultra-premium reciprocal network connecting 50+ of the world\'s most exclusive private clubs.',
    memberClubs: ['The Club at The Ivy', 'The Jonathan Club', 'The Union League Club', 'The Athenaeum', 'The Australian Club'],
    accessLevel: 'full',
    maxVisitsPerYear: 6,
  },
  {
    networkName: 'Yacht Club Reciprocals',
    description: 'Major yacht clubs worldwide offer reciprocal berthing and clubhouse access.',
    memberClubs: ['Royal Yacht Squadron', 'New York Yacht Club', 'Monaco Yacht Club', 'Royal Hong Kong Yacht Club', 'Cruising Yacht Club of Australia'],
    accessLevel: 'full',
    maxVisitsPerYear: 8,
  },
  {
    networkName: 'University Club Network',
    description: 'Ivy League and international university clubs share reciprocal dining and accommodation.',
    memberClubs: ['The Harvard Club', 'The Yale Club', 'The Oxford and Cambridge Club', 'The University Club of New York'],
    accessLevel: 'dining-only',
    maxVisitsPerYear: 10,
  },
];

// Simulated user memberships for demo personas
export const DEMO_MEMBERSHIPS: Record<string, string[]> = {
  john: [
    'Soho House London',
    'The Metropolitan Club',
    'Royal Hong Kong Yacht Club',
    'The Harvard Club',
  ],
  meghan: [
    'Soho House New York',
    'The Arts Club',
    'The Club at The Ivy',
    'Monaco Yacht Club',
  ],
};

export function getReciprocityForMembership(membershipClub: string): ReciprocityNetwork[] {
  return RECIPROCITY_NETWORKS.filter(network => 
    network.memberClubs.some(club => club.toLowerCase() === membershipClub.toLowerCase())
  );
}

export function getAccessibleClubs(userMemberships: string[]): { club: string; network: string; accessLevel: string; maxVisits: number }[] {
  const accessible: { club: string; network: string; accessLevel: string; maxVisits: number }[] = [];
  
  for (const network of RECIPROCITY_NETWORKS) {
    const userHasAccess = userMemberships.some(m => 
      network.memberClubs.some(club => club.toLowerCase() === m.toLowerCase())
    );
    if (userHasAccess) {
      for (const club of network.memberClubs) {
        if (!userMemberships.some(m => m.toLowerCase() === club.toLowerCase())) {
          accessible.push({
            club,
            network: network.networkName,
            accessLevel: network.accessLevel,
            maxVisits: network.maxVisitsPerYear,
          });
        }
      }
    }
  }
  
  return accessible;
}
