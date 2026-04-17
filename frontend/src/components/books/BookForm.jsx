import { useState, useEffect } from 'react';
import { FiDollarSign, FiCalendar, FiStar, FiTag, FiSave, FiUpload, FiType, FiUser, FiFileText } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { bookAPI, uploadAPI } from '../../services/api.js';
import toast from 'react-hot-toast';
import BackButton from '../common/BackButton.jsx';

const BookForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
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
    if (isEdit && id) fetchBook();
  }, [isEdit, id]);

  const fetchBook = async () => {
    setFormLoading(true);
    try {
      const response = await bookAPI.getBook(id);
      if (response.data.success) {
        const book = response.data.data;
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
          coverImageUrl: book.coverImage ? uploadAPI.getBookCover(book.coverImage) : ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch book');
      navigate('/books');
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        toast.success('Cover uploaded');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bookData = { ...formData, price: parseFloat(formData.price), publishedYear: parseInt(formData.publishedYear), rating: parseFloat(formData.rating) };
      if (isEdit) await bookAPI.updateBook(id, bookData);
      else await bookAPI.createBook(bookData);
      toast.success(isEdit ? 'Updated successfully' : 'Added successfully');
      navigate('/books');
    } catch (error) {
      toast.error('Error saving book data');
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <BackButton />
        <h1 className="text-2xl font-bold text-text-main">{isEdit ? 'Edit Book Details' : 'Add New Book'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Book Title" name="title" value={formData.title} onChange={handleChange} icon={<FiType />} placeholder="Enter title" required />
          <FormInput label="Author Name" name="author" value={formData.author} onChange={handleChange} icon={<FiUser />} placeholder="Enter author" required />
          
          <div className="space-y-2 text-sm">
            <label className="font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <FiTag className="text-brand" /> Genre
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand outline-none text-text-main font-medium transition-all"
              required
            >
              <option value="">Select Category</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <FormInput label="Price (USD)" name="price" type="number" value={formData.price} onChange={handleChange} icon={<FiDollarSign />} placeholder="0.00" step="0.01" required />
          <FormInput label="Year" name="publishedYear" type="number" value={formData.publishedYear} onChange={handleChange} icon={<FiCalendar />} placeholder="2024" />
          
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <FiStar className="text-brand" /> Rating ({formData.rating}/5)
            </label>
            <input type="range" name="rating" min="0" max="5" step="0.5" value={formData.rating} onChange={handleChange} className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <FiFileText className="text-brand" /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand outline-none text-text-main font-medium transition-all resize-none"
            placeholder="Write a brief summary..."
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8 py-4 border-t border-gray-50 dark:border-slate-800">
           <div className="flex-1 space-y-4 w-full">
              <label className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                <FiUpload className="text-brand" /> Upload Book Cover
              </label>
              <div className="flex gap-4">
                <label className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl cursor-pointer hover:opacity-90 transition-all text-sm">
                  {uploading ? 'Processing...' : 'Browse Images'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden disabled={uploading} />
                </label>
                {formData.coverImage && (
                  <button type="button" onClick={() => setFormData({...formData, coverImage: '', coverImageUrl: ''})} className="text-red-500 text-xs font-bold hover:underline">Remove Image</button>
                )}
              </div>
           </div>
           {formData.coverImageUrl && (
             <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-slate-100 dark:border-slate-700 shadow-md">
               <img src={formData.coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
             </div>
           )}
        </div>

        <div className="flex items-center gap-4 py-4">
           <input
              id="inStock"
              name="inStock"
              type="checkbox"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand accent-brand cursor-pointer"
           />
           <label htmlFor="inStock" className="text-sm font-bold text-text-main cursor-pointer">In Stock Inventory</label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-50 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="px-8 py-3 btn-outline border-gray-200 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-8 py-3 btn-primary shadow-brand/20 order-1 sm:order-2"
          >
            <span className="flex items-center gap-2">
              <FiSave /> {loading ? 'Saving Entry...' : (isEdit ? 'Save Changes' : 'Confirm & Add')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand outline-none text-text-main font-medium transition-all placeholder:text-text-muted/40"
      {...props}
    />
  </div>
);

export default BookForm;
