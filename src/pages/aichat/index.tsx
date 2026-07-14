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
        <div className="mt-12 w-full items-center">
            <AIChatCompent />
        </div>
    </LayoutPerPage>
  );
};

export default AIChat;
