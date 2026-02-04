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

      <div className="flex justify-between">
        <div className="prose mt-12 w-3/5 space-y-2 transition-colors dark:prose-dark md:prose-lg md:my-12 md:space-y-5">
          <h1 className="text-left">{t('intro-title')}</h1>
          <p>{t('intro-1')}</p>
          <p>{t('intro-2')}</p>
          <p>{t('intro-3')}</p>
        </div>

        <div className="mt-12 w-2/5 items-center md:w-1/4">
          <CustomImage src={selfImage} alt="Self Image" />
        </div>
      </div>

      <div className="my-4 divide-y divide-gray-200 transition-colors dark:divide-gray-700">
        <div className="prose prose-lg mt-8 flex gap-4 dark:prose-dark">
          <h2>{t('latest-posts')} </h2>
          <div className="mt-3 inline-block align-middle text-base font-normal leading-7">
            {t('press')} <code>Ctrl + K</code>
            {' / '}
            <div className="mb-1 inline-block align-middle">
              <CommandSvg />
            </div>{' '}
            {t('to-search')}
          </div>
        </div>

        <PostList posts={posts} />
      </div>
    </LayoutPerPage>
  );
};

export default Home;
