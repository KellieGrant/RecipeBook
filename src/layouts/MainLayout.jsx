import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import InstallPrompt from '../components/InstallPrompt';

const MainLayout = () => {
   return (
      <>
         <Navbar />
         <Outlet />
         <InstallPrompt />
         <ToastContainer />
      </>
   );
};

export default MainLayout;
