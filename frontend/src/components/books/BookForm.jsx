import { useState, useEffect } from 'react';
import { FiBook, FiDollarSign, FiCalendar, FiStar, FiTag, FiSave, FiX, FiUpload } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { bookAPI, uploadAPI } from '../../services/api.js';
import toast from 'react-hot-toast';
import ErrorMessage from '../common/ErrorMessage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const BookForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    publishedYear: new Date().getFullYear(),
    rating: 0,
    description: '',
    inStock: true,
    coverImage: '',
    coverImageUrl: ''
  });

  const genres = [
    'Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 
    'Biography', 'Self-Help', 'Technology', 'Fantasy', 'Romance'
  ];

  useEffect(() => {
    if (isEdit && id) {
      fetchBook();
    }
  }, [isEdit, id]);

  const fetchBook = async () => {
    setFormLoading(true);
    try {
      const response = await bookAPI.getBook(id);
      if (response.data.success) {
        const book = response.data.data;
        const coverUrl = book.coverImage ? uploadAPI.getBookCover(book.coverImage) : '';
        setFormData({
          title: book.title || '',
          author: book.author || '',
          genre: book.genre || '',
          price: book.price || '',
          publishedYear: book.publishedYear || new Date().getFullYear(),
          rating: book.rating || 0,
          description: book.description || '',
          inStock: book.inStock ?? true,
          coverImage: book.coverImage || '',
          coverImageUrl: coverUrl
        });
      }
    } catch (error) {
      toast.error('Failed to fetch book');
      navigate('/books');
    } finally {
      setFormLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.trim().length < 2) {
      newErrors.author = 'Author must be at least 2 characters';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Price must be a positive number';
      } else if (price > 10000) {
        newErrors.price = 'Price cannot exceed $10,000';
      }
    }
    
    if (!formData.publishedYear) {
      newErrors.publishedYear = 'Published year is required';
    } else {
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.publishedYear);
      if (isNaN(year) || year < 1000 || year > currentYear) {
        newErrors.publishedYear = `Year must be between 1000 and ${currentYear}`;
      }
    }
    
    const rating = parseFloat(formData.rating);
    if (!isNaN(rating) && (rating < 0 || rating > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadAPI.uploadBookCover(file);
      if (response.data.success) {
        const fileInfo = response.data.data;
        setFormData(prev => ({
          ...prev,
          coverImage: fileInfo.fileId,
          coverImageUrl: uploadAPI.getBookCover(fileInfo.fileId)
        }));
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to upload image';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        price: parseFloat(formData.price),
        publishedYear: parseInt(formData.publishedYear),
        rating: parseFloat(formData.rating),
        description: formData.description,
        inStock: formData.inStock,
        coverImage: formData.coverImage
      };
      
      let response;
      if (isEdit) {
        response = await bookAPI.updateBook(id, bookData);
        toast.success('Book updated successfully');
      } else {
        response = await bookAPI.createBook(bookData);
        toast.success('Book created successfully');
      }
      
      if (response.data.success) {
        navigate('/books');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to save book';
      toast.error(errorMsg);
      
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path] = err.msg;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {isEdit ? 'Edit Book' : 'Add New Book'}
                </h1>
                <p className="text-blue-100 mt-2">
                  {isEdit ? 'Update your book details' : 'Add a new book to your collection'}
                </p>
              </div>
              <div className="hidden md:block">
                <FiBook className="h-12 w-12 text-blue-200" />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <FiBook className="h-4 w-4" />
                      <span>Book Title *</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field w-full ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter book title"
                    disabled={loading}
                  />
                  {errors.title && <ErrorMessage message={errors.title} />}
                  <p className="text-xs text-gray-500 mt-1">Minimum 2 characters, maximum 200 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <FiBook className="h-4 w-4" />
                      <span>Author *</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`input-field w-full ${errors.author ? 'border-red-500' : ''}`}
                    placeholder="Enter author name"
                    disabled={loading}
                  />
                  {errors.author && <ErrorMessage message={errors.author} />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <FiTag className="h-4 w-4" />
                      <span>Genre *</span>
                    </div>
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className={`input-field w-full ${errors.genre ? 'border-red-500' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  {errors.genre && <ErrorMessage message={errors.genre} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <FiDollarSign className="h-4 w-4" />
                      <span>Price ($) *</span>
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className={`input-field w-full pl-8 ${errors.price ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      disabled={loading}
                    />
                  </div>
                  {errors.price && <ErrorMessage message={errors.price} />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="h-4 w-4" />
                      <span>Published Year *</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="publishedYear"
                    min="1000"
                    max={new Date().getFullYear()}
                    value={formData.publishedYear}
                    onChange={handleChange}
                    className={`input-field w-full ${errors.publishedYear ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.publishedYear && <ErrorMessage message={errors.publishedYear} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <FiStar className="h-4 w-4" />
                      <span>Rating (0-5)</span>
                    </div>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.5"
                      value={formData.rating}
                      onChange={handleChange}
                      className="flex-1"
                      disabled={loading}
                    />
                    <span className="text-lg font-semibold text-gray-700 min-w-[40px]">
                      {formData.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className={`input-field w-full ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Enter book description (optional)..."
                  disabled={loading}
                />
                {errors.description && <ErrorMessage message={errors.description} />}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FiUpload className="h-4 w-4" />
                    <span>Book Cover Image</span>
                  </div>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <FiUpload className="h-4 w-4 mr-2" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading || loading}
                      className="hidden"
                    />
                  </label>
                  {formData.coverImage && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, coverImage: '', coverImageUrl: '' }))}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, WebP, GIF (Max 5MB)
                </p>
              </div>

              {formData.coverImageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Preview
                  </label>
                  <img
                    src={formData.coverImageUrl}
                    alt="Book cover preview"
                    className="h-48 w-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  id="inStock"
                  name="inStock"
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600"
                  disabled={loading}
                />
                <label htmlFor="inStock" className="ml-3">
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>
              </div>

              <div className="flex gap-4 pt-8 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/books')}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  <FiX className="mr-2 inline h-5 w-5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (
                    <>
                      <FiSave className="mr-2 inline h-5 w-5" />
                      {isEdit ? 'Update Book' : 'Create Book'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
