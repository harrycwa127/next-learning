import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ArticleJsonLd } from 'next-seo';

import { getCommandPalettePosts } from '@/components/CommandPalette/getCommandPalettePosts';
import { useCommandPalettePostActions } from '@/components/CommandPalette/useCommandPalettePostActions';
import LayoutPerPage from '@/components/LayoutPerPage';
import { siteConfigs } from '@/configs/siteConfigs';

import AIChatCompent from '@/components/AIChat/AIChatCompent';
import { useTags } from '@/contexts/TagsContext';
import { useTranslation } from 'next-i18next';
import { usePosts } from '@/contexts/PostsListContext';
import { useEffect, useState } from 'react';
import ErrorDialog from '@/components/dialog/ErrorDialog';
import LoadingSpinner from '@/components/dialog/LoadingSpinner';

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale!;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'aichat'])),
    },
  };
};

const AIChat: NextPage = () => {
  const { allTags, tagLoading, tagError } = useTags();
  const { dbPostsList, postLoading, postError } = usePosts();
  const { t } = useTranslation(['common']);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const commandPalettePosts = getCommandPalettePosts(dbPostsList);
  useCommandPalettePostActions({ posts: commandPalettePosts, tags: allTags });

  useEffect(() => {
    if (tagError || postError) {
      setShowErrorDialog(true);
    }
  }, [tagError, postError]);

  if (tagLoading || postLoading){
    return <LoadingSpinner label={t('loading') || 'Loading...'} />;
  }

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
      <div className="mt-12 w-full items-center">
        <AIChatCompent />
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

export default AIChat;
