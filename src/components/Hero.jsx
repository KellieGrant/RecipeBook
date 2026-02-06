import React from 'react';

const Hero = () => {
   return (
      <section className='bg-light-accent dark:bg-dark-accent py-20 mb-4'>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
            <div className='text-center'>
               <h1 className='text-4xl font-extrabold text-white dark:text-dark-bg sm:text-5xl md:text-6xl'>
                  Make the Ultimate Dinner
               </h1>
               <p className='my-4 text-xl text-light-secondary dark:text-dark-bg/80'>
                  Find the perfect Recipe that fits your mood
               </p>
            </div>
         </div>
      </section>
   );
};

export default Hero;
