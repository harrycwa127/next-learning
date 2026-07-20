import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ArticleJsonLd } from 'next-seo';
import { useState, useEffect } from 'react';

import { getCommandPalettePosts } from '@/components/CommandPalette/getCommandPalettePosts';
import { useCommandPalettePostActions } from '@/components/CommandPalette/useCommandPalettePostActions';
import CommandSvg from '@/components/CommandSvg';
import CustomImage from '@/components/CustomImage';
import LayoutPerPage from '@/components/LayoutPerPage';
import PostList from '@/components/PostList';
import TagFilter from '@/components/TagFilter';
import { siteConfigs } from '@/configs/siteConfigs';
import generateRSS from '@/lib/generateRSS';

import selfImage from '../../public/images/self-image.png';
import { useTags } from '@/contexts/TagsContext';
import { usePosts } from '@/contexts/PostsListContext';
import ErrorDialog from '@/components/dialog/ErrorDialog';
import LoadingSpinner from '@/components/dialog/LoadingSpinner';

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale!;

  generateRSS();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['indexPage', 'common'])),
    },
  };
};

const Home: NextPage = () => {
  const { t } = useTranslation(['indexPage', 'common']);

  const { allTags, tagLoading, tagError } = useTags();
  const { dbPostsList, postLoading, postError } = usePosts();
  const [filteredPost, setFilteredPost] = useState(dbPostsList);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    if (tagError || postError) {
      setShowErrorDialog(true);
    }
  }, [tagError, postError]);

  useEffect(() => {
    if (selectedTag) {
      setFilteredPost(dbPostsList.filter((post) => post.tag === selectedTag));
    } else {
      setFilteredPost(dbPostsList);
    }
  }, [selectedTag, dbPostsList]);

  const commandPalettePosts = getCommandPalettePosts(dbPostsList);
  useCommandPalettePostActions({ posts: commandPalettePosts, tags: allTags });

  if (tagLoading || postLoading)
    return (
      <LoadingSpinner label={t('loading') || 'Loading...'} />
    );
  if (allTags.length === 0)
    return <div className="text-sm text-gray-400">{t('no-tags')}</div>;

  return (
    <LayoutPerPage>
      <ArticleJsonLd
        type="Blog"
        url={siteConfigs.fqdn}
        title={siteConfigs.title}
        images={[siteConfigs.bannerUrl]}
        datePublished={siteConfigs.datePublished}
        authorName={siteConfigs.author}
        description={siteConfigs.description}
      />

      <div className="mt-8 flex w-full flex-col-reverse items-center justify-between gap-8 md:my-16 md:flex-row md:items-center md:gap-12">
        <div className="prose w-full max-w-none space-y-3 transition-colors dark:prose-dark md:prose-lg md:w-7/12">
          <h1 className="!mb-4 !mt-0 text-left text-3xl font-extrabold tracking-tight text-gray-900 transition-colors dark:text-gray-100 sm:text-4xl md:text-5xl">
            {t('intro-title')}
          </h1>
          <p className="leading-relaxed text-gray-600 transition-colors dark:text-zinc-400">
            {t('intro-1')}
          </p>
          <p className="leading-relaxed text-gray-600 transition-colors dark:text-zinc-400">
            {t('intro-2')}
          </p>
          <p className="leading-relaxed text-gray-600 transition-colors dark:text-zinc-400">
            {t('intro-3')}
          </p>
        </div>

        <div className="group relative h-36 w-36 shrink-0 sm:h-48 sm:w-48 md:h-60 md:w-60">
          <div className="h-full w-full overflow-hidden rounded-full shadow-md ring-4 ring-gray-100 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl dark:ring-zinc-800/80">
            <CustomImage
              src={selfImage}
              alt="Self Image"
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="my-4 divide-y divide-gray-200 transition-colors dark:divide-gray-700">
        <div className="mt-8 flex w-full flex-row items-center justify-between gap-2 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="truncate text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl">
              {t('latest-posts')}
            </h2>

            <div className="hidden shrink-0 items-center gap-1.5 text-sm font-normal text-gray-500 dark:text-gray-400 md:inline-flex">
              <span>{t('press')}</span>
              <kbd className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-sans text-xs font-medium text-gray-800 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-800 dark:text-zinc-200">
                Ctrl + K
              </kbd>
              <span className="text-gray-300 dark:text-zinc-700">/</span>
              <kbd className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 px-1.5 py-1 font-sans text-xs font-medium text-gray-800 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-800 dark:text-zinc-200">
                <CommandSvg />
              </kbd>
              <span>{t('to-search')}</span>
            </div>
          </div>

          <div className="shrink-0">
            <TagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          </div>
        </div>

        <PostList posts={filteredPost} tags={allTags} />
      </div>

      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        errors={[
          { name: 'Tags', message: tagError },
          { name: 'Posts', message: postError },
        ]}
      />
    </LayoutPerPage>
  );
};

export default Home;
