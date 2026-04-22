import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStaffRole } from '@/hooks/useStaffRole';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, requireAdmin = false }) => {
  const { isStaff, isAdmin, isLoading } = useStaffRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isStaff || (requireAdmin && !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
