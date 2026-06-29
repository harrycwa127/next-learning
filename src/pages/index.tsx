import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ArticleJsonLd } from 'next-seo';

import {
  getCommandPalettePosts,
  PostForCommandPalette,
} from '@/components/CommandPalette/getCommandPalettePosts';
import { useCommandPalettePostActions } from '@/components/CommandPalette/useCommandPalettePostActions';
import CommandSvg from '@/components/CommandSvg';
import CustomImage from '@/components/CustomImage';
import LayoutPerPage from '@/components/LayoutPerPage';
import PostList, { PostForPostList } from '@/components/PostList';
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
    pin: post.pin || false,
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

      <div className="flex justify-between items-center mt-12 md:my-12">
        <div className="prose w-3/5 space-y-2 transition-colors dark:prose-dark md:prose-lg md:space-y-5">
          <h1 className="text-left">{t('intro-title')}</h1>
          <p className='mr-1'>{t('intro-1')}</p>
          <p className='mr-1'>{t('intro-2')}</p>
          <p className='mr-1'>{t('intro-3')}</p>
        </div>

        <div className="w-2/5 md:w-1/4">
          <CustomImage src={selfImage} alt="Self Image" />
        </div>
      </div>

      <div className="my-4 divide-y divide-gray-200 transition-colors dark:divide-gray-700">
      <div className="prose prose-lg mt-8 flex items-baseline gap-4 dark:prose-dark">
        <h2>{t('latest-posts')}</h2>
        
        <div className="not-prose inline-flex items-center gap-1.5 text-base font-normal text-gray-500 dark:text-gray-400">
          <span>{t('press')}</span>
          <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-sans font-medium text-gray-800 bg-gray-100 border border-gray-200 rounded-md shadow-sm dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700/80">
            Ctrl + K
          </kbd>
          <span className="hidden sm:inline-flex text-gray-300 dark:text-zinc-700">/</span>
          <kbd className="inline-flex items-center justify-center px-1.5 py-1 text-xs font-sans font-medium text-gray-800 bg-gray-100 border border-gray-200 rounded-md shadow-sm dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700/80">
            <CommandSvg />
          </kbd>
          <span>{t('to-search')}</span>
        </div>
      </div>

      <PostList posts={posts} />
    </div>
    </LayoutPerPage>
  );
};

export default Home;