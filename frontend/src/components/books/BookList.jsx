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
import BackButton from '../common/BackButton.jsx';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,          // Show 6 books per page
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
      limit: 6,          // Show 6 books per page
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
    <div className="min-h-screen bg-base pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex flex-col gap-4">
              <BackButton />
              <div>
                <h1 className="text-3xl font-bold text-text-main">Library Collection</h1>
                <p className="text-text-muted mt-1 font-medium italic">Discover {pagination?.totalBooks || 0} unique titles available.</p>
              </div>
            </div>
            {user && (
              <Link
                to="/books/new"
                className="btn-primary py-3 px-6 flex items-center justify-center gap-2 shadow-lg shadow-brand/10"
              >
                <FiPlus className="h-5 w-5" />
                <span>Add New Book</span>
              </Link>
            )}
          </div>

          <div className="w-full">
            <SearchBar
              onSearch={handleSearch}
              initialValue={filters.search}
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar: Filters */}
          <aside className="lg:w-1/4">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Right Main: Results */}
          <main className="lg:w-3/4 space-y-8">
            {/* View Controls & Info */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-text-muted px-2">
                {loading ? 'Syncing...' : `${pagination?.totalBooks || 0} Matches Found`}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest hidden sm:inline">Page Size</span>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                  className="bg-transparent text-sm font-bold text-text-main outline-none focus:text-brand cursor-pointer"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>
            </div>

            {/* List Logic */}
            {loading ? (
              <div className="py-20 flex justify-center"><LoadingSpinner /></div>
            ) : books.length === 0 ? (
              <div className="text-center py-32 bg-gray-50/50 dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-[2.5rem]">
                <h3 className="text-xl font-bold text-text-main mb-2">No matching results</h3>
                <p className="text-text-muted mb-8 max-w-xs mx-auto">We couldn't find any books matching your specific criteria. Try resetting filters.</p>
                <button 
                  onClick={handleClearFilters}
                  className="text-brand font-bold hover:underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {books.map((book) => (
                      <BookCard key={book._id} book={book} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center pt-8 border-t border-gray-100 dark:border-slate-800">
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookList;
