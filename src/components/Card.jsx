import React from 'react';

const Card = ({ children, bg = 'bg-light-secondary' }) => {
   return (
      <div
         className={`${bg} dark:bg-dark-surface p-6 rounded-lg shadow-md text-gray-900 dark:text-dark-text border border-transparent dark:border-dark-muted`}
      >
         {children}
      </div>
   );
};

export default Card;
