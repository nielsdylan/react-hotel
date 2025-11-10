// src/routes/PublicRoute.tsx

import { useEffect, useState, type ReactNode  } from "react";
import { Navigate } from "react-router";
import { isAuthenticated } from './isAuthenticated';
import Loader from '@/components/Loader'

interface PublicRouteProps {
  children: ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const status = await isAuthenticated();
      setAuthStatus(status);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    // return <div>Cargando...</div>;
    return <Loader height="100vh"/>;
  }
  
  if (authStatus) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export default PublicRoute;