import { useState, useEffect } from 'react';
import { userAPI } from '../services/api.js';
import { FiHeart, FiBook, FiTrash2 } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

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

  const handleRemoveFavorite = async (bookId) => {
    try {
      await userAPI.removeFromFavorites(bookId);
      setFavorites(favorites.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorite Books</h1>
          <p className="text-gray-600 mt-2">
            {favorites.length} favorite book{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FiHeart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Add books to your favorites to see them here</p>
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiBook className="mr-2" />
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link to={`/books/${book._id}`} className="hover:text-blue-600">
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(book._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove from favorites"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiBook className="h-4 w-4 mr-2" />
                    <span>{book.genre}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">${book.price?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;