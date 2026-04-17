const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50/50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 my-6 rounded-r-2xl transform animate-headShake">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-red-500 rounded-full p-1 shadow-lg shadow-red-500/30">
          <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">Protocol Violation</h4>
          <p className="text-sm text-text-main font-bold mt-1 italic">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
