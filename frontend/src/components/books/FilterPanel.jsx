import { useEffect, useState } from 'react';
import { bookAPI } from '../../services/api.js';
import { FiFilter, FiX, FiCheck } from 'react-icons/fi';

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
      console.error('Data pull error:', error);
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
      {/* Mobile Trigger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open filters"
        className="lg:hidden fixed bottom-6 right-6 bg-brand text-white w-14 h-14 rounded-full shadow-2xl z-40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-slate-800"
      >
        <FiFilter className="text-xl" />
      </button>

      {/* Drawer Layer */}
      <div className={`
        fixed lg:static inset-0 bg-white dark:bg-slate-900 lg:bg-transparent z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full lg:h-auto w-full max-w-sm lg:w-full p-4 sm:p-6 lg:p-0 overflow-y-auto">
          
          {/* Controls Header */}
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-bold text-text-main tracking-tight flex items-center gap-2 uppercase">
               <FiFilter className="text-brand" /> Filter Records
            </h3>
            <div className="flex items-center gap-4">
               <button
                  onClick={onClearFilters}
                  className="text-xs font-bold text-red-500 hover:underline px-2"
               >
                  Clear All
               </button>
               <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg text-text-muted">
                  <FiX className="text-xl" />
               </button>
            </div>
          </div>

          <div className="space-y-12">
            {/* Genre: Visual Tags */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 block">Categories</label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => {
                  const isActive = filters.genre === genre;
                  return (
                    <button
                      key={genre}
                      onClick={() => handleGenreChange(genre)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isActive 
                          ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' 
                          : 'bg-white dark:bg-slate-900 text-text-muted border-gray-100 dark:border-slate-800 hover:border-brand/40'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                 <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Max Pricing</label>
                 <span className="text-lg font-bold text-brand">${filters.maxPrice === Infinity ? priceRange.maxPrice : filters.maxPrice}</span>
              </div>
              <input
                type="range"
                name="maxPrice"
                min={priceRange.minPrice}
                max={priceRange.maxPrice}
                value={filters.maxPrice === Infinity ? priceRange.maxPrice : filters.maxPrice}
                onChange={handlePriceChange}
                className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between text-[10px] font-bold text-text-muted/40 uppercase">
                 <span>${priceRange.minPrice}</span>
                 <span>${priceRange.maxPrice}</span>
              </div>
            </div>

            {/* Ratings: Star Score */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 block">Minimum Score</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`py-2 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-1 ${
                      filters.minRating === rating 
                        ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/10' 
                        : 'bg-gray-50 dark:bg-slate-800 text-text-muted hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-gray-100 dark:hover:border-slate-800'
                    }`}
                  >
                    <span>{rating}</span>
                    <span className="opacity-60 text-[8px]">Rating+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logic: Sorting */}
            <div className="space-y-6 pt-4 border-t border-gray-50 dark:border-slate-800">
              <div>
                 <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3 block">Arrange By</label>
                 <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full bg-gray-50 dark:bg-slate-800 text-text-main py-3 px-4 rounded-xl text-xs font-bold outline-none border-none cursor-pointer appearance-none"
                >
                  <option value="createdAt">Creation Date</option>
                  <option value="price">Global Pricing</option>
                  <option value="rating">User Rating</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
              <div>
                 <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3 block">Ordering</label>
                 <select
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleSortChange}
                  className="w-full bg-gray-50 dark:bg-slate-800 text-text-main py-3 px-4 rounded-xl text-xs font-bold outline-none border-none cursor-pointer appearance-none"
                >
                  <option value="desc">Newest / Highest</option>
                  <option value="asc">Oldest / Lowest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-40 animate-fadeIn"
        />
      )}
    </>
  );
};

export default FilterPanel;