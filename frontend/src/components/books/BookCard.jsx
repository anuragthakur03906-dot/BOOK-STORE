import { FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { userAPI } from '../../services/api.js';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { Link } from 'react-router-dom';

const BookCard = ({ book, showFavoriteOnly = true }) => {
  const { user } = useAuth();
  const toast = useToast();
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
        await userAPI.removeFromFavorites(book._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
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

  return (
    <div className="bg-base rounded-xl shadow-card hover:shadow-card-hover border border-gray-100 dark:border-gray-800 transition-all duration-300 h-full flex flex-col group">
      <div className="p-6 flex-1">
        <div className="flex flex-col">
          {/* Book Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <Link to={`/books/${book._id}`}>
                <h3 className="text-lg font-bold text-text-main truncate group-hover:text-brand transition-colors">
                  {book.title}
                </h3>
              </Link>
              <p className="text-text-muted text-sm mt-1">
                by <span className="font-medium text-text-main">{book.author}</span>
              </p>
            </div>

            <button
              onClick={handleFavoriteToggle}
              disabled={loadingFavorite}
              className={`p-2.5 rounded-full transition-all w-10 h-10 flex items-center justify-center ${
                isFavorite 
                  ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                  : 'text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiHeart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-text-muted uppercase tracking-wider">Price</span>
              <span className="font-bold text-brand text-lg">
                ${book.price?.toFixed(2) || '0.00'}
              </span>
            </div>

            <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-4">
              <span className="text-xs text-text-muted uppercase tracking-wider">Rating</span>
              <span className="font-semibold text-text-main">
                {book.rating?.toFixed(1) || '0.0'} <span className="text-yellow-500 text-[10px] font-bold">Rating</span>
              </span>
            </div>
          </div>

          {/* Genre and Year Labels */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-gray-100 dark:bg-gray-800 text-text-main px-3 py-1 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-800 dark:border-gray-700">
              {book.genre}
            </span>
            <span className="text-text-muted text-xs">
              Released: {book.publishedYear}
            </span>
          </div>

          <div className="mb-4">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-tighter ${
              book.inStock
                ? 'bg-green-100/50 text-green-700 dark:bg-green-900/30'
                : 'bg-red-100/50 text-red-700 dark:bg-red-900/30'
            }`}>
              {book.inStock ? 'Available' : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          {book.description && (
            <p className="text-text-muted text-sm leading-relaxed line-clamp-2 italic">
              {book.description}
            </p>
          )}
        </div>
      </div>

      {/* Added By Info */}
      {book.addedBy && (
        <div className="px-6 pb-4 pt-3 border-t border-gray-50 dark:border-gray-800 mt-auto bg-base/30 dark:bg-transparent">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">Added by <span className="text-text-main font-medium">{book.addedBy.name}</span></span>
            <span className="text-text-muted uppercase">{book.addedBy.roleName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;