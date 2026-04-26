import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, LifeBuoy, Brain, Database, Coins,
  ShieldCheck, ArrowLeft, Eye, Crown, Sparkles, Radio, Network, Receipt, Trophy
} from 'lucide-react';
import { useStaffRole } from '@/hooks/useStaffRole';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/supernomad-logo.jpg';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/concierge', icon: Radio, label: 'Concierge AI', badge: 'LIVE' },
  { to: '/admin/agents', icon: Network, label: 'Agent Council', badge: 'NEW' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/tickets', icon: LifeBuoy, label: 'Support' },
  { to: '/admin/ai', icon: Brain, label: 'AI Analytics' },
  { to: '/admin/brain', icon: Sparkles, label: 'AI Brain' },
  { to: '/admin/directors', icon: Trophy, label: 'AI Directors', badge: 'NEW' },
  { to: '/admin/data', icon: Database, label: 'B2B Data' },
  { to: '/admin/expenses', icon: Receipt, label: 'Tax & Expense', badge: 'NEW' },
  { to: '/admin/affiliates', icon: Coins, label: 'Affiliates' },
  { to: '/admin/audit', icon: ShieldCheck, label: 'Audit Log' },
];

const AdminLayout: React.FC = () => {
  const { role, isDemoMode } = useStaffRole();

  return (
    <div className="min-h-screen bg-[hsl(220_22%_8%)] text-[hsl(30_12%_95%)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-60 border-r border-[hsl(43_96%_56%/0.15)] bg-[hsl(220_22%_6%)] flex flex-col">
        <div className="px-5 py-4 border-b border-[hsl(43_96%_56%/0.15)]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img src={logo} alt="SuperNomad" className="h-9 w-9 rounded-md object-cover ring-1 ring-[hsl(43_96%_56%/0.4)]" />
            <div>
              <div className="font-semibold leading-tight">Back Office</div>
              <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--gold))]">SuperNomad</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end, badge }: any) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))]'
                    : 'text-[hsl(30_12%_75%)] hover:bg-[hsl(220_22%_10%)] hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-[hsl(43_96%_56%/0.15)] space-y-2">
          {isDemoMode ? (
            <Badge className="w-full justify-center bg-amber-500/15 text-amber-400 border-amber-500/30">
              <Eye className="h-3 w-3 mr-1.5" /> Demo / Read-Only
            </Badge>
          ) : (
            <Badge className="w-full justify-center bg-[hsl(43_96%_56%/0.15)] text-[hsl(var(--gold))] border-[hsl(43_96%_56%/0.3)]">
              <Crown className="h-3 w-3 mr-1.5" /> {role}
            </Badge>
          )}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-xs text-[hsl(30_12%_70%)] hover:text-white py-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
