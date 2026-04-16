import { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api.js';
import { FiFilter, FiX, FiStar, FiDollarSign, FiCalendar, FiTag } from 'react-icons/fi';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const [genres, setGenres] = useState([]);
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 100 });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const [genresRes, priceRes] = await Promise.all([
        bookAPI.getGenres(),
        bookAPI.getPriceRange()
      ]);
      setGenres(genresRes.data.data);
      setPriceRange(priceRes.data.data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const handleGenreChange = (genre) => {
    onFilterChange({ genre: filters.genre === genre ? '' : genre });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ minRating: filters.minRating === rating ? 0 : rating });
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-blue-700 transition-colors"
        aria-label="Open filters"
      >
        <FiFilter className="text-xl" />
      </button>

      {/* Filter Panel */}
      <div className={`
        fixed lg:static inset-0 bg-white lg:bg-transparent z-50 transform transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="bg-white h-full lg:h-auto w-80 lg:w-64 p-6 lg:p-4 shadow-xl lg:shadow-none overflow-y-auto filter-panel-scroll">
          
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h3 className="text-xl font-bold text-gray-800">Filters</h3>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close filters"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Filters</h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Genre Filter */}
          <div className="mb-8">
            <div className="filter-section-header">
              <FiTag className="h-4 w-4" />
              <span>Genre</span>
            </div>
            <div className="space-y-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`genre-button ${
                    filters.genre === genre ? 'active' : ''
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-8">
            <div className="filter-section-header">
              <FiDollarSign className="h-4 w-4" />
              <span>Price Range</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Min: <span className="font-semibold">${filters.minPrice}</span>
                </label>
                <input
                  type="range"
                  name="minPrice"
                  min={priceRange.minPrice}
                  max={priceRange.maxPrice}
                  value={filters.minPrice}
                  onChange={handlePriceChange}
                  className="price-range-slider"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max: <span className="font-semibold">
                    ${filters.maxPrice === Infinity ? '∞' : filters.maxPrice}
                  </span>
                </label>
                <input
                  type="range"
                  name="maxPrice"
                  min={priceRange.minPrice}
                  max={priceRange.maxPrice}
                  value={filters.maxPrice === Infinity ? priceRange.maxPrice : filters.maxPrice}
                  onChange={handlePriceChange}
                  className="price-range-slider"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 pt-1">
                <span>${priceRange.minPrice}</span>
                <span>${priceRange.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Minimum Rating Filter - FIXED */}
          <div className="mb-8">
            <div className="filter-section-header">
              <FiStar className="h-4 w-4" />
              <span>Minimum Rating</span>
            </div>
            <div className="rating-buttons-container">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`rating-button ${
                    filters.minRating === rating ? 'active' : ''
                  }`}
                  title={`${rating}+ stars`}
                >
                  {rating}+
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="mb-8">
            <div className="filter-section-header">
              <FiCalendar className="h-4 w-4" />
              <span>Sort By</span>
            </div>
            <div className="space-y-3">
              <div>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                >
                  <option value="createdAt">Date Added</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mb-8">
            <h4 className="font-semibold mb-3 text-gray-700">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.genre && (
                <span className="active-filter-badge genre">
                  {filters.genre}
                </span>
              )}
              {filters.minRating > 0 && (
                <span className="active-filter-badge rating">
                  {filters.minRating}+ Stars
                </span>
              )}
              {filters.search && (
                <span className="active-filter-badge search">
                  "{filters.search}"
                </span>
              )}
            </div>
          </div>

          {/* Mobile Clear Button */}
          <button
            onClick={() => {
              onClearFilters();
              setIsMobileOpen(false);
            }}
            className="lg:hidden w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors mt-4"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 mobile-filter-overlay"
        />
      )}
    </>
  );
};

export default FilterPanel;