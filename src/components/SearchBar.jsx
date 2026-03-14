import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { FaFilter } from 'react-icons/fa6';
import { useTheme } from '../contexts/ThemeContext';

const SearchBar = ({ query = '', onQueryChange, onOpenFilters }) => {
   const { isDark } = useTheme();

   return (
      <section className='bg-gradient-to-br from-light-bg via-white to-light-secondary dark:from-dark-bg dark:via-dark-surface dark:to-dark-secondary py-10 md:py-12 mb-4'>
         <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
            <div className='w-full max-w-3xl bg-white/85 dark:bg-dark-surface/95 backdrop-blur-sm rounded-2xl shadow-xl border border-light-border/70 dark:border-dark-muted/80 px-5 sm:px-7 py-6'>
               <div className='text-center mb-5'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-dark-surface dark:text-dark-text'>
                     My recipes
                  </h1>
                  <p className='mt-2 text-sm sm:text-base text-light-text dark:text-dark-muted'>
                     Search across your saved dishes and quickly filter by time or meal.
                  </p>
               </div>
               <TextField
                  id='outlined-basic'
                  variant='outlined'
                  fullWidth
                  label='Search recipes'
                  value={query}
                  onChange={e => onQueryChange?.(e.target.value)}
                  sx={{
                     '& .MuiOutlinedInput-root': {
                        color: isDark ? '#E5E7EB' : '#111827',
                        backgroundColor: isDark ? 'rgba(15,23,42,0.85)' : '#FFFFFF',
                     },
                     '& .MuiInputLabel-root': {
                        color: isDark ? '#9CA3AF' : '#6B7280',
                     },
                     '& .MuiInputLabel-root.Mui-focused': {
                        color: '#7BAE7F',
                     },
                     '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDark ? '#4B5563' : '#D4D4D8',
                     },
                     '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                        {
                           borderColor: '#7BAE7F',
                        },
                  }}
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
