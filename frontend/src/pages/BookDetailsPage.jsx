import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/api.js';
import { uploadAPI } from "../services/api.js";
import { FiBook, FiUser, FiCalendar, FiTag, FiDollarSign, FiStar, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle book deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await bookAPI.deleteBook(id);
      if (response.data.success) {
        toast.success('Book deleted successfully');
        navigate('/books');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to delete book';
      toast.error(errorMsg);
      console.error('Error deleting book:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-main mb-4">Book Not Found</h2>
          <Link to="/books" className="text-brand hover:underline">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-base rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left - Book Cover */}
              <div className="md:w-1/3">
                <div className="bg-gray-100 rounded-lg h-64 md:h-80 flex items-center justify-center">
                  {book.coverImage ? (
                    <img
  src={uploadAPI.getBookCover(book.coverImage)}
  alt={book.title}
  className="h-full w-full object-cover rounded-lg"
/>
                  ) : (
                    <FiBook className="h-32 w-32 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Right - Book Details */}
              <div className="md:w-2/3">
                <div className="mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">
                      {book.title}
                    </h1>
                    <p className="text-xl text-text-muted">
                      by {book.author}
                    </p>
                  </div>
                </div>

                {/* Book Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-base p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiDollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Price</span>
                    </div>
                    <p className="text-2xl font-bold text-text-main">
                      ${book.price?.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-base p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiStar className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="font-medium">Rating</span>
                    </div>
                    <p className="text-2xl font-bold text-text-main">
                      {book.rating?.toFixed(1)}/5
                    </p>
                  </div>

                  <div className="bg-base p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="h-5 w-5 text-brand mr-2" />
                      <span className="font-medium">Year</span>
                    </div>
                    <p className="text-2xl font-bold text-text-main">
                      {book.publishedYear}
                    </p>
                  </div>

                  <div className="bg-base p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiTag className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium">Genre</span>
                    </div>
                    <p className="text-2xl font-bold text-text-main">
                      {book.genre}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-text-main mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-8">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    book.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Added By */}
                {book.addedBy && (
                  <div className="border-t pt-6 mb-8">
                    <h3 className="text-lg font-semibold text-text-main mb-3">Added By</h3>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-brand" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-text-main">{book.addedBy.name}</p>
                        <p className="text-sm text-text-muted">{book.addedBy.email}</p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded font-medium ${
                          book.addedBy.roleName === 'admin' ? 'bg-red-100 text-red-800' :
                          book.addedBy.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {book.addedBy.roleName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Edit and Delete */}
                <div className="border-t pt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/books/${book._id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-lg text-brand hover:bg-blue-50 transition-colors font-medium"
                  >
                    <FiEdit className="h-5 w-5 mr-2" />
                    Edit Book
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center px-4 py-2 border border-red-600 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="h-5 w-5 mr-2" />
                    {deleting ? 'Deleting...' : 'Delete Book'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-base px-8 py-4 border-t">
            <div className="flex justify-between items-center">
              <Link
                to="/books"
                className="inline-flex items-center text-text-muted hover:text-text-main transition-colors font-medium"
              >
                <FiArrowLeft className="h-4 w-4 mr-2" />
                Back to Books
              </Link>
              <span className="text-sm text-gray-500">
                Book ID: {book._id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;