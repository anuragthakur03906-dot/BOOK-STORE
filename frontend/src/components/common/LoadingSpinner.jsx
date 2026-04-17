const LoadingSpinner = ({ fullScreen = false }) => {
  return (
    <div className={`flex flex-col justify-center items-center py-12 ${fullScreen ? 'min-h-screen bg-base' : ''}`}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-brand/10 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="w-2 h-2 bg-brand rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em] italic animate-pulse">Synchronizing Node...</p>
    </div>
  );
};

export default LoadingSpinner;