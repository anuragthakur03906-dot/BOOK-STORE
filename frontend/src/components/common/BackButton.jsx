import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`group flex items-center space-x-2 text-text-muted hover:text-brand transition-all duration-200 font-medium ${className}`}
    >
      <div className="p-2 bg-base border border-gray-200 dark:border-gray-800 rounded-lg group-hover:border-brand/30 group-hover:bg-brand/5 shadow-sm">
        <FiArrowLeft className="h-4 w-4" />
      </div>
      <span className="text-sm">Go Back</span>
    </button>
  );
};

export default BackButton;
