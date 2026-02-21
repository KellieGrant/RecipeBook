import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaCircleUser, FaMoon, FaSun, FaXmark } from 'react-icons/fa6';
import Logo from '../assets/images/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
   const { isAuthenticated, user, logout } = useAuth();
   const { isDark, toggleTheme } = useTheme();
   const navigate = useNavigate();
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const dropdownRef = useRef(null);
   const mobileMenuRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = event => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
         }
         if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
            setMobileMenuOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const linkClass = ({ isActive }) =>
      isActive
         ? 'text-white dark:text-dark-bg font-bold bg-light-accent dark:bg-dark-accent hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md px-3 py-2'
         : 'text-dark-surface dark:text-dark-text font-bold hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md px-3 py-2';

   const mobileLinkClass = ({ isActive }) =>
      isActive
         ? 'block w-full text-left px-4 py-3 rounded-md font-bold bg-light-accent dark:bg-dark-accent text-white dark:text-dark-bg'
         : 'block w-full text-left px-4 py-3 rounded-md font-bold text-dark-surface dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg';

   const handleLogout = () => {
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      logout();
      navigate('/');
   };

   const closeMobileMenu = () => setMobileMenuOpen(false);

   return (
      <nav className='bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-muted relative' ref={mobileMenuRef}>
         <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='flex h-20 items-center justify-between relative'>
               {/* Spacer for mobile so logo can sit in true center next to hamburger */}
               <div className='w-10 flex-shrink-0 md:hidden' aria-hidden="true" />
               <NavLink
                  className='flex flex-shrink-0 items-center absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0'
                  to='/'
                  onClick={closeMobileMenu}
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

               {/* Desktop nav - hidden on small screens */}
               <div className='hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-2'>
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
                              <div className='absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-dark-bg rounded-lg shadow-lg border border-light-border dark:border-dark-muted z-50'>
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

               {/* Hamburger button - only on small screens */}
               <button
                  type='button'
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className='md:hidden flex items-center justify-center p-2 rounded-md text-dark-surface dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg transition-colors'
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
               >
                  {mobileMenuOpen ? (
                     <FaXmark className='text-2xl' />
                  ) : (
                     <FaBars className='text-2xl' />
                  )}
               </button>
            </div>
         </div>

         {/* Mobile dropdown menu */}
         {mobileMenuOpen && (
            <div className='md:hidden absolute top-full left-0 right-0 bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-muted shadow-lg py-2 z-40'>
               <div className='px-2 space-y-1'>
                  <NavLink to='/' className={mobileLinkClass} onClick={closeMobileMenu}>
                     Home
                  </NavLink>
                  {isAuthenticated ? (
                     <>
                        <NavLink to='/recipes' className={mobileLinkClass} onClick={closeMobileMenu}>
                           My Recipes
                        </NavLink>
                        <NavLink to='/add-recipe' className={mobileLinkClass} onClick={closeMobileMenu}>
                           Add Recipe
                        </NavLink>
                        <div className='px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t border-light-border dark:border-dark-muted mt-2 pt-2'>
                           {user?.username}
                        </div>
                        <button
                           onClick={() => {
                              toggleTheme();
                              closeMobileMenu();
                           }}
                           className='flex items-center gap-2 w-full px-4 py-3 text-left font-bold text-dark-surface dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md'
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
                           className='block w-full text-left px-4 py-3 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md'
                        >
                           Logout
                        </button>
                     </>
                  ) : (
                     <>
                        <button
                           onClick={() => {
                              toggleTheme();
                              closeMobileMenu();
                           }}
                           className='flex items-center gap-2 w-full px-4 py-3 text-left font-bold text-dark-surface dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-dark-bg rounded-md'
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
                        <NavLink to='/login' className={mobileLinkClass} onClick={closeMobileMenu}>
                           Log In
                        </NavLink>
                        <NavLink to='/register' className={mobileLinkClass} onClick={closeMobileMenu}>
                           Register
                        </NavLink>
                     </>
                  )}
               </div>
            </div>
         )}
      </nav>
   );
};

export default Navbar;
