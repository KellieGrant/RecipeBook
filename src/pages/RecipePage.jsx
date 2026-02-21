import React from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuthHeaders } from '../utils/auth';

const RecipePage = ({ deleteRecipe }) => {
   const navigate = useNavigate();
   const { id } = useParams();
   const recipe = useLoaderData();

   const onDeleteClick = async recipeId => {
      const confirmDelete = window.confirm(
         'Are you sure you want to delete this recipe',
      );

      if (!confirmDelete) return;

      try {
         await deleteRecipe(recipeId);

         toast.success('Recipe Deleted Successfully');

         navigate('/recipes');
      } catch (err) {
         console.error('Failed to delete recipe:', err);
         toast.error('Failed to delete recipe');
      }
   };

   const imageUrl = recipe.imageUrl || recipe.imgUrl;

   return (
      <>
         <section>
            <div className='bg-light-accent dark:bg-dark-accent w-full py-6 px-6'>
               <Link
                  to='/recipes'
                  className='text-black dark:text-dark-bg hover:font-bold flex items-center'
               >
                  <FaArrowLeft className='mr-2' /> Back to Recipes
               </Link>
            </div>
         </section>

         {imageUrl && (
            <section className='w-full h-48 md:h-64 overflow-hidden'>
               <img
                  src={imageUrl}
                  alt={recipe.title}
                  className='w-full h-full object-cover'
               />
            </section>
         )}

         <section className='bg-light-bg dark:bg-dark-bg'>
            <div className='container m-auto py-10 px-6'>
               <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
                  <main>
                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md text-center md:text-left border border-transparent dark:border-dark-muted'>
                        <div className='text-gray-500 dark:text-dark-muted mb-4'>{recipe.type}</div>
                        <h1 className='text-3xl font-bold mb-4'>
                           {recipe.title}
                        </h1>

                        <h3 className='text-light-accent dark:text-dark-accent text-lg font-bold mb-2'>
                           Time
                        </h3>

                        <p className='mb-4'>{recipe.time}</p>
                     </div>

                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md mt-6 border border-transparent dark:border-dark-muted'>
                        <h3 className='text-light-accent dark:text-dark-accent text-xl font-bold mb-6'>
                           Ingredients
                        </h3>

                        <ul className='list-disc list-inside space-y-1 my-2'>
                           {recipe?.creator?.ingredients
                              .split('\n')
                              .filter(item => item.trim() !== '')
                              .map((item, index) => (
                                 <li key={index}>{item}</li>
                              ))}
                        </ul>

                        <h3 className='text-light-accent dark:text-dark-accent text-lg font-bold mb-6'>
                           Recipe Instructions
                        </h3>

                        <ol className='list-decimal list-inside space-y-2 mb-10'>
                           {recipe?.instructions
                              ?.split('\n')
                              .filter(step => step.trim() !== '')
                              .map((step, index) => (
                                 <li key={index}>{step}</li>
                              ))}
                        </ol>
                     </div>
                  </main>

                  {/* <!-- Sidebar --> */}
                  <aside>
                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md border border-transparent dark:border-dark-muted'>
                        <h3 className='text-light-accent dark:text-dark-accent text-m font-bold mb-1'>
                           Creator
                        </h3>

                        <p className='text-l mb-6'>{recipe.creator.name}</p>
                     </div>

                     {/* <!-- Manage --> */}
                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md mt-6 border border-transparent dark:border-dark-muted'>
                        <h3 className='text-xl font-bold mb-6'>Manage Job</h3>
                        <Link
                           to={`/edit-recipe/${recipe.id}`}
                           className='bg-light-accent dark:bg-dark-accent hover:bg-[#6aa16e] dark:hover:opacity-90 text-white dark:text-dark-bg text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'
                        >
                           Edit Recipe
                        </Link>
                        <button
                           onClick={() => onDeleteClick(recipe.id)}
                           className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block dark:bg-red-600 dark:hover:bg-red-700'
                        >
                           Delete Recipe
                        </button>
                     </div>
                  </aside>
               </div>
            </div>
         </section>
      </>
   );
};

const recipeLoader = async ({ params }) => {
   try {
      const res = await fetch(`/api/recipes/${params.id}`, {
         headers: getAuthHeaders(),
      });
      if (!res.ok) {
         throw new Error('Recipe not found');
      }
      const data = await res.json();
      return data;
   } catch (err) {
      console.error('Failed to fetch recipe:', err);
      throw err;
   }
};

export { RecipePage as default, recipeLoader };
