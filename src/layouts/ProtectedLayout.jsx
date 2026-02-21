import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

const ProtectedLayout = () => {
   const { isAuthenticated, loading } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (!loading && !isAuthenticated) {
         navigate('/', { replace: true });
      }
   }, [loading, isAuthenticated, navigate]);

   if (loading) return <Spinner loading={true} />;
   if (!isAuthenticated) return null;

   return <Outlet />;
};

export default ProtectedLayout;
