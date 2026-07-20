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
import CustomImage from '@/components/CustomImage';
import LayoutPerPage from '@/components/LayoutPerPage';
import { siteConfigs } from '@/configs/siteConfigs';
import generateRSS from '@/lib/generateRSS';

import playgroundImage from '../../../public/images/playground-image.png';
import { useTags } from '@/contexts/TagsContext';
import { usePosts } from '@/contexts/PostsListContext';
import { useEffect, useState } from 'react';
import ErrorDialog from '@/components/dialog/ErrorDialog';
import LoadingSpinner from '@/components/dialog/LoadingSpinner';

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale!;

  generateRSS();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

const Playground: NextPage = () => {
  const { allTags, tagLoading, tagError } = useTags();
  const { dbPostsList, postLoading, postError } = usePosts();
  const { t } = useTranslation(['common']);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    if (tagError || postError) {
      setShowErrorDialog(true);
    }
  }, [tagError, postError]);

  const commandPalettePosts = getCommandPalettePosts(dbPostsList);
  useCommandPalettePostActions({ posts: commandPalettePosts, tags: allTags });

  if (tagLoading || postLoading)
    return <LoadingSpinner label={t('loading') || 'Loading...'} />;

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
      <div className="prose mt-12 w-3/5 shrink-0 space-y-2 whitespace-nowrap transition-colors dark:prose-dark md:prose-lg md:my-12 md:space-y-5">
        <h2>On progress List</h2>
        <ul>
          <li>Post Language</li>
          <li>Post Tag for Display and Search - Done</li>
          <li>Post List filted by Tag - Done</li>
          <li>Pin Post - Done</li>
          <li>Simple Record store with database - Done</li>
          <ul>
            <li>Store and Manage Post Tag - Done</li>
            <li>
              Store and Manage Post (server store markdown - next-mdx-remote -
              MDXRemote with same mdxComponents) - Done
            </li>
          </ul>
          <li>AI chat - Done</li>
        </ul>
      </div>
      <div className="mt-12 w-2/5 items-center md:w-1/4">
        <CustomImage src={playgroundImage} alt="Self Image" />
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

export default Playground;
