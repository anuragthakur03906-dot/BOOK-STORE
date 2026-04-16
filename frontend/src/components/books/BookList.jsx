import { useState, useEffect, useCallback, useMemo } from 'react';
import { bookAPI } from '../../services/api.js';
import BookCard from './BookCard.jsx';
import Pagination from './Pagination.jsx';
import SearchBar from './SearchBar.jsx';
import FilterPanel from './FilterPanel.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    search: '',
    genre: '',
    minPrice: 0,
    maxPrice: Infinity,
    minRating: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const { user } = useAuth();

  // Fetch books based on current filters
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (params.maxPrice === Infinity) delete params.maxPrice;
      if (params.minRating === 0) delete params.minRating;

      const response = await bookAPI.getBooks(params);

      if (response.data.success) {
        setBooks(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Trigger fetch only when filters change (use object serialization to prevent infinite loops)
  useEffect(() => {
    // Use a small delay to batch multiple state updates
    const timeoutId = setTimeout(() => {
      fetchBooks();
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [fetchBooks]);

  // Update filters - memoized to prevent recreation
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  // Handle search input (with debouncing in SearchBar) - memoized
  const handleSearch = useCallback((searchTerm) => {
    const trimmed = searchTerm?.trim() || '';
    setFilters(prev => ({ ...prev, search: trimmed, page: 1 }));
  }, []);

  // Reset all filters - memoized
  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 6,
      search: '',
      genre: '',
      minPrice: 0,
      maxPrice: Infinity,
      minRating: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }, []);

  // Change page - memoized
  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Remove deleted book from list - memoized
  const handleBookDelete = useCallback((bookId) => {
    setBooks(prev => prev.filter(book => book._id !== bookId));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Collection</h1>
              <p className="text-gray-600 mt-2">Browse and manage your books</p>
            </div>
            {user && (
              <Link
                to="/books/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                Add New Book
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar
              onSearch={handleSearch}
              initialValue={filters.search}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <div className="lg:w-1/4">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Books Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {pagination?.totalBooks || 0} Books Found
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="6">6 per page</option>
                  <option value="9">9 per page</option>
                  <option value="12">12 per page</option>
                  <option value="24">24 per page</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <LoadingSpinner />
            ) : books.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              // Books Grid
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <div key={book._id} className="h-full">
                      <BookCard book={book} onDelete={handleBookDelete} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
