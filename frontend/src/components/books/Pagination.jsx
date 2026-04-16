import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
  
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  // Calculate page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between py-8 px-4 bg-white rounded-lg border border-gray-200 mt-8" aria-label="Pagination">
      {/* Previous Button */}
      <div className="flex items-center gap-2 mb-4 sm:mb-0">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline text-sm font-medium">Previous</span>
        </button>
      </div>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center mb-4 sm:mb-0">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button and Page Info */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <span className="hidden sm:inline text-sm font-medium mr-1">Next</span>
          <FiChevronRight className="h-4 w-4" />
        </button>

        {/* Page Info */}
        <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap ml:2 sm:ml-4">
          {currentPage} / {totalPages}
        </span>
      </div>
    </nav>
  );
};

export default Pagination;
