import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddRecipePage = ({ addRecipeSubmit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Breakfast');
  const [time, setTime] = useState('10 min');
  const [imgUrl, setImgUrl] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const navigate = useNavigate();

  const submitForm = e => {
    e.preventDefault();

    const newRecipe = {
      title,
      type,
      time,
      // new schema (preferred)
      imgUrl: imgUrl.trim() ? imgUrl.trim() : null,
      ingredients,
      description,

      // backwards-compatible fields (so older components still work)
      imageUrl: imgUrl.trim() ? imgUrl.trim() : null,
      creator: {
        name: creatorName,
        ingredients,
      },
      instructions,
    };

    addRecipeSubmit(newRecipe);
    toast.success('Recipe Added Successfully!');
    navigate('/recipes');
  };

  return (
    <section className="bg-light-bg">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-light-secondary px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={submitForm}>
            <h2 className="text-3xl text-center font-semibold mb-6">
              Add Recipe
            </h2>

            {/* Meal Type */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
                Meal Type
              </label>
              <select
                id="type"
                name="type"
                className="border rounded w-full py-2 px-3 shadow-md"
                required
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            {/* Recipe Name */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                Recipe Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="border rounded w-full py-2 px-3 mb-2 shadow-md"
                placeholder="eg. Chicken Noodle Soup"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Time */}
            <div className="mb-4">
              <label htmlFor="time" className="block text-gray-700 font-bold mb-2">
                Time
              </label>
              <select
                id="time"
                name="time"
                className="border rounded w-full py-2 px-3 shadow-md"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
              >
                <option value="10 min">10 min</option>
                <option value="20 min">20 min</option>
                <option value="30 min">30 min</option>
                <option value="40 min">40 min</option>
                <option value="50 min">50 min</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours">3 hours</option>
                <option value="4 hours">4 hours</option>
                <option value="5 hours">5 hours</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="mb-4">
              <label htmlFor="imgUrl" className="block text-gray-700 font-bold mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                id="imgUrl"
                name="imgUrl"
                className="border rounded w-full py-2 px-3 mb-2 shadow-md"
                placeholder="https://..."
                value={imgUrl}
                onChange={e => setImgUrl(e.target.value)}
              />
            </div>

            {/* Creator Info */}
            <h3 className="text-2xl mb-5">Recipe Info</h3>

            <div className="mb-4">
              <label htmlFor="creator_name" className="block text-gray-700 font-bold mb-2">
                Creator Name
              </label>
              <input
                type="text"
                id="creator_name"
                name="creator_name"
                className="border rounded w-full py-2 px-3 shadow-md"
                placeholder="eg. Cailee Eats"
                required
                value={creatorName}
                onChange={e => setCreatorName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="ingredients" className="block text-gray-700 font-bold mb-2">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                className="border rounded w-full py-2 px-3 shadow-md"
                rows="4"
                placeholder="List ingredients, one per line"
                required
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="border rounded w-full py-2 px-3 shadow-md"
                rows="3"
                placeholder="Short description of the recipe"
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="instructions" className="block text-gray-700 font-bold mb-2">
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                className="border rounded w-full py-2 px-3 shadow-md"
                rows="6"
                placeholder="Step-by-step instructions"
                required
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="bg-light-accent hover:bg-[#6aa16e] text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              >
                Add Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddRecipePage;
