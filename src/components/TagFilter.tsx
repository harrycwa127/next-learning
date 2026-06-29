import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onSelectTag,
}: TagFilterProps) {
  const { t } = useTranslation(['common']);
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
      {/* 🌟 優化：手機版採用 text-xs 與較緊湊的 px-2.5，大螢幕自動回復標準大小 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex select-none items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-3 sm:py-1.5 sm:text-sm ${
          selectedTag
            ? 'border-blue-500/30 bg-blue-50/70 text-blue-600 shadow-sm shadow-blue-500/10 dark:border-blue-400/20 dark:bg-blue-950/40 dark:text-blue-400'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
        }`}
        aria-label="Filter posts by tag"
      >
        <FunnelIcon
          className={`h-3.5 w-3.5 transition-transform duration-200 sm:h-4 sm:w-4 ${
            isOpen ? 'rotate-12' : ''
          } ${selectedTag ? 'fill-current' : ''}`}
        />
        <span>
          {selectedTag ? `${t('filter')}: ${t(selectedTag)}` : t('Filter')}
        </span>

        {selectedTag && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onSelectTag(null);
              setIsOpen(false);
            }}
            className="-mr-0.5 ml-1 rounded-md p-0.5 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/60"
          >
            <XMarkIcon className="h-3 w-3" />
          </span>
        )}
      </button>

      {isOpen && tags.length > 0 && (
        <div className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-xl border border-gray-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-sm transition-all dark:border-zinc-800 dark:bg-zinc-900/95 sm:w-72">
          <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 sm:text-xs">
            {t('select-tag', 'Select Tag')}
          </div>

          <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto pr-1">
            <button
              onClick={() => {
                onSelectTag(null);
                setIsOpen(false);
              }}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all sm:px-2.5 sm:py-1 sm:text-xs ${
                !selectedTag
                  ? 'bg-gray-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 dark:bg-zinc-800/60 dark:text-zinc-400'
              }`}
            >
              {t('all-posts', 'All')}
            </button>

            {tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    onSelectTag(isSelected ? null : tag);
                    setIsOpen(false);
                  }}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all sm:px-2.5 sm:py-1 sm:text-xs ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 dark:bg-zinc-800/60 dark:text-zinc-400'
                  }`}
                >
                  {t(tag)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
