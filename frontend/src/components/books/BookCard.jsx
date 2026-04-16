import { FiBook, FiHeart, FiUser, FiStar, FiDollarSign, FiCalendar, FiTag } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { userAPI } from '../../services/api.js';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const BookCard = ({ book, showFavoriteOnly = true }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [book._id, user]);

  const checkIfFavorite = async () => {
    if (!user) return;

    try {
      const response = await userAPI.getFavorites();
      if (response.data.success) {
        const isFav = response.data.data.some(favBook => favBook._id === book._id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to add to favorites');
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        await userAPI.removeFromFavorites(book._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        await userAPI.addToFavorites(book._id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  // Only show favorite button (no edit/delete)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex gap-4">
          {/* Book Icon */}
          <div className="flex-shrink-0">
            <div className="bg-blue-50 p-4 rounded-lg">
              <FiBook className="text-2xl text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header with Title and Favorite Button */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <Link to={`/books/${book._id}`} className="hover:text-blue-600">
                  <h3 className="text-lg font-bold text-gray-900 truncate hover:underline">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mt-1">
                  by <span className="font-medium">{book.author}</span>
                </p>
              </div>

              {/* Only Favorite Button - No Edit/Delete */}
              <button
                onClick={handleFavoriteToggle}
                disabled={loadingFavorite}
                className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                  isFavorite 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FiHeart className="h-5 w-5" />
              </button>
            </div>

            {/* Price, Rating, Year */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-green-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-sm">
                  ${book.price?.toFixed(2) || '0.00'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-500 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-sm">
                  {book.rating?.toFixed(1) || '0.0'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  {book.publishedYear}
                </span>
              </div>
            </div>

            {/* Genre and Status */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 truncate block max-w-[150px]">
                  <FiTag className="inline mr-1 h-3 w-3" />
                  {book.genre}
                </span>
              </div>

              <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium w-fit flex-shrink-0 ${
                book.inStock
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {book.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            {book.description && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {book.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Added By Info - Bottom of card */}
      {book.addedBy && (
        <div className="px-6 pb-4 pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center text-xs text-gray-500">
            <FiUser className="h-3 w-3 mr-1" />
            <span>Added by: <span className="font-medium">{book.addedBy.name}</span></span>
            <span className={`ml-2 px-1 py-0.5 text-xs rounded ${
              book.addedBy.roleName === 'admin' ? 'bg-red-100 text-red-800' :
              book.addedBy.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {book.addedBy.roleName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;