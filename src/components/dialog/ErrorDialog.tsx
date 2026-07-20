import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export interface ErrorItem {
  name: string;
  message: string | null | undefined;
}

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; 
  errors: ErrorItem[];
}

export default function ErrorDialog({ isOpen, onClose, title, errors }: ErrorDialogProps) {
  const router = useRouter();
  const { t } = useTranslation(['common']);

  const activeErrors = errors.filter((err) => !!err.message);

  if (!isOpen || activeErrors.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3 text-red-500 dark:text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {title || t('error') || '發生系統錯誤'}
          </h3>
        </div>
        
        <div className="mt-2 space-y-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-h-32 overflow-y-auto">
          {activeErrors.map((err) => (
            <p key={err.name} className="font-mono bg-red-50 dark:bg-red-950/30 p-2 rounded text-xs text-red-600 dark:text-red-300">
              <span className="font-bold uppercase mr-1">{err.name}:</span> {err.message}
            </p>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t('close') || '關閉'}
          </button>
          <button
            type="button"
            onClick={() => {
              router.push('/');
              onClose();}
            }
            className="inline-flex justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
          >
            {t('back-to-home') || '回首頁'}
          </button>
        </div>
      </div>
    </div>
  );
}