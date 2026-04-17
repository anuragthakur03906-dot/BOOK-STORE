import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed? This action cannot be undone.", 
  confirmText = "Proceed", 
  cancelText = "Cancel",
  isDanger = true 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-slate-800 transform transition-all">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-xl ${isDanger ? 'bg-red-50 text-red-600 dark:bg-red-950/40' : 'bg-brand/10 text-brand'}`}>
            <FiAlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-text-main leading-tight">{title}</h3>
        </div>
        
        <p className="text-text-muted mb-10 text-sm leading-relaxed font-medium">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-6 py-2.5 btn-outline border-gray-200 order-2 sm:order-1"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 px-6 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 order-1 sm:order-2 ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/10' 
                : 'bg-brand hover:opacity-90 shadow-brand/10'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
