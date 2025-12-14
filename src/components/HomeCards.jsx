import React from 'react';
import Card from './Card';

const HomeCards = () => {
  return (
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold">For the Foodies</h2>
            <p className="mt-2 mb-4">
              Browse the menu and find the perfect dish to make
            </p>
            <a
              href="/jobs.html"
              className="inline-block bg-light-accent text- rounded-lg px-4 py-2 hover:bg-[#6aa16e]"
            >
              Browse Recipes
            </a>
          </Card>
          <Card bg="bg-light-surface">
            <h2 className="text-2xl font-bold">For the Chefs</h2>
            <p className="mt-2 mb-4">
              Add your recipe and help others cook something amazing
            </p>
            <a
              href="/add-job.html"
              className="inline-block bg-light-accent text-black rounded-lg px-4 py-2 hover:bg-[#6aa16e]"
            >
              Add Recipe
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
