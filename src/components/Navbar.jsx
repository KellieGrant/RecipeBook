import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaCircleUser, FaMoon, FaSun } from 'react-icons/fa6';
import Logo from '../assets/images/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
   const { isAuthenticated, user, logout } = useAuth();
   const { isDark, toggleTheme } = useTheme();
   const navigate = useNavigate();
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const dropdownRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = event => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const linkClass = ({ isActive }) =>
      isActive
         ? 'text-white dark:text-dark-bg font-bold bg-light-accent dark:bg-dark-accent hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md px-3 py-2'
         : 'text-dark-surface dark:text-dark-text font-bold hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md px-3 py-2';

   const handleLogout = () => {
      setDropdownOpen(false);
      logout();
      navigate('/');
   };

   return (
      <nav className='bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-muted'>
         <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='flex h-20 items-center justify-between'>
               <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
                  <NavLink
                     className='flex flex-shrink-0 items-center mr-4'
                     to='/'
                  >
                     <img
                        className='h-10 w-auto'
                        src={Logo}
                        alt='Recipe Book'
                     />
                        <span className='hidden md:block text-light-text dark:text-dark-text text-2xl font-bold ml-2'>
                        Recipe Book
                     </span>
                  </NavLink>
                  <div className='md:ml-auto'>
                     <div className='flex items-center space-x-2'>
                        <NavLink to='/' className={linkClass}>
                           Home
                        </NavLink>
                        {isAuthenticated ? (
                           <>
                              <NavLink to='/recipes' className={linkClass}>
                                 My Recipes
                              </NavLink>
                              <NavLink to='/add-recipe' className={linkClass}>
                                 Add Recipe
                              </NavLink>
                              <div className='relative' ref={dropdownRef}>
                                 <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className='flex items-center justify-center p-2 text-dark-surface dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md transition-colors'
                                    aria-label='Account menu'
                                 >
                                    <FaCircleUser className='text-2xl' />
                                 </button>
                                 {dropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-dark-bg rounded-lg shadow-lg border border-light-border dark:border-dark-muted'>
                                      <div className='px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-light-border dark:border-dark-muted'>
                                        {user?.username}
                                      </div>
                                      <button
                                         onClick={() => {
                                            toggleTheme();
                                            setDropdownOpen(false);
                                         }}
                                         className='flex items-center gap-2 w-full px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface'
                                      >
                                         {isDark ? (
                                            <>
                                               <FaSun className='text-lg' />
                                               Light Mode
                                            </>
                                         ) : (
                                            <>
                                               <FaMoon className='text-lg' />
                                               Dark Mode
                                            </>
                                         )}
                                      </button>
                                      <button
                                         onClick={handleLogout}
                                         className='block w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                      >
                                         Logout
                                      </button>
                                    </div>
                                 )}
                              </div>
                           </>
                        ) : (
                           <>
                              <button
                                 onClick={toggleTheme}
                                 className='flex items-center justify-center p-2 text-dark-surface dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md transition-colors'
                                 aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                              >
                                 {isDark ? (
                                    <FaSun className='text-xl' />
                                 ) : (
                                    <FaMoon className='text-xl' />
                                 )}
                              </button>
                              <NavLink to='/login' className={linkClass}>
                                 Log In
                              </NavLink>
                              <NavLink to='/register' className={linkClass}>
                                 Register
                              </NavLink>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </nav>
   );
};

export default Navbar;
