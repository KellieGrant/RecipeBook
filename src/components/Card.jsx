import React from 'react';

const Card = ({ children, bg = 'bg-light-secondary' }) => {
   return (
      <div
         className={`${bg} dark:bg-dark-surface p-6 md:p-7 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform transition-shadow duration-150 text-gray-900 dark:text-dark-text border border-light-border/40 dark:border-dark-muted/70 backdrop-blur-sm`}
      >
         {children}
      </div>
   );
};

export default Card;
