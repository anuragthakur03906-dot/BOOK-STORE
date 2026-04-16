import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI, bookAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { 
  FiEdit, FiTrash2, FiEye, 
  FiChevronLeft, FiChevronRight,
  FiPlus
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

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
      toast.error('Failed to load books');
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
      console.error('Failed to fetch genres:', error);
    }
  }, []);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Delete this book permanently?')) return;
    try {
      const response = await adminAPI.deleteBook(bookId);
      if (response.data.success) {
        toast.success('Book deleted');
        fetchBooks();
      }
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const toggleSelectBook = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  return (
    <div className="min-h-screen bg-base py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-text-main tracking-tight uppercase italic">Inventory</h1>
            <p className="text-text-muted mt-2">Managing the global bookstore catalogue.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 text-text-main px-4 py-2 rounded-xl text-sm font-bold outline-none border-none"
            >
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <Link
              to="/books/new"
              className="bg-brand text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand/20 flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Book
            </Link>
          </div>
        </div>

        {/* Selected Actions */}
        {selectedBooks.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl flex justify-between items-center animate-slideIn">
            <span className="text-sm font-bold text-red-700 dark:text-red-400">{selectedBooks.length} items selected</span>
            <button className="text-xs font-black uppercase text-red-700 hover:underline">Bulk Delete</button>
          </div>
        )}

        {/* Table container */}
        <div className="bg-base shadow-2xl shadow-black/5 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-5 text-left w-10">
                    <input 
                      type="checkbox" 
                      onChange={() => setSelectedBooks(selectedBooks.length === books.length ? [] : books.map(b => b._id))}
                      checked={books.length > 0 && selectedBooks.length === books.length}
                      className="rounded border-gray-300 text-brand"
                    />
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Book Title</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Author</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Genre</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Price</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {books.map((b) => (
                  <tr key={b._id} className="group hover:bg-base/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-8 py-6">
                      <input 
                        type="checkbox" 
                        checked={selectedBooks.includes(b._id)}
                        onChange={() => toggleSelectBook(b._id)}
                        className="rounded border-gray-300 text-brand"
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <div className="font-bold text-text-main group-hover:text-brand transition-colors line-clamp-1">{b.title}</div>
                        <div className="text-[10px] text-text-muted uppercase tracking-tighter">Rating: {b.rating || '0.0'} ★</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-text-main font-medium">{b.author}</td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold uppercase py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded">{b.genre}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-brand">${parseFloat(b.price || 0).toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/books/${b._id}`)} className="p-2 text-text-muted hover:text-brand"><FiEye /></button>
                        <button onClick={() => navigate(`/books/${b._id}/edit`)} className="p-2 text-text-muted hover:text-brand"><FiEdit /></button>
                        <button onClick={() => handleDeleteBook(b._id)} className="p-2 text-text-muted hover:text-red-500"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;