interface LoadingSpinnerProps {
  label: string; // 接收動態語系或客製化的加載文字提示
}

export default function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3 animate-in fade-in duration-300">
      <svg 
        className="animate-spin h-8 w-8 text【-primary-500 dark:text-primary-400" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span className="text-sm font-medium text-gray-400 dark:text-zinc-500 tracking-wide animate-pulse">
        {label}
      </span>
    </div>
  );
}