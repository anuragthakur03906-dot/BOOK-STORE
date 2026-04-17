import { useState, useEffect } from 'react';
import { userAPI } from '../services/api.js';
import { FiHeart, FiBook } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';
import BookCard from '../components/books/BookCard.jsx';
import BackButton from '../components/common/BackButton.jsx';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await userAPI.getFavorites();
      if (response.data.success) {
        setFavorites(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <BackButton />
        </div>
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-text-main">My Favorites</h1>
          <p className="text-text-muted mt-2">
            You have marked {favorites.length} book{favorites.length !== 1 ? 's' : ''} as your favorite.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full mb-6">
              <FiHeart className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">No favorites yet</h3>
            <p className="text-text-muted mb-8 max-w-sm mx-auto">Discover your next favorite read in our comprehensive library collection.</p>
            <Link
              to="/books"
              className="px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:opacity-90 transition-all"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((book) => (
               <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;