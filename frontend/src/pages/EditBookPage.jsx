import BookForm from '../components/books/BookForm.jsx';
import BackButton from '../components/common/BackButton.jsx';

const EditBookPage = () => {
  return (
    <div className="bg-base min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />
        <div className="mt-8">
          <BookForm isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;