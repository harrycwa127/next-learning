import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';

import {
  getCommandPalettePosts,
  PostForCommandPalette,
} from '@/components/CommandPalette/getCommandPalettePosts';
import { useCommandPalettePostActions } from '@/components/CommandPalette/useCommandPalettePostActions';
import LayoutPerPage from '@/components/LayoutPerPage';
import PostLayout, {
  PostForPostLayout,
  RelatedPostForPostLayout,
} from '@/components/PostLayout';
import { LOCALES } from '@/configs/i18nConfigs';
import { siteConfigs } from '@/configs/siteConfigs';
import { allPosts, allPostsNewToOld } from '@/lib/contentLayerAdapter';
import { allRedirects } from '@/lib/getAllRedirects';
import { getPostOGImage } from '@/lib/getPostOGImage';
import mdxComponents from '@/lib/mdxComponents';
import { unifyPath } from '@/lib/unifyPath';
import { useEffect, useState } from 'react';
import { Tag } from '@/components/TagDisplay';

interface Params extends ParsedUrlQuery {
  slug: string;
}

type PostForPostPage = PostForPostLayout & {
  title: string;
  description: string;
  date: string;
  updateDate: string | null;
  tag: string | null;
  path: string;
  socialImage: string | null;
  body: {
    code: string;
  };
};

type Props = {
  post: PostForPostPage;
  prevPost: RelatedPostForPostLayout;
  nextPost: RelatedPostForPostLayout;
  commandPalettePosts: PostForCommandPalette[];
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths: string[] = [];
  LOCALES.forEach((locale) => {
    paths.push(...allPosts.map((post) => `/${locale}${post.path}`));
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { slug } = context.params!;
  const locale = context.locale!;

  // Handle redirect logic
  const path = unifyPath('/posts/' + slug);
  const matchedRedirectRule = allRedirects.find((rule) => rule.source === path);
  if (matchedRedirectRule) {
    return {
      redirect: {
        destination: matchedRedirectRule.destination,
        permanent: matchedRedirectRule.permanent,
      },
    };
  }

  const commandPalettePosts = getCommandPalettePosts();
  const postIndex = allPostsNewToOld.findIndex((post) => post.slug === slug);
  if (postIndex === -1) {
    return {
      notFound: true,
    };
  }
  const prevFull = allPostsNewToOld[postIndex + 1] || null;
  const prevPost: RelatedPostForPostLayout = prevFull
    ? { title: prevFull.title, path: prevFull.path }
    : null;
  const nextFull = allPostsNewToOld[postIndex - 1] || null;
  const nextPost: RelatedPostForPostLayout = nextFull
    ? { title: nextFull.title, path: nextFull.path }
    : null;
  const postFull = allPostsNewToOld[postIndex];
  const post: PostForPostPage = {
    title: postFull.title,
    date: postFull.date,
    updateDate: postFull.updateDate || '',
    tag: postFull.tag || null,
    pin:  postFull.pin || false,
    description: postFull.description,
    path: postFull.path,
    socialImage: postFull.socialImage || null,
    body: {
      code: postFull.body.code,
      raw: postFull.body.raw,
    },
  };

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      post,
      prevPost,
      nextPost,
      commandPalettePosts,
    },
  };
};

const PostPage: NextPage<Props> = ({
  post,
  prevPost,
  nextPost,
  commandPalettePosts,
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) throw new Error('無法取得標籤資料');
        const data = await response.json();

        setAllTags(data.map((tag: any) => ({
          value: tag.pb_tag_id,
          eng_name: tag.pb_tag_eng_name,
          chi_name: tag.pb_tag_chi_name,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : '發生未知錯誤');
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  useCommandPalettePostActions({ posts: commandPalettePosts, tags: allTags });
  const {
    description,
    title,
    date,
    updateDate,
    path,
    socialImage,
    body: { code },
  } = post;
  const url = siteConfigs.fqdn + path;
  const ogImage = getPostOGImage(socialImage);

  const MDXContent = useMDXComponent(code);

  if (loading) return <div className="text-gray-500 text-sm animate-pulse">標籤載入中...</div>;
  if (error) return <div className="text-red-500 text-sm">錯誤: {error}</div>;
  if (allTags.length === 0) return <div className="text-gray-400 text-sm">暫無標籤</div>;

  return (
    <LayoutPerPage>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title: title,
          description: description,
          url: url,
          images: [
            {
              url: ogImage,
            },
          ],
          type: 'article',
          article: {
            publishedTime: date,
            modifiedTime: updateDate || date,
          },
        }}
      />

      <ArticleJsonLd
        url={url}
        title={title}
        images={[ogImage]}
        datePublished={date}
        dateModified={updateDate || date}
        authorName={siteConfigs.author}
        description={description}
      />

      <PostLayout post={post} prevPost={prevPost} nextPost={nextPost} tags={allTags}>
        <MDXContent components={mdxComponents} />
      </PostLayout>
    </LayoutPerPage>
  );
};

export default PostPage;
