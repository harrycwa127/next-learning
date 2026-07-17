import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Pin } from 'lucide-react';

import Comment from '@/components/Comment';
import CustomLink from '@/components/CustomLink';
import PageTitle from '@/components/PageTitle';
import TagDisplay, {Tag} from '@/components/TagDisplay';
import PostBody from '@/components/PostBody';
import TableOfContents from '@/components/TableOfContents';
import formatDate from '@/lib/formatDate';

export interface PostForPostLayout {
  date: string;
  updateDate: string | null;
  tag: string | null;
  pin: boolean | null;
  title: string;
  body: { raw: string };
}

export type RelatedPostForPostLayout = {
  title: string;
  path: string;
} | null;

type Props = {
  post: PostForPostLayout;
  nextPost: RelatedPostForPostLayout;
  prevPost: RelatedPostForPostLayout;
  children: React.ReactNode;
  tags: Tag[];
};

export default function PostLayout({
  post,
  nextPost,
  prevPost,
  children,
  tags
}: Props) {
  const {
    date,
    updateDate,
    tag,
    pin,
    title,
    body: { raw },
  } = post;

  const { locale } = useRouter();
  const { i18n, t } = useTranslation(['common']);

  const tagInfo = tag ? tags.find((t) => t.value === tag) : null;

  return (
    <article>
      <div className="divide-y divide-gray-200 transition-colors dark:divide-gray-700">
        <header className="py-6">
          <div className="space-y-1 text-center">
            <div className="mb-4">
              <div className="relative inline-block leading-none">
                
                {(tagInfo || pin) && (
                  <div className="flex items-center gap-1.5 mb-2.5 sm:mb-0 sm:absolute sm:right-full sm:top-1/2 sm:mr-3 sm:-translate-y-[30%] whitespace-nowrap justify-center">
                    {pin && (
                      <Pin 
                        size={18}
                        strokeWidth={1.8} 
                        className="text-amber-500 dark:text-amber-400/90 shrink-0 rotate-45 transform" 
                      />
                    )}
                    {tagInfo && <TagDisplay>{i18n.language === 'zh-TW' ? tagInfo.chi_name : tagInfo.eng_name}</TagDisplay>}
                  </div>
                )}
                
                <PageTitle>{title}</PageTitle>
              </div>
            </div>

            <dl className="flex flex-row items-center justify-center space-y-0">
              <div>
                <dt className="sr-only">{t('published-time')}</dt>
                <dd className="text-sm font-medium leading-6 text-gray-500 transition-colors dark:text-gray-400 sm:text-base">
                  <time dateTime={date}>{formatDate(date, locale)}</time>
                </dd>
              </div>
              {updateDate && updateDate !== date && (
                <>
                  <div className="mx-1 text-base text-gray-500 transition-colors dark:text-gray-400">
                    •
                  </div>
                  <div>
                    {/* <dt className="sr-only">{t('updated-time')}</dt> */}
                    <dd className="text-sm font-medium leading-6 text-gray-500 transition-colors dark:text-gray-400 sm:text-base">
                      {t('updated-time') + ' '}
                      <time dateTime={updateDate}>
                        {formatDate(updateDate, locale)}
                      </time>
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </header>

        <div
          className="pb-8 transition-colors lg:grid lg:grid-cols-4 lg:gap-x-6"
          style={{ gridTemplateRows: 'auto 1fr' }}
        >
          <div className="divide-y divide-gray-200 pt-10 pb-8 transition-colors dark:divide-gray-700 lg:col-span-3">
            <PostBody>{children}</PostBody>
          </div>

          {/* DESKTOP TABLE OF CONTENTS */}
          <aside>
            <div className="hidden lg:sticky lg:top-24 lg:col-span-1 lg:block">
              <TableOfContents source={raw} />
            </div>
          </aside>
        </div>

        <div className="divide-y divide-gray-200 transition-colors dark:divide-gray-700">
          <div className="py-6">
            <Comment />
          </div>

          {/* 🌟 優化：將上下一篇文章包裝為具備動態反饋的動畫小組件 */}
          <footer className="pt-8 pb-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-base font-medium">
              {prevPost ? (
                <div className="flex flex-col items-start">
                  <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    {t('previous-article')}
                  </h2>
                  <CustomLink
                    href={prevPost.path}
                    className="group inline-flex items-center text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400 leading-relaxed"
                  >
                    <span className="inline-block transition-transform group-hover:-translate-x-1 mr-1.5">←</span>
                    {prevPost.title}
                  </CustomLink>
                </div>
              ) : (
                <div />
              )}
              
              {nextPost && (
                <div className="flex flex-col items-start sm:items-end">
                  <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    {t('next-article')}
                  </h2>
                  <CustomLink
                    href={nextPost.path}
                    className="group inline-flex items-center text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400 sm:justify-end text-left sm:text-right leading-relaxed"
                  >
                    {nextPost.title}
                    <span className="inline-block transition-transform group-hover:translate-x-1 ml-1.5">→</span>
                  </CustomLink>
                </div>
              )}
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
