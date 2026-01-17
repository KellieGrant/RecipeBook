import React from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const RecipePage = () => {
   const { id } = useParams();
   const recipe = useLoaderData();

   return (
      <>
         <section>
            <div className='bg-light-accent w-full py-6 px-6'>
               <Link
                  to='/recipes'
                  className='text-black hover:text-indigo-600 flex items-center'
               >
                  <FaArrowLeft className='mr-2' /> Back to Job Listings
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
                        <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
                           <i className='fa-solid fa-location-dot text-lg text-orange-700 mr-2'></i>
                           <p className='text-light-accent'>
                              {recipe.location}
                           </p>
                        </div>
                     </div>

                     <div className='bg-light-secondary p-6 rounded-lg shadow-md mt-6'>
                        <h3 className='text-light-accent text-lg font-bold mb-6'>
                           Job Description
                        </h3>

                        <p className='mb-4'>{recipe.description}</p>

                        <h3 className='text-light-accent text-lg font-bold mb-2'>
                           Salary
                        </h3>

                        <p className='mb-4'>{recipe.salary}</p>
                     </div>
                  </main>

                  {/* <!-- Sidebar --> */}
                  <aside>
                     {/* <!-- Company Info --> */}
                     <div className='bg-light-secondary p-6 rounded-lg shadow-md'>
                        <h3 className='text-xl font-bold mb-6'>Company Info</h3>

                        <h2 className='text-2xl'>{recipe.company.name}</h2>

                        <p className='my-2'>{recipe.company.description}</p>

                        <hr className='my-4' />

                        <h3 className='text-xl'>Contact Email:</h3>

                        <p className='my-2 bg-light-bg p-2 font-bold shadow-md'>
                           {recipe.company.contactEmail}
                        </p>

                        <h3 className='text-xl'>Contact Phone:</h3>

                        <p className='my-2 bg-light-bg p-2 font-bold shadow-md'>
                           {recipe.company.contactPhone}
                        </p>
                     </div>

                     {/* <!-- Manage --> */}
                     <div className='bg-light-secondary p-6 rounded-lg shadow-md mt-6'>
                        <h3 className='text-xl font-bold mb-6'>Manage Job</h3>
                        <Link
                           to={`/recipes/edit/${recipe.id}`}
                           className='bg-light-accent hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'
                        >
                           Edit Job
                        </Link>
                        <button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'>
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
