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
    <nav className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-6 sm:py-8 px-3 sm:px-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8 md:mt-12 transition-all" aria-label="Pagination">
      {/* Previous Button - Responsive */}
      <div className="flex items-center justify-center md:justify-start">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="inline-flex items-center justify-center px-3 sm:px-6 py-3 min-h-11 min-w-32 sm:min-w-40 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-text-main font-semibold text-sm hover:border-brand hover:text-brand hover:bg-brand/5 dark:hover:bg-brand/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-text-main transition-all active:scale-95"
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-5 w-5" />
          <span className="ml-1 hidden xs:inline">Previous</span>
        </button>
      </div>

      {/* Page Numbers - Responsive Grid */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg font-bold text-sm transition-all ${
              currentPage === page
                ? 'bg-brand text-white shadow-lg shadow-brand/30'
                : 'border-2 border-gray-200 dark:border-gray-700 text-text-main hover:border-brand hover:text-brand bg-white dark:bg-slate-800 active:scale-95'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Page Info and Next Button - Responsive */}
      <div className="flex flex-col-reverse xs:flex-row xs:items-center xs:justify-end gap-3 xs:gap-4">
        {/* Page Info */}
        <span className="text-xs sm:text-sm text-text-muted font-medium whitespace-nowrap text-center xs:text-right">
          Page <span className="font-bold text-text-main">{currentPage}</span> of <span className="font-bold text-text-main">{totalPages}</span>
        </span>
        
        {/* Next Button - Responsive */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="inline-flex items-center justify-center px-3 sm:px-6 py-3 min-h-11 min-w-32 sm:min-w-40 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-text-main font-semibold text-sm hover:border-brand hover:text-brand hover:bg-brand/5 dark:hover:bg-brand/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-text-main transition-all active:scale-95"
          aria-label="Next page"
        >
          <span className="hidden xs:inline">Next</span>
          <FiChevronRight className="h-5 w-5 xs:ml-1" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
