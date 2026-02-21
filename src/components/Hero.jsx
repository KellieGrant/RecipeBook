import React from 'react';

const Hero = () => {
   return (
      <section className='bg-light-accent dark:bg-dark-accent py-8 mb-2'>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
            <div className='text-center'>
               <h1 className='text-2xl font-extrabold text-white dark:text-dark-bg sm:text-3xl md:text-4xl'>
                  Make the Ultimate Dinner
               </h1>
               <p className='mt-2 mb-0 text-base text-light-secondary dark:text-dark-bg/80 sm:text-lg'>
                  Find the perfect Recipe that fits your mood
               </p>
            </div>
         </div>
      </section>
   );
};

export default Hero;
