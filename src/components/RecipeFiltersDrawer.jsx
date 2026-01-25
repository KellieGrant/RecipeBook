import React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { FaXmark } from 'react-icons/fa6';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const LIGHT_ACCENT = '#7BAE7F';

const RecipeFiltersDrawer = ({
   open,
   onClose,
   filters,
   onChange,
   onClear,
}) => {
   const setField = (field, value) => onChange?.({ ...filters, [field]: value });

   const toggleMealType = type => {
      const current = new Set(filters.mealTypes ?? []);
      if (current.has(type)) current.delete(type);
      else current.add(type);
      setField('mealTypes', Array.from(current));
   };

   return (
      <Drawer
         anchor='right'
         open={open}
         onClose={onClose}
         PaperProps={{
            sx: {
               '& .MuiButton-contained': {
                  backgroundColor: LIGHT_ACCENT,
                  color: '#000',
                  '&:hover': { backgroundColor: '#6aa16e' },
               },
               '& .MuiButton-outlined': {
                  borderColor: LIGHT_ACCENT,
                  color: LIGHT_ACCENT,
                  '&:hover': { borderColor: LIGHT_ACCENT, backgroundColor: '#7bae7f1a' },
               },
               '& .MuiCheckbox-root': {
                  color: LIGHT_ACCENT,
                  '&.Mui-checked': { color: LIGHT_ACCENT },
               },
               '& .MuiInputLabel-root.Mui-focused': {
                  color: LIGHT_ACCENT,
               },
               '& .MuiFilledInput-underline:after': {
                  borderBottomColor: LIGHT_ACCENT,
               },
               '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: LIGHT_ACCENT,
               },
               '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: LIGHT_ACCENT,
               },
            },
         }}
      >
         <div className='w-[320px] sm:w-[380px] p-4'>
            <div className='flex items-center justify-between'>
               <Typography variant='h6' className='text-light-text'>
                  Filters
               </Typography>
               <IconButton aria-label='Close filters' onClick={onClose}>
                  <FaXmark />
               </IconButton>
            </div>

            <Divider className='my-3' />

            <Typography variant='subtitle2' className='text-light-text mb-2'>
               Meal type
            </Typography>
            <FormGroup>
               {MEAL_TYPES.map(type => (
                  <FormControlLabel
                     key={type}
                     control={
                        <Checkbox
                           checked={(filters.mealTypes ?? []).includes(type)}
                           onChange={() => toggleMealType(type)}
                        />
                     }
                     label={type}
                  />
               ))}
            </FormGroup>

            <Divider className='my-3' />

            <Typography variant='subtitle2' className='text-light-text mb-2'>
               Max time (minutes)
            </Typography>
            <TextField
               type='number'
               fullWidth
               value={filters.maxTimeMinutes ?? ''}
               onChange={e => {
                  const raw = e.target.value;
                  setField('maxTimeMinutes', raw === '' ? '' : Number(raw));
               }}
               inputProps={{ min: 0 }}
               placeholder='e.g. 30'
            />

            <div className='mt-4 flex gap-2'>
               <Button variant='outlined' fullWidth onClick={onClear}>
                  Clear
               </Button>
               <Button variant='contained' fullWidth onClick={onClose}>
                  Done
               </Button>
            </div>
         </div>
      </Drawer>
   );
};

export default RecipeFiltersDrawer;
