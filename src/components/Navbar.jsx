import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const Navbar = () => {
   const linkClass = ({ isActive }) =>
      isActive
         ? 'text-white bg-light-accent hover:bg-light-accent hover:text-white rounded-md px-3 py-2'
         : 'text-dark-surface hover:bg-light-accent hover:text-white rounded-md px-3 py-2';

   return (
      <>
         <nav className='bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-muted'>
            <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
               <div className='flex h-20 items-center justify-between'>
                  <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
                     {/* <!-- Logo --> */}
                     <NavLink
                        className='flex flex-shrink-0 items-center mr-4'
                        to='/'
                     >
                        <img
                           className='h-10 w-auto'
                           src={Logo}
                           alt='React Jobs'
                        />
                        <span className='hidden md:block text-light-gray text-2xl font-bold ml-2'>
                           Recipe Book
                        </span>
                     </NavLink>
                     <div className='md:ml-auto'>
                        <div className='flex space-x-2'>
                           <NavLink to='/' className={linkClass}>
                              Home
                           </NavLink>
                           <NavLink to='/recipes' className={linkClass}>
                              Recipes
                           </NavLink>
                           <NavLink to='/add-recipe' className={linkClass}>
                              Add Recipe
                           </NavLink>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </nav>
      </>
   );
};

export default Navbar;
