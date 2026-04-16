import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search collections..."
          className="w-full bg-base text-text-main pl-6 pr-14 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 focus:border-brand focus:ring-0 transition-all outline-none text-lg shadow-sm placeholder:text-text-muted/50"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-text-muted hover:text-brand transition-colors rounded-full hover:bg-brand/10"
              aria-label="Clear search"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
          <div className="h-6 w-[1px] bg-gray-100 dark:bg-gray-800"></div>
          <span className="text-[10px] font-bold text-text-muted uppercase px-2">ESC</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
