import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
   return (
      <>
         <section className='text-center flex flex-col justify-center items-center h-96 text-gray-900 dark:text-dark-text'>
            <FaExclamationTriangle className='text-yellow-400 dark:text-yellow-500 text-6xl mb-4' />
            <h1 className='text-6xl font-bold mb-4'>404 Not Found</h1>
            <p className='text-xl mb-5'>This page does not exist</p>
            <Link
               to='/'
               className='text-white dark:text-dark-bg bg-indigo-700 dark:bg-dark-accent hover:bg-indigo-900 dark:hover:opacity-90 rounded-md px-3 py-2 mt-4'
            >
               Go Back
            </Link>
         </section>
      </>
   );
};

export default NotFoundPage;
