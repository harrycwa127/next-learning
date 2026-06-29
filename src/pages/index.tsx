import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ArticleJsonLd } from 'next-seo';
import { useState, useEffect } from 'react';

import {
  getCommandPalettePosts,
  PostForCommandPalette,
} from '@/components/CommandPalette/getCommandPalettePosts';
import { useCommandPalettePostActions } from '@/components/CommandPalette/useCommandPalettePostActions';
import CommandSvg from '@/components/CommandSvg';
import CustomImage from '@/components/CustomImage';
import LayoutPerPage from '@/components/LayoutPerPage';
import PostList, { PostForPostList } from '@/components/PostList';
import TagFilter from '@/components/TagFilter';
import { siteConfigs } from '@/configs/siteConfigs';
import { allPostsNewToOld } from '@/lib/contentLayerAdapter';
import generateRSS from '@/lib/generateRSS';

import selfImage from '../../public/images/self-image.png';

type PostForIndexPage = PostForPostList;

type Props = {
  posts: PostForIndexPage[];
  commandPalettePosts: PostForCommandPalette[];
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const locale = context.locale!;
  const commandPalettePosts = getCommandPalettePosts();

  const posts = allPostsNewToOld.map((post) => ({
    slug: post.slug,
    date: post.date,
    updateDate: post.updateDate || null,
    tag: post.tag || null,
    pin: post.pin || null,
    title: post.title,
    description: post.description,
    path: post.path,
  })) as PostForIndexPage[];

  generateRSS();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['indexPage', 'common'])),
      posts,
      commandPalettePosts,
    },
  };
};

const Home: NextPage<Props> = ({ posts, commandPalettePosts }) => {
  const { t } = useTranslation(['indexPage', 'common']);

  const [filteredPost, setFilteredPost] = useState(posts);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(posts.map((post) => post.tag).filter(Boolean))
  ) as string[];

  useEffect(() => {
    if (selectedTag) {
      setFilteredPost(posts.filter((post) => post.tag === selectedTag));
    } else {
      setFilteredPost(posts);
    }
  }, [selectedTag, posts]);

  useCommandPalettePostActions(commandPalettePosts);

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

      <div className="mt-12 flex items-center justify-between md:my-12">
        <div className="prose w-3/5 space-y-2 transition-colors dark:prose-dark md:prose-lg md:space-y-5">
          <h1 className="text-left">{t('intro-title')}</h1>
          <p className="mr-1">{t('intro-1')}</p>
          <p className="mr-1">{t('intro-2')}</p>
          <p className="mr-1">{t('intro-3')}</p>
        </div>

        <div className="w-2/5 md:w-1/4">
          <CustomImage src={selfImage} alt="Self Image" />
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

        <PostList posts={filteredPost} />
      </div>
    </LayoutPerPage>
  );
};

export default Home;
