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
      quantity: recipe.quantity ?? '',
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
   const [quantity, setQuantity] = useState(norlaizedRecipe.quantity);
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
         quantity: quantity.trim() ? quantity.trim() : null,
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
      <section className='bg-gradient-to-br from-light-bg via-white to-light-secondary dark:from-dark-bg dark:via-dark-surface dark:to-dark-secondary min-h-[80vh] py-10 md:py-16'>
         <div className='container m-auto max-w-4xl px-4'>
            <div className='max-w-3xl mx-auto bg-white/80 dark:bg-dark-surface/95 rounded-2xl shadow-xl border border-light-border/60 dark:border-dark-muted/80 backdrop-blur-sm p-6 sm:p-8'>
               <div className='mb-8 text-center'>
                  <h2 className='text-3xl md:text-4xl font-heading font-extrabold text-dark-surface dark:text-dark-text'>
                     Edit recipe
                  </h2>
                  <p className='mt-2 text-sm md:text-base text-light-text dark:text-dark-muted'>
                     Tweak the details, fix ingredients, or refine the steps.
                  </p>
               </div>

               <form onSubmit={submitForm} className='space-y-8'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                     <div>
                        <label
                           htmlFor='type'
                           className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                        >
                           Meal type
                        </label>
                        <select
                           id='type'
                           name='type'
                           className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
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

                     <div>
                        <label
                           htmlFor='time'
                           className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                        >
                           Time to make
                        </label>
                        <select
                           id='time'
                           name='time'
                           className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
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
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                     <div>
                        <label
                           htmlFor='quantity'
                           className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                        >
                           Quantity / yield <span className='text-light-text/70 dark:text-dark-muted/70'>(optional)</span>
                        </label>
                        <input
                           type='text'
                           id='quantity'
                           name='quantity'
                           className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                           placeholder='e.g. Serves 4, Makes 12 muffins'
                           value={quantity}
                           onChange={e => setQuantity(e.target.value)}
                        />
                     </div>
                     <div className='hidden md:block' aria-hidden="true" />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                     <div className='md:col-span-2'>
                        <label className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'>
                           Recipe name
                        </label>
                        <input
                           type='text'
                           id='title'
                           name='title'
                           className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                           placeholder='e.g. Chicken noodle soup'
                           required
                           value={title}
                           onChange={e => setTitle(e.target.value)}
                        />
                     </div>
                     <div>
                        <label
                           htmlFor='imgUrl'
                           className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                        >
                           Image URL <span className='text-light-text/70 dark:text-dark-muted/70'>(optional)</span>
                        </label>
                        <input
                           type='url'
                           id='imgUrl'
                           name='imgUrl'
                           className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                           placeholder='https://example.com/photo.jpg'
                           value={imgUrl}
                           onChange={e => setImgUrl(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className='border-t border-light-border/60 dark:border-dark-muted/60 pt-6'>
                     <h3 className='text-sm font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-4'>
                        Recipe details
                     </h3>

                     <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div>
                           <label
                              htmlFor='creator_name'
                              className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                           >
                              Creator name
                           </label>
                           <input
                              type='text'
                              id='name'
                              name='name'
                              className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                              placeholder='e.g. Cailee Eats'
                              required
                              value={creatorName}
                              onChange={e => setCreatorName(e.target.value)}
                           />
                        </div>

                        <div>
                           <label
                              htmlFor='description'
                              className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                           >
                              Short description
                           </label>
                           <textarea
                              id='description'
                              name='description'
                              className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                              rows='3'
                              placeholder='What should someone know before cooking this?'
                              value={description}
                              onChange={e => setDescription(e.target.value)}
                           ></textarea>
                        </div>
                     </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                     <div>
                        <label
                           htmlFor='ingredients'
                           className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                        >
                           Ingredients
                        </label>
                        <textarea
                           id='ingredients'
                           name='ingredients'
                           className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                           rows='7'
                           placeholder={'List each ingredient on a new line\n2 cups chicken stock\n1 tbsp olive oil\n...'}
                           required
                           value={ingredients}
                           onChange={e => setIngredients(e.target.value)}
                        ></textarea>
                     </div>

                     <div>
                        <label
                           htmlFor='instructions'
                           className='block text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted mb-2'
                        >
                           Instructions
                        </label>
                        <textarea
                           id='instructions'
                           name='instructions'
                           className='w-full rounded-xl border border-light-border/80 dark:border-dark-muted/80 bg-white dark:bg-dark-bg/60 dark:text-dark-text px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent/60 dark:focus:ring-dark-accent/70'
                           rows='7'
                           placeholder={'Write each step on a new line\n1. Preheat the oven to 180°C\n2. Mix the ingredients...\n...'}
                           required
                           value={instructions}
                           onChange={e => setInstructions(e.target.value)}
                        ></textarea>
                     </div>
                  </div>

                  <div className='pt-2'>
                     <button
                        className='inline-flex w-full items-center justify-center rounded-full bg-light-accent dark:bg-dark-accent text-black dark:text-dark-bg px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#6aa16e] dark:hover:opacity-90 transition-transform transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-light-accent/70 dark:focus:ring-dark-accent/70'
                        type='submit'
                     >
                        Save changes
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </section>
   );
};

export default EditRecipePage;
