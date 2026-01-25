import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { FaFilter } from 'react-icons/fa6';

const SearchBar = ({ query = '', onQueryChange, onOpenFilters }) => {
   return (
      <section className='bg-light-accent py-10 mb-4'>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
            <div className='text-center'>
               <h1 className='text-4xl font-extrabold text-white sm:text-5xl md:text-6xl'>
                  Find Your Recipe
               </h1>
               <p className='my-4 text-xl text-light-secondary'>
                  Stop flipping to an earmarked page. Just search it!
               </p>
               <TextField
                  id='outlined-basic'
                  variant='filled'
                  fullWidth
                  label='Search'
                  value={query}
                  onChange={e => onQueryChange?.(e.target.value)}
                  className='bg-light-secondary'
                  InputProps={
                     onOpenFilters
                        ? {
                             endAdornment: (
                                <InputAdornment position='end'>
                                   <IconButton
                                      aria-label='Open filters'
                                      onClick={onOpenFilters}
                                      edge='end'
                                   >
                                      <FaFilter />
                                   </IconButton>
                                </InputAdornment>
                             ),
                          }
                        : undefined
                  }
               />
            </div>
         </div>
      </section>
   );
};

export default SearchBar;
