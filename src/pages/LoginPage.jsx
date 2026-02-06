import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const { login } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async e => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
         });
         const data = await res.json();
         if (!res.ok) {
            throw new Error(data.error || 'Login failed');
         }
         login(data.user, data.token);
         toast.success('Logged in successfully!');
         navigate('/recipes');
      } catch (err) {
         toast.error(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <section className='bg-light-bg dark:bg-dark-bg min-h-[70vh] flex items-center justify-center py-12'>
         <div className='bg-light-secondary dark:bg-dark-surface px-8 py-10 rounded-lg shadow-md max-w-md w-full mx-4 border border-transparent dark:border-dark-muted'>
            <h2 className='text-2xl font-bold text-center mb-6 text-gray-900 dark:text-dark-text'>Log In</h2>
            <form onSubmit={handleSubmit}>
               <div className='mb-4'>
                  <label
                     htmlFor='username'
                     className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                  >
                     Username
                  </label>
                  <input
                     type='text'
                     id='username'
                     className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                     value={username}
                     onChange={e => setUsername(e.target.value)}
                     required
                     autoComplete='username'
                  />
               </div>
               <div className='mb-6'>
                  <label
                     htmlFor='password'
                     className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                  >
                     Password
                  </label>
                  <input
                     type='password'
                     id='password'
                     className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     required
                     autoComplete='current-password'
                  />
               </div>
               <button
                  type='submit'
                  disabled={loading}
                  className='bg-light-accent hover:bg-[#6aa16e] text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:opacity-70'
               >
                  {loading ? 'Logging in...' : 'Log In'}
               </button>
            </form>
            <p className='mt-4 text-center text-gray-600 dark:text-dark-muted'>
               Don&apos;t have an account?{' '}
               <Link to='/register' className='text-light-accent dark:text-dark-accent font-bold hover:underline'>
                  Register
               </Link>
            </p>
         </div>
      </section>
   );
};

export default LoginPage;
