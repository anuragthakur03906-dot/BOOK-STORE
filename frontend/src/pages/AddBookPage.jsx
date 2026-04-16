import { useNavigate } from 'react-router-dom';
import BookForm from '../components/books/BookForm.jsx';

const AddBookPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
      <BookForm isEdit={false} />
    </>
  );
};

export default AddBookPage;