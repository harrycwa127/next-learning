import clsx from 'clsx';
import GithubSlugger from 'github-slugger';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

type Props = {
  source?: string;
};

const TableOfContents = ({ source }: Props) => {
  const { t } = useTranslation(['common']);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const slugger = new GithubSlugger();

    const updateHeadingsAndObserver = () => {
      const headingNodes = Array.from(
        document.querySelectorAll<HTMLElement>('article .postBody h2, article .postBody h3')
      );

      if (headingNodes.length === 0) return { items: [], nodes: [] };

      const items: HeadingItem[] = headingNodes.map((node) => {
        const rawText = node.textContent?.trim() || '';
        const text = rawText.replace(/#+\s*$/, '').trim();

        if (!node.id) {
          node.id = slugger.slug(text);
        }

        return {
          id: node.id,
          text,
          level: node.tagName === 'H3' ? 3 : 2,
        };
      });

      setHeadings(items);
      return { items, nodes: headingNodes };
    };

    let observer: IntersectionObserver | null = null;

    const bindObserver = (nodes: HTMLElement[]) => {
      if (observer) observer.disconnect();
      if (nodes.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter((entry) => entry.isIntersecting);
          if (visibleEntries.length > 0) {
            setActiveId(visibleEntries[0].target.id);
          }
        },
        {
          rootMargin: '-80px 0px -60% 0px',
          threshold: 0.1,
        }
      );

      nodes.forEach((node) => observer?.observe(node));
    };

    const { nodes } = updateHeadingsAndObserver();
    bindObserver(nodes);

    const articleEl = document.querySelector('article');
    const mutationObserver = new MutationObserver(() => {
      const { nodes: updatedNodes } = updateHeadingsAndObserver();
      bindObserver(updatedNodes);
    });

    if (articleEl) {
      mutationObserver.observe(articleEl, { childList: true, subtree: true });
    }

    return () => {
      if (observer) observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [source]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <p className="mb-5 text-lg font-semibold text-gray-900 transition-colors dark:text-gray-100">
        {t('table-of-contents')}
      </p>
      <div className="flex flex-col items-start justify-start">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <button
              key={heading.id}
              type="button"
              className={clsx(
                isActive
                  ? 'font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
                  : 'font-normal text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200',
                heading.level === 3 && 'pl-4',
                'mb-3 text-left text-sm transition-colors hover:underline'
              )}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(heading.id);
                if (target) {
                  target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }}
            >
              {heading.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TableOfContents;