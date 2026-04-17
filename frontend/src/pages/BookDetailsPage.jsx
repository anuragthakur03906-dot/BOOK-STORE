import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookAPI, uploadAPI } from '../services/api.js';
import { 
  FiBook, FiUser, FiCalendar, FiTag, 
  FiDollarSign, FiStar, FiEdit, FiTrash2, FiLayers 
} from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import toast from 'react-hot-toast';
import BackButton from '../components/common/BackButton.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookAPI.getBook(id);
      if (response.data.success) {
        setBook(response.data.data);
      }
    } catch (error) {
      toast.error('Could not find this record');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    setDeleting(true);
    try {
      const response = await bookAPI.deleteBook(id);
      if (response.data.success) {
        toast.success('Book record removed');
        navigate('/books');
      }
    } catch (error) {
      toast.error('Record deletion failed');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!book) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-base p-6">
        <h2 className="text-xl font-bold text-text-main mb-6">Record Not Found</h2>
        <BackButton />
     </div>
  );

  return (
    <div className="min-h-screen bg-base py-12 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-10">
           <BackButton />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-50 dark:border-slate-800">
          <div className="p-10 md:p-16">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
              
              {/* Asset - Book Cover */}
              <div className="md:w-1.3">
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-3xl w-64 md:w-80 h-96 mx-auto flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-inner overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={uploadAPI.getBookCover(book.coverImage)}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-text-muted opacity-20">
                       <FiLayers className="h-24 w-24" />
                       <span className="text-sm font-bold uppercase tracking-widest">No Cover Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Information - Metadata */}
              <div className="md:w-2/3 space-y-8">
                <div>
                   <h1 className="text-4xl font-bold text-text-main mb-3 leading-tight tracking-tight">{book.title}</h1>
                   <div className="flex items-center gap-2 text-xl font-medium text-brand">
                      <FiUser className="text-brand/60" />
                      <span>{book.author}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   <MetaGrid icon={<FiDollarSign className="text-green-500" />} label="Pricing" value={`$${book.price?.toFixed(2)}`} />
                   <MetaGrid icon={<FiStar className="text-yellow-500" />} label="Ratings" value={`${book.rating?.toFixed(1)} / 5`} />
                   <MetaGrid icon={<FiCalendar className="text-blue-500" />} label="Edition" value={book.publishedYear} />
                   <MetaGrid icon={<FiTag className="text-purple-500" />} label="Genre" value={book.genre} />
                </div>

                <div className="space-y-4">
                   <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Executive Summary</h3>
                   <p className="text-text-main leading-relaxed font-medium bg-gray-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-gray-100/50 dark:border-slate-800/50">
                     {book.description || "No formal description provided for this catalogue entry."}
                   </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <span className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
                    book.inStock ? 'bg-green-100 text-green-700 dark:bg-green-950/30' : 'bg-red-100 text-red-700 dark:bg-red-950/30'
                  }`}>
                    {book.inStock ? 'Active Inventory' : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-8 border-t border-gray-50 dark:border-slate-800">
                    <Link
                      to={`/books/${book._id}/edit`}
                      className="flex-1 btn-outline py-3 flex items-center justify-center gap-2"
                    >
                      <FiEdit /> Edit Details
                    </Link>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="flex-1 px-6 py-3 bg-red-50 dark:bg-red-950/20 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <FiTrash2 /> Remove Title
                    </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 py-6 bg-gray-50/30 dark:bg-slate-800/10 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <FiUser className="text-brand" /> Recorded by {book.addedBy?.name || "System"}
             </div>
             <div>Internal ID: {book._id}</div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeDelete}
        title="Delete Book Record"
        message="This operation will permanently remove this title from the global inventory system. Are you certain you wish to proceed?"
        confirmText={deleting ? "Removing..." : "Confirm Deletion"}
        cancelText="Cancel"
      />
    </div>
  );
};

const MetaGrid = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:border-brand/20">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-lg font-bold text-text-main truncate">{value}</div>
  </div>
);

export default BookDetailsPage;