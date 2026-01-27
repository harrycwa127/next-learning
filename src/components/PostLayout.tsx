import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import Comment from '@/components/Comment';
import CustomLink from '@/components/CustomLink';
import PageTitle from '@/components/PageTitle';
import PostBody from '@/components/PostBody';
import TableOfContents from '@/components/TableOfContents';
import formatDate from '@/lib/formatDate';

export interface PostForPostLayout {
  date: string;
  updateDate: string;
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
};

export default function PostLayout({
  post,
  nextPost,
  prevPost,
  children,
}: Props) {
  const {
    date,
    updateDate,
    title,
    body: { raw },
  } = post;

  const { locale } = useRouter();
  const { t } = useTranslation(['common']);

  return (
    <article>
      <div className="divide-y divide-gray-200 transition-colors dark:divide-gray-700">
        <header className="py-6">
          <div className="space-y-1 text-center">
            <div className="mb-4">
              <PageTitle>{title}</PageTitle>
            </div>

            <dl className="flex flex-row items-center justify-center space-y-10 space-y-0">
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

        <div
          className="divide-y divide-gray-200 pb-8 transition-colors dark:divide-gray-700"
          // style={{ gridTemplateRows: 'auto 1fr' }}
        >
          <Comment />

          <footer>
            <div className="flex flex-col gap-4 pt-4 text-base font-medium sm:flex-row sm:justify-between xl:gap-8 xl:pt-8">
              {prevPost ? (
                <div className="basis-6/12">
                  <h2 className="mb-1 text-xs uppercase tracking-wide text-gray-500 transition-colors dark:text-gray-400">
                    {t('previous-article')}
                  </h2>
                  <CustomLink
                    href={prevPost.path}
                    className="text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    ← {prevPost.title}
                  </CustomLink>
                </div>
              ) : (
                <div />
              )}
              {nextPost && (
                <div className="basis-6/12">
                  <h2 className="mb-1 text-left text-xs uppercase tracking-wide text-gray-500 transition-colors dark:text-gray-400 sm:text-right">
                    {t('next-article')}
                  </h2>
                  <CustomLink
                    href={nextPost.path}
                    className="block text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400 sm:text-right"
                  >
                    {nextPost.title} →
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
