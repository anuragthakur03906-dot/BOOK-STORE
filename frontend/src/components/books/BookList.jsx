import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    const trimmed = searchTerm?.trim() || '';
    setFilters(prev => ({ ...prev, search: trimmed, page: 1 }));
  }, []);

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

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return (
    <div className="min-h-screen bg-base transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-text-main tracking-tight">Our Collection</h1>
              <p className="text-text-muted mt-2">Explore {pagination?.totalBooks || 0} unique titles available today.</p>
            </div>
            {user && (
              <Link
                to="/books/new"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-brand hover:opacity-90 transition-all shadow-brand/20"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                Add New Book
              </Link>
            )}
          </div>

          <div className="mt-8">
            <SearchBar
              onSearch={handleSearch}
              initialValue={filters.search}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter Panel */}
          <div className="lg:w-1/4">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Books List Section */}
          <div className="lg:w-3/4">
            {/* Sorting and Results count Bar */}
            <div className="mb-8 p-4 bg-base/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-bold text-text-main">
                {loading ? 'Searching...' : `${pagination?.totalBooks || 0} results found`}
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-text-muted font-bold uppercase">View</span>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                  className="bg-base text-text-main pl-3 pr-10 py-1.5 text-sm border border-gray-200 dark:border-gray-800 dark:border-gray-700 focus:ring-brand focus:border-brand rounded-lg"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-24 bg-base/30 dark:bg-gray-800/10 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-text-main mb-2">No luck today</h3>
                <p className="text-text-muted">We couldn't find any books matching those criteria.</p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-6 text-brand font-bold hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {books.map((book) => (
                    <div key={book._id}>
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
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
