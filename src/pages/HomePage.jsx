import Hero from '../components/Hero';
import HomeCards from '../components/HomeCards';
import RecipeListings from '../components/RecipeListings';
import ViewAllRecipes from '../components/ViewAllRecipes';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from './LoginPage';

const HomePage = () => {
   const { isAuthenticated } = useAuth();

   if (!isAuthenticated) {
      return (
         <>
            <Hero />
            <LoginPage />
         </>
      );
   }

   return (
      <>
         <Hero />
         <HomeCards />
         <RecipeListings isHome={true} />
         <ViewAllRecipes />
      </>
   );
};

export default HomePage;
