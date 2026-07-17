import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ArticleJsonLd } from 'next-seo';

import {
  getCommandPalettePosts,
  PostForCommandPalette,
} from '@/components/CommandPalette/getCommandPalettePosts';
import { useCommandPalettePostActions } from '@/components/CommandPalette/useCommandPalettePostActions';
import LayoutPerPage from '@/components/LayoutPerPage';
import { siteConfigs } from '@/configs/siteConfigs';
import generateRSS from '@/lib/generateRSS';

import AIChatCompent from '@/components/AIChat/AIChatCompent';
import { useTags } from '@/contexts/TagsContext';
import { useTranslation } from 'next-i18next';

type Props = {
  commandPalettePosts: PostForCommandPalette[];
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const locale = context.locale!;
  const commandPalettePosts = getCommandPalettePosts();

  generateRSS();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'aichat'])),
      commandPalettePosts,
    },
  };
};

const AIChat: NextPage<Props> = ({ commandPalettePosts }) => {
  const { allTags, tagLoading, tagError } = useTags();
  const { t } = useTranslation(['common']);

  useCommandPalettePostActions({ posts: commandPalettePosts, tags: allTags });
  if (tagLoading) return <div className="text-gray-500 text-sm animate-pulse">{t('loading')}</div>;
  if (tagError) return <div className="text-red-500 text-sm">{t('error')}: {tagError}</div>;
  if (allTags.length === 0) return <div className="text-gray-400 text-sm">{t('no-tags')}</div>;
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
    </LayoutPerPage>
  );
};

export default AIChat;
