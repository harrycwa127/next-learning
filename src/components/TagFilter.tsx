import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/components/TagDisplay';

interface TagFilterProps {
  tags: Tag[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onSelectTag,
}: TagFilterProps) {
  const { i18n, t } = useTranslation(['common']);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="not-prose relative inline-block text-left"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex select-none items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.98] sm:text-sm ${
          selectedTag
            ? 'border-blue-500/20 bg-blue-500/5 text-blue-600 shadow-sm shadow-blue-500/5 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
        }`}
        aria-label="Filter posts by tag"
      >
        <FunnelIcon
          className={`h-3.5 w-3.5 shrink-0 transition-colors duration-150 sm:h-4 sm:w-4 ${
            selectedTag ? 'fill-blue-500/10 dark:fill-blue-400/10' : ''
          }`}
        />

        <span className="max-w-[100px] truncate sm:max-w-none">
          {selectedTag ? `${t('filter')}: ${t(selectedTag)}` : t('filter')}
        </span>

        {selectedTag && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelectTag(null);
              setIsOpen(false);
            }}
            className="-mr-0.5 ml-0.5 rounded-md p-0.5 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-300"
          >
            <XMarkIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </span>
        )}
      </button>

      {isOpen && tags.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute right-0 z-30 mt-2 w-60 origin-top-right rounded-xl border border-gray-200/70 bg-white/95 p-3.5 shadow-xl shadow-zinc-200/40 backdrop-blur-md transition-all duration-150 dark:border-zinc-800/80 dark:bg-zinc-900/95 dark:shadow-none sm:w-64">
          <div className="mb-2.5 select-none px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 sm:text-xs">
            {t('select-tag', 'Select Tag')}
          </div>

          <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto pr-1">
            <button
              onClick={() => {
                onSelectTag(null);
                setIsOpen(false);
              }}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                !selectedTag
                  ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200/60 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800/60 dark:bg-zinc-800/30 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {t('all-posts', 'All')}
            </button>

            {tags.map((tag) => {
              const isSelected = selectedTag === tag.value;
              return (
                <button
                  key={tag.value}
                  onClick={() => {
                    onSelectTag(isSelected ? null : tag.value);
                    setIsOpen(false);
                  }}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm dark:border-blue-500 dark:bg-blue-500'
                      : 'border-zinc-200/60 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800/60 dark:bg-zinc-800/30 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  {i18n.language === 'zh-TW' ? tag.chi_name : tag.eng_name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
