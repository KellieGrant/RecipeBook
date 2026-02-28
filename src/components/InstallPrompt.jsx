import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa6';

const DISMISS_KEY = 'recipebook_install_dismissed';

const isIOS = () =>
   /iPad|iPhone|iPod/.test(navigator.userAgent) ||
   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isStandalone = () =>
   window.matchMedia('(display-mode: standalone)').matches ||
   window.navigator.standalone === true;

const InstallPrompt = () => {
   const [deferredPrompt, setDeferredPrompt] = useState(null);
   const [dismissed, setDismissed] = useState(() => {
      try {
         return localStorage.getItem(DISMISS_KEY) === 'true';
      } catch {
         return false;
      }
   });
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      if (isStandalone() || dismissed) return;

      const handler = e => {
         e.preventDefault();
         setDeferredPrompt(e);
         setVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      if (isIOS()) setVisible(true);
      return () => window.removeEventListener('beforeinstallprompt', handler);
   }, [dismissed]);

   const handleInstall = async () => {
      if (deferredPrompt) {
         await deferredPrompt.prompt();
         const { outcome } = await deferredPrompt.userChoice;
         if (outcome === 'accepted') setVisible(false);
         setDeferredPrompt(null);
      }
      setVisible(false);
      try {
         localStorage.setItem(DISMISS_KEY, 'true');
      } catch {}
      setDismissed(true);
   };

   const handleDismiss = () => {
      setVisible(false);
      try {
         localStorage.setItem(DISMISS_KEY, 'true');
      } catch {}
      setDismissed(true);
   };

   if (!visible) return null;

   const isIOSDevice = isIOS();

   return (
      <div className='fixed bottom-0 left-0 right-0 z-50 md:hidden'>
         <div className='mx-3 mb-3 flex items-center justify-between gap-3 rounded-lg bg-light-accent dark:bg-dark-accent px-4 py-3 shadow-lg text-white dark:text-dark-bg'>
            <p className='text-sm font-medium'>
               {deferredPrompt
                  ? 'Install Recipe Book to follow recipes in the kitchen'
                  : isIOSDevice
                    ? 'Tap Share in Safari, then “Add to Home Screen” to install'
                    : 'Add to Home Screen to use Recipe Book like an app'}
            </p>
            <div className='flex flex-shrink-0 items-center gap-2'>
               <button
                  type='button'
                  onClick={handleInstall}
                  className='rounded-full bg-white dark:bg-dark-bg px-3 py-1.5 text-sm font-bold text-light-accent dark:text-dark-accent'
               >
                  {deferredPrompt ? 'Install' : 'Got it'}
               </button>
               <button
                  type='button'
                  onClick={handleDismiss}
                  className='p-1 rounded hover:bg-white/20'
                  aria-label='Dismiss'
               >
                  <FaTimes className='text-lg' />
               </button>
            </div>
         </div>
      </div>
   );
};

export default InstallPrompt;
