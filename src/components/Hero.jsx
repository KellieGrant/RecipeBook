import React from 'react';

const Hero = () => {
   return (
      <section className='relative overflow-hidden bg-gradient-to-br from-light-accent via-light-bg to-light-secondary dark:from-dark-bg dark:via-dark-surface dark:to-dark-accent py-16 md:py-20'>
         <div className='pointer-events-none absolute inset-0 opacity-40 dark:opacity-30'>
            <div className='absolute -top-32 -right-16 h-72 w-72 rounded-full bg-white/40 blur-3xl dark:bg-dark-secondary/30' />
            <div className='absolute -bottom-40 -left-10 h-80 w-80 rounded-full bg-light-accent/40 blur-3xl dark:bg-dark-accent/40' />
         </div>

         <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center'>
            <span className='inline-flex items-center rounded-full bg-white/70 dark:bg-dark-bg/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted shadow-sm mb-4'>
               Your personal recipe companion
            </span>

            <h1 className='font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark-surface dark:text-dark-text'>
               Cook smarter,
               <span className='text-light-accent dark:text-dark-accent'> not harder.</span>
            </h1>

            <p className='mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-light-text dark:text-dark-muted'>
            Because “I swear I saved that recipe somewhere” isn’t a system.
            </p>

            <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-4'>
               <a
                  href='#recipes'
                  className='inline-flex items-center justify-center rounded-full bg-light-accent text-black dark:text-dark-bg px-8 py-3 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-transform transition-shadow duration-150'
               >
                  Browse recipes
               </a>
               <a
                  href='/add-recipe'
                  className='inline-flex items-center justify-center rounded-full border border-light-accent/70 text-light-accent dark:text-dark-accent px-8 py-3 text-sm sm:text-base font-semibold hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 backdrop-blur-sm transition-colors duration-150'
               >
                  Add your own
               </a>
            </div>
         </div>
      </section>
   );
};

export default Hero;
