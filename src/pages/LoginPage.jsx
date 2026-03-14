import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { apiUrl } from '../config';

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
         const res = await fetch(apiUrl('/api/auth/login'), {
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
      <section className='bg-gradient-to-br from-light-bg via-white to-light-secondary dark:from-dark-bg dark:via-dark-surface dark:to-dark-secondary min-h-[80vh] flex items-center justify-center py-10'>
         <div className='max-w-md w-full mx-4'>
            <div className='bg-white/85 dark:bg-dark-surface/95 backdrop-blur-sm px-7 py-8 rounded-2xl shadow-xl border border-light-border/70 dark:border-dark-muted/80'>
               <div className='mb-6 text-center'>
                  <h2 className='text-2xl md:text-3xl font-heading font-extrabold text-dark-surface dark:text-dark-text'>
                     Welcome back
                  </h2>
                  <p className='mt-2 text-sm text-light-text dark:text-dark-muted'>
                     Log in to access your saved recipes and cooking checklists.
                  </p>
               </div>

               <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                     <label
                        htmlFor='username'
                        className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                     >
                        Username
                     </label>
                     <input
                        type='text'
                        id='username'
                        className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        autoComplete='username'
                     />
                  </div>
                  <div>
                     <label
                        htmlFor='password'
                        className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                     >
                        Password
                     </label>
                     <input
                        type='password'
                        id='password'
                        className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete='current-password'
                     />
                  </div>
                  <button
                     type='submit'
                     disabled={loading}
                     className='inline-flex w-full items-center justify-center rounded-full bg-light-accent dark:bg-dark-accent text-black dark:text-dark-bg px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#6aa16e] dark:hover:opacity-90 transition-transform transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-light-accent/70 dark:focus:ring-dark-accent/70 disabled:opacity-70'
                  >
                     {loading ? 'Logging in...' : 'Log in'}
                  </button>
               </form>
               <p className='mt-4 text-center text-sm text-light-text dark:text-dark-muted'>
                  Don&apos;t have an account?{' '}
                  <Link
                     to='/register'
                     className='text-light-accent dark:text-dark-accent font-semibold hover:underline'
                  >
                     Create one
                  </Link>
               </p>
            </div>
         </div>
      </section>
   );
};

export default LoginPage;
