import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI, bookAPI, uploadAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { 
  FiEdit, FiTrash2, FiEye, FiArrowRight,
  FiChevronLeft, FiChevronRight,
  FiPlus, FiLayers, FiDollarSign, FiStar
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../common/BackButton.jsx';
import ConfirmModal from '../common/ConfirmModal.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const BookManagement = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  
  // Modal state
  const [modalState, setModalState] = useState({ isOpen: false, bookId: null, title: '' });

  useEffect(() => {
    fetchBooks();
  }, [page, genreFilter]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(genreFilter && { genre: genreFilter })
      };
      const response = await adminAPI.getAllBooks(params);
      if (response.data.success) {
        setBooks(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Inventory retrieval failed');
    } finally {
      setLoading(false);
    }
  }, [page, genreFilter, toast]);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await bookAPI.getGenres();
      if (response.data.success) {
        setGenres(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to categories:', error);
    }
  }, []);

  const executeDeleteBook = async () => {
    try {
      const response = await adminAPI.deleteBook(modalState.bookId);
      if (response.data.success) {
        toast.success('Book record deleted permanently');
        fetchBooks();
      }
    } catch (error) {
      toast.error('Deletion restricted');
    } finally {
      setModalState({ isOpen: false, bookId: null, title: '' });
    }
  };

  const toggleSelectBook = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  if (loading && page === 1) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-base py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 space-y-6">
          <BackButton />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text-main">Inventory Management</h1>
              <p className="text-text-muted mt-1 font-medium italic">Catalogue control and logistics management for all active titles.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 text-text-main px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-100 dark:border-slate-800 outline-none w-full md:w-48"
              >
                <option value="">All Categories</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <Link
                to="/books/new"
                className="btn-primary px-6 py-2.5 shadow-brand/10 flex items-center gap-2 whitespace-nowrap"
              >
                <FiPlus />
                Add Book
              </Link>
            </div>
          </div>
        </div>

        {/* Selected Items Utility Bar */}
        {selectedBooks.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex justify-between items-center animate-fadeIn shadow-sm">
            <span className="text-sm font-bold text-red-600 dark:text-red-400">{selectedBooks.length} items selected for management</span>
            <button className="text-xs font-bold uppercase text-red-600 hover:underline px-4 py-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">Bulk Purge</button>
          </div>
        )}

        {/* Inventory Table Floor */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/20 border-b border-gray-50 dark:border-slate-800">
                  <th className="px-6 py-5 text-left w-10">
                    <input 
                      type="checkbox" 
                      onChange={() => setSelectedBooks(selectedBooks.length === books.length ? [] : books.map(b => b._id))}
                      checked={books.length > 0 && selectedBooks.length === books.length}
                      className="rounded border-gray-300 dark:border-slate-700 text-brand focus:ring-brand accent-brand cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Available Titles</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Author / Creator</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Pricing</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-widest">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {books.map((b) => (
                  <tr key={b._id} className="group hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-5 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedBooks.includes(b._id)}
                        onChange={() => toggleSelectBook(b._id)}
                        className="rounded border-gray-300 dark:border-slate-700 text-brand focus:ring-brand accent-brand cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-slate-700 flex items-center justify-center">
                           {b.coverImage ? (
                             <img src={uploadAPI.getBookCover(b.coverImage)} alt={b.title} className="w-full h-full object-cover" />
                           ) : (
                             <FiLayers className="text-text-muted opacity-30" />
                           )}
                        </div>
                        <div className="min-w-0">
                          <Link to={`/books/${b._id}`} className="font-bold text-text-main group-hover:text-brand transition-colors line-clamp-1 truncate">{b.title}</Link>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-text-muted rounded">{b.genre}</span>
                             <span className="text-[10px] items-center gap-0.5 inline-flex text-yellow-500 font-bold"><FiStar className="inline" /> {b.rating || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-text-main">{b.author}</td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-brand flex items-center gap-1"><FiDollarSign className="text-xs" />{parseFloat(b.price || 0).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/books/${b._id}`)} className="p-2 text-text-muted hover:text-brand hover:bg-brand/5 rounded-lg transition-colors" title="Preview"><FiEye /></button>
                        <button onClick={() => navigate(`/books/${b._id}/edit`)} className="p-2 text-text-muted hover:text-brand hover:bg-brand/5 rounded-lg transition-colors" title="Update"><FiEdit /></button>
                        <button onClick={() => setModalState({ isOpen: true, bookId: b._id, title: b.title })} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" title="Delete"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Management */}
          <div className="px-8 py-6 bg-gray-50/30 dark:bg-slate-800/10 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Page {page} / {totalPages}</span>
            <div className="flex gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl disabled:opacity-30 shadow-sm hover:border-brand/30 transition-all font-bold"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl disabled:opacity-30 shadow-sm hover:border-brand/30 transition-all font-bold"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, bookId: null, title: '' })}
        onConfirm={executeDeleteBook}
        title="Delete Book Record"
        message={`Are you sure you want to remove '${modalState.title}' from the inventory permanently? This action cannot be undone.`}
        confirmText="Confirm Deletion"
        cancelText="Cancel"
      />
    </div>
  );
};

export default BookManagement;