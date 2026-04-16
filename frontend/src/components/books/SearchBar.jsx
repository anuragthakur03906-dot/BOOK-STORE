
import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Real-time search with debouncing (300ms delay)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  // Clear search input
  const handleClear = () => {
    setSearchTerm('');
  };

  // Handle explicit search button click
  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick();
              }
            }}
            placeholder="Search books by title, author, or description..."
            className="input-field w-full pl-12 pr-12 py-3"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          aria-label="Search"
        >
          <FiSearch className="h-5 w-5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

