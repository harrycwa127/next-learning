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

type Props = {
  commandPalettePosts: PostForCommandPalette[];
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const locale = context.locale!;
  const commandPalettePosts = getCommandPalettePosts();

  generateRSS();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['indexPage', 'common'])),
      commandPalettePosts,
    },
  };
};

const Playground: NextPage<Props> = ({ commandPalettePosts }) => {
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
        <div className="prose mt-12 w-3/5 space-y-2 transition-colors dark:prose-dark md:prose-lg md:my-12 md:space-y-5 shrink-0 whitespace-nowrap">
            <h2>On progress List</h2>
            <ul>
                <li>Post Language</li>
                <li>Post Tag for Display and Search - Done</li>
                <li>Pin Post</li>
                <li>Simple Record store with database</li>
                <ul>
                    <li>e.g. Climbing Tracker Lite with Vercel KV</li>
                </ul>
                <li>AI chat (maybe)</li>
            </ul>
        </div>
        <div className="mt-12 w-2/5 items-center md:w-1/4">
            <CustomImage src={playgroundImage} alt="Self Image" />
        </div>
      
    </LayoutPerPage>
  );
};

export default Playground;
