import { useState } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditRecipePage = ({ updateRecipeSubmit }) => {
   const recipe = useLoaderData();

   const norlaizedRecipe = {
      title: recipe.title ?? '',
      type: recipe.type ?? '',
      description: recipe.description ?? '',
      time: recipe.time ?? '',
      imgUrl: recipe.imgUrl ?? recipe.imageUrl ?? '',
      ingredients: recipe.ingredients ?? recipe.creator?.ingredients ?? '',
      instructions: recipe.instructions ?? '',
      creator: {
         name: recipe.creator?.name ?? '',
         ingredients: recipe.ingredients ?? recipe.creator?.ingredients ?? '',
      },
   };

   const [title, setTitle] = useState(norlaizedRecipe.title);
   const [type, setType] = useState(norlaizedRecipe.type);
   const [description, setDescription] = useState(norlaizedRecipe.description);
   const [time, setTime] = useState(norlaizedRecipe.time);
   const [imgUrl, setImgUrl] = useState(norlaizedRecipe.imgUrl);
   const [creatorName, setCreatorName] = useState(norlaizedRecipe.creator.name);
   const [ingredients, setIngredients] = useState(norlaizedRecipe.ingredients);
   const [instructions, setInstructions] = useState(norlaizedRecipe.instructions);

   const navigate = useNavigate();
   const { id } = useParams();

   const submitForm = e => {
      e.preventDefault();

      const updatedRecipe = {
         id,
         title,
         type,
         description,
         time,
         // new schema (preferred)
         imgUrl: imgUrl.trim() ? imgUrl.trim() : null,
         ingredients,
         instructions,

         // backwards-compatible fields
         imageUrl: imgUrl.trim() ? imgUrl.trim() : null,
         creator: {
            name: creatorName,
            ingredients,
         },
      };

      updateRecipeSubmit(updatedRecipe);

      toast.success('Recipe Updated Successfully!');

      return navigate(`/recipes/${id}`);
   };

   return (
      <section className='bg-light-bg dark:bg-dark-bg'>
         <div className='container m-auto max-w-2xl py-24'>
            <div className='bg-light-secondary dark:bg-dark-surface px-6 py-8 mb-4 shadow-md rounded-md border dark:border-dark-muted m-4 md:m-0'>
               <form onSubmit={submitForm}>
                  <h2 className='text-3xl text-center font-semibold mb-6 text-gray-900 dark:text-dark-text'>
                     Update Recipe
                  </h2>

                  <div className='mb-4'>
                     <label
                        htmlFor='type'
                        className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                     >
                        Meal Type
                     </label>
                     <select
                        id='type'
                        name='type'
                        className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                        required
                        value={type}
                        onChange={e => setType(e.target.value)}
                     >
                        <option value='Breakfast'>Breakfast</option>
                        <option value='Lunch'>Lunch</option>
                        <option value='Dinner'>Dinner</option>
                        <option value='Dessert'>Dessert</option>
                     </select>
                  </div>

                  <div className='mb-4'>
                     <label className='block text-gray-700 font-bold mb-2'>
                        Recipe Name
                     </label>
                     <input
                        type='text'
                        id='title'
                        name='title'
                        className='border rounded w-full py-2 px-3 mb-2 shadow-md'
                        placeholder='eg. Chicken Noodle Soup'
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                     />
                  </div>
                  <div className='mb-4'>
                     <label
                        htmlFor='description'
                        className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                     >
                        Description
                     </label>
                     <textarea
                        id='description'
                        name='description'
                        className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                        rows='4'
                        placeholder='Short description of the recipe'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                     ></textarea>
                  </div>

                  <div className='mb-4'>
                     <label
                        htmlFor='imgUrl'
                        className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                     >
                        Image URL (optional)
                     </label>
                     <input
                        type='url'
                        id='imgUrl'
                        name='imgUrl'
                        className='border rounded w-full py-2 px-3 mb-2 shadow-md'
                        placeholder='https://...'
                        value={imgUrl}
                        onChange={e => setImgUrl(e.target.value)}
                     />
                  </div>

                  <div className='mb-4'>
                     <label
                        htmlFor='time'
                        className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                     >
                        Time
                     </label>
                     <select
                        id='time'
                        name='time'
                        className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                        value={time}
                        onChange={e => setTime(e.target.value)}
                     >
                        <option value='10 min'>10 min</option>
                        <option value='20 min'>20 min</option>
                        <option value='30 min'>30 min</option>
                        <option value='40 min'>40 min</option>
                        <option value='50 min'>50 min</option>
                        <option value='1 hour'>1 hour</option>
                        <option value='2 hours'>2 hours</option>
                        <option value='3 hours'>3 hours</option>
                        <option value='4 hours'>4 hours</option>
                        <option value='5 hours'>5 hours</option>
                        <option value='other'>Other</option>
                     </select>
                  </div>

                  <h3 className='text-2xl mb-5'>Recipe Info</h3>

                  <div className='mb-4'>
                     <label
                        htmlFor='creator_name'
                        className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                     >
                        Creator Name
                     </label>
                     <input
                        type='text'
                        id='name'
                        name='name'
                        className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                        placeholder='eg. Cailee Eats'
                        required
                        value={creatorName}
                        onChange={e => setCreatorName(e.target.value)}
                     />
                  </div>

                  <div className='mb-4'>
                     <label
                        htmlFor='ingredients'
                        className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                     >
                        Ingredients
                     </label>
                     <textarea
                        id='ingredients'
                        name='ingredients'
                        className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                        rows='4'
                        placeholder='What ingredients are needed?'
                        required
                        value={ingredients}
                        onChange={e => setIngredients(e.target.value)}
                     ></textarea>
                  </div>

                  <div className='mb-4'>
                     <label
                        htmlFor='instructions'
                        className='block text-gray-700 dark:text-dark-text font-bold mb-2'
                     >
                        Instructions
                     </label>
                     <textarea
                        id='instructions'
                        name='instructions'
                        className='border dark:border-dark-muted bg-white dark:bg-dark-bg dark:text-dark-text rounded w-full py-2 px-3 shadow-md'
                        rows='6'
                        placeholder='Step-by-step instructions'
                        required
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                     ></textarea>
                  </div>

                  <div>
                     <button
                        className='bg-light-accent dark:bg-dark-accent hover:bg-[#6aa16e] dark:hover:opacity-90 text-white dark:text-dark-bg font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                        type='submit'
                     >
                        Update Recipe
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </section>
   );
};

export default EditRecipePage;
