import { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api.js';
import { FiFilter, FiX } from 'react-icons/fi';

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
        className="lg:hidden fixed bottom-10 right-10 bg-brand text-white p-4 rounded-2xl shadow-xl z-40 transition-transform active:scale-95"
        aria-label="Open filters"
      >
        <FiFilter className="text-xl" />
      </button>

      {/* Filter Panel */}
      <div className={`
        fixed lg:static inset-0 bg-base lg:bg-transparent z-50 transform transition-transform duration-500
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="bg-base h-full lg:h-auto w-full max-w-sm lg:w-full p-8 lg:p-0 overflow-y-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-text-main uppercase tracking-widest italic">Filters</h3>
            <button
              onClick={onClearFilters}
              className="text-xs font-bold text-brand uppercase hover:underline"
            >
              Reset
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 text-text-main"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="space-y-12">
            {/* Genre Filter */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 border-l-4 border-brand pl-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.genre === genre 
                        ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                        : 'bg-gray-100 dark:bg-gray-800 text-text-main hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 border-l-4 border-brand pl-3">Price Range</h4>
              <div className="px-2">
                <input
                  type="range"
                  name="maxPrice"
                  min={priceRange.minPrice}
                  max={priceRange.maxPrice}
                  value={filters.maxPrice === Infinity ? priceRange.maxPrice : filters.maxPrice}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-bold text-text-muted">${priceRange.minPrice}</span>
                  <span className="text-lg font-black text-brand">${filters.maxPrice === Infinity ? priceRange.maxPrice : filters.maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 border-l-4 border-brand pl-3">Min Rating</h4>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filters.minRating === rating 
                        ? 'bg-brand text-white shadow-md' 
                        : 'bg-base dark:bg-gray-800/50 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {rating}+ ★
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 border-l-4 border-brand pl-3">Sort By</h4>
              <div className="space-y-3">
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full bg-transparent text-text-main border-b-2 border-gray-100 dark:border-gray-800 focus:border-brand py-2 text-sm outline-none transition-colors"
                >
                  <option value="createdAt">Date Added</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                </select>
                <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleSortChange}
                  className="w-full bg-transparent text-text-main border-b-2 border-gray-100 dark:border-gray-800 focus:border-brand py-2 text-sm outline-none transition-colors"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
        />
      )}
    </>
  );
};

export default FilterPanel;