import React from 'react';
import Logo from '../assets/images/logo.png';

const Navbar = () => {
  return (
    <>
      <nav className="bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-muted">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
              {/* <!-- Logo --> */}
              <a
                className="flex flex-shrink-0 items-center mr-4"
                href="/index.html"
              >
                <img className="h-10 w-auto" src={Logo} alt="React Jobs" />
                <span className="hidden md:block text-light-gray text-2xl font-bold ml-2">
                  Recipe Book
                </span>
              </a>
              <div className="md:ml-auto">
                <div className="flex space-x-2">
                  <a
                    href="/index.html"
                    className="text-white bg-light-accent hover:bg-light-surface hover:text-white rounded-md px-3 py-2"
                  >
                    Home
                  </a>
                  <a
                    href="/jobs.html"
                    className="text-dark-surface hover:bg-light-surface hover:text-white rounded-md px-3 py-2"
                  >
                    Recipes
                  </a>
                  <a
                    href="/add-job.html"
                    className="text-dark-surface hover:bg-light-surface hover:text-white rounded-md px-3 py-2"
                  >
                    Add Recipe
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
