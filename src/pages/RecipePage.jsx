import React from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RecipePage = ({ deleteRecipe }) => {
   const navigate = useNavigate();
   const { id } = useParams();
   const recipe = useLoaderData();

   const onDeleteClick = recipeId => {
      const confirm = window.confirm(
         'Are you sure you want to delete this recipe',
      );

      if (!confirm) return;

      deleteRecipe(recipeId);

      toast.success('Recipe Deleted Successfully!');

      navigate('/recipes');
   };

   return (
      <>
         <section>
            <div className='bg-light-accent w-full py-6 px-6'>
               <Link
                  to='/recipes'
                  className='text-black hover:font-bold flex items-center'
               >
                  <FaArrowLeft className='mr-2' /> Back to Recipes
               </Link>
            </div>
         </section>

         <section className='bg-light-bg'>
            <div className='container m-auto py-10 px-6'>
               <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
                  <main>
                     <div className='bg-light-secondary p-6 rounded-lg shadow-md text-center md:text-left'>
                        <div className='text-gray-500 mb-4'>{recipe.type}</div>
                        <h1 className='text-3xl font-bold mb-4'>
                           {recipe.title}
                        </h1>

                        <h3 className='text-light-accent text-lg font-bold mb-2'>
                           Time
                        </h3>

                        <p className='mb-4'>{recipe.time}</p>
                     </div>

                     <div className='bg-light-secondary p-6 rounded-lg shadow-md mt-6'>
                        <h3 className='text-light-accent text-xl font-bold mb-6'>
                           Ingredients
                        </h3>

                        <ul className='lsit-disc list-inside space-y-1 my-2'>
                           {recipe.creator.ingredients
                              .split('\n')
                              .filter(item => item.trim() !== '')
                              .map((item, index) => (
                                 <li key={index}>{item}</li>
                              ))}
                        </ul>

                        <h3 className='text-light-accent text-lg font-bold mb-6'>
                           Recipe Instructions
                        </h3>

                        <ol className='list-decimal list-inside space-y-2 mb-10'>
                           {recipe.instructions
                              .split('\n')
                              .filter(step => step.trim() !== '')
                              .map((step, index) => (
                                 <li key={index}>{step}</li>
                              ))}
                        </ol>
                     </div>
                  </main>

                  {/* <!-- Sidebar --> */}
                  <aside>
                     <div className='bg-light-secondary p-6 rounded-lg shadow-md'>
                        <h3 className='text-light-accent text-m font-bold mb-1'>
                           Creator
                        </h3>

                        <p className='text-l mb-6'>{recipe.creator.name}</p>
                     </div>

                     {/* <!-- Manage --> */}
                     <div className='bg-light-secondary p-6 rounded-lg shadow-md mt-6'>
                        <h3 className='text-xl font-bold mb-6'>Manage Job</h3>
                        <Link
                           to={`/edit-recipe/${recipe.id}`}
                           className='bg-light-accent hover:bg-[#6aa16e] text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'
                        >
                           Edit Job
                        </Link>
                        <button
                           onClick={() => onDeleteClick(recipe.id)}
                           className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'
                        >
                           Delete Job
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
   const res = await fetch(`/api/recipes/${params.id}`);
   const data = await res.json();
   return data;
};

export { RecipePage as default, recipeLoader };
