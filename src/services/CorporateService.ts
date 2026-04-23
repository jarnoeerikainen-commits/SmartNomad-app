/**
 * Corporate (B2B) Service
 * Wraps org-management edge function and direct table queries.
 */
import { supabase } from '@/integrations/supabase/client';

export type OrgRole = 'owner' | 'admin' | 'manager' | 'employee';
export type TripStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'booked' | 'completed' | 'cancelled';
export type ExpenseCategory =
  | 'flight' | 'hotel' | 'rail' | 'car_rental' | 'taxi' | 'meals'
  | 'entertainment' | 'communication' | 'visa' | 'insurance' | 'other';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  billing_email: string;
  billing_method: string;
  billing_currency: string;
  country_code: string | null;
  join_code: string;
  logo_url: string | null;
  size_band: string | null;
  industry: string | null;
  demo: boolean;
  is_active: boolean;
  travel_policy: Record<string, unknown>;
  created_at: string;
}

export interface OrgMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  department: string | null;
  employee_id: string | null;
  job_title: string | null;
  cost_center: string | null;
  is_active: boolean;
  joined_at: string;
}

export interface BusinessTrip {
  id: string;
  organization_id: string;
  member_id: string;
  user_id: string;
  trip_code: string;
  purpose: string;
  destination_city: string | null;
  destination_country: string | null;
  origin_city: string | null;
  start_date: string;
  end_date: string;
  estimated_cost: number;
  actual_cost: number;
  currency: string;
  status: TripStatus;
  approver_id: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrgDashboardStats {
  members_total: number;
  trips_total: number;
  trips_pending: number;
  trips_active: number;
  spend_30d: number;
  spend_ytd: number;
  top_destinations: Array<{ country: string; trips: number; spend: number }>;
  spend_by_category: Record<string, number>;
}

async function callOrgFn<T = unknown>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke('org-management', {
    body: { action, ...body },
  });
  if (error) throw new Error(error.message);
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as T;
}

export const CorporateService = {
  // List orgs the current user belongs to (also returns demo orgs)
  async listMyOrgs(): Promise<Array<Organization & { my_role: OrgRole }>> {
    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select('role, organization:organizations(*)')
      .eq('is_active', true);
    if (error) throw new Error(error.message);
    return (memberships || [])
      .filter(m => m.organization)
      .map(m => ({ ...(m.organization as unknown as Organization), my_role: m.role as OrgRole }));
  },

  async listDemoOrgs(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations').select('*').eq('demo', true).limit(5);
    if (error) throw new Error(error.message);
    return (data || []) as Organization[];
  },

  async getOrg(orgId: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations').select('*').eq('id', orgId).maybeSingle();
    if (error) throw new Error(error.message);
    return data as Organization | null;
  },

  async listMembers(orgId: string): Promise<OrgMember[]> {
    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', orgId)
      .order('joined_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as OrgMember[];
  },

  async listTrips(orgId: string): Promise<BusinessTrip[]> {
    const { data, error } = await supabase
      .from('business_trips')
      .select('*')
      .eq('organization_id', orgId)
      .order('start_date', { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data || []) as BusinessTrip[];
  },

  async getStats(orgId: string): Promise<OrgDashboardStats> {
    const result = await callOrgFn<{ stats: OrgDashboardStats }>('get_stats', { organization_id: orgId });
    return result.stats;
  },

  // Edge function actions
  createOrg(payload: {
    name: string;
    billing_email: string;
    billing_method?: string;
    country_code?: string;
    size_band?: string;
    industry?: string;
    legal_name?: string;
    tax_id?: string;
  }) {
    return callOrgFn<{ organization: Organization }>('create_org', payload);
  },

  joinByCode(payload: { join_code: string; department?: string; employee_id?: string; job_title?: string }) {
    return callOrgFn<{ organization: Organization; member: OrgMember; already_member?: boolean }>('join_by_code', payload);
  },

  invite(payload: { organization_id: string; email: string; role?: OrgRole; department?: string }) {
    return callOrgFn('invite', payload);
  },

  submitTrip(trip_id: string) {
    return callOrgFn<{ trip: BusinessTrip }>('submit_trip', { trip_id });
  },

  approveTrip(payload: { trip_id: string; approve: boolean; rejection_reason?: string }) {
    return callOrgFn<{ trip: BusinessTrip }>('approve_trip', payload);
  },

  leaveOrg(organization_id: string) {
    return callOrgFn('leave_org', { organization_id });
  },

  async createTrip(payload: {
    organization_id: string;
    member_id: string;
    purpose: string;
    destination_city?: string;
    destination_country?: string;
    origin_city?: string;
    start_date: string;
    end_date: string;
    estimated_cost: number;
    currency?: string;
    notes?: string;
  }): Promise<BusinessTrip> {
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) throw new Error('not_authenticated');
    const { data, error } = await supabase
      .from('business_trips')
      .insert({
        ...payload,
        user_id: u.user.id,
        currency: payload.currency || 'USD',
        status: 'draft',
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as BusinessTrip;
  },
};
