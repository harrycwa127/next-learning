import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { neon } from '@neondatabase/serverless';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { getCommandPalettePosts } from '@/components/CommandPalette/getCommandPalettePosts';
import { useCommandPalettePostActions } from '@/components/CommandPalette/useCommandPalettePostActions';
import LayoutPerPage from '@/components/LayoutPerPage';
import PostLayout, {
  PostForPostLayout,
  RelatedPostForPostLayout,
} from '@/components/PostLayout';
import { LOCALES } from '@/configs/i18nConfigs';
import { siteConfigs } from '@/configs/siteConfigs';
import { allPosts } from '@/lib/contentLayerAdapter';
import { allRedirects } from '@/lib/getAllRedirects';
import { getPostOGImage } from '@/lib/getPostOGImage';
import mdxComponents from '@/lib/mdxComponents';
import { unifyPath } from '@/lib/unifyPath';
import { useTags } from '@/contexts/TagsContext';
import { useTranslation } from 'next-i18next';
import { usePosts } from '@/contexts/PostsListContext';
import { useEffect, useState } from 'react';
import ErrorDialog from '@/components/dialog/ErrorDialog';
import LoadingSpinner from '@/components/dialog/LoadingSpinner';

interface Params extends ParsedUrlQuery {
  slug: string;
}

export type PostForPostPage = PostForPostLayout & {
  slug: string;
  title: string;
  description: string;
  date: string;
  updateDate: string | null;
  tag: string | null;
  path: string;
  socialImage: string | null;
  body: {
    code: string;
    raw: string;
    mdxSource: MDXRemoteSerializeResult | null;
  };
};

type Props = {
  post: PostForPostPage;
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths: string[] = [];
  LOCALES.forEach((locale) => {
    paths.push(...allPosts.map((post) => `/${locale}${post.path}`));
  });
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { slug } = context.params!;
  const locale = context.locale!;

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

  let post: PostForPostPage | null = null;

  const localPostFull = allPosts.find((p) => p.slug === slug);

  if (localPostFull) {
    post = {
      slug: localPostFull.slug,
      title: localPostFull.title,
      date: localPostFull.date,
      updateDate: localPostFull.updateDate || '',
      tag: localPostFull.tag || null,
      pin: localPostFull.pin || false,
      description: localPostFull.description,
      path: localPostFull.path,
      socialImage: localPostFull.socialImage || null,
      body: {
        code: localPostFull.body.code,
        raw: localPostFull.body.raw,
        mdxSource: null,
      },
    };
  } else {
    if (process.env.DATABASE_URL) {
      try {
        const sql = neon(process.env.DATABASE_URL);
        const dbResult = await sql`
          SELECT pb_slug, pb_title, pb_desc, pb_is_pin, pb_tag_id, pb_content, 
                 TO_CHAR(pb_date, 'YYYY-MM-DD') as pb_date, 
                 TO_CHAR(pb_update_date, 'YYYY-MM-DD') as pb_update_date 
          FROM pb_blog_post
          WHERE pb_slug = ${slug} and pb_is_shown = true
          LIMIT 1
        `;

        if (dbResult && dbResult.length > 0) {
          const row = dbResult[0];
          const rawContent = row.pb_content ? row.pb_content.toString() : '';

          // 核心優化：在伺服器端直接將線上 Markdown/MDX 原始字串進行高效編譯
          const mdxSource = rawContent ? await serialize(rawContent) : null;

          post = {
            slug: row.pb_slug.toString(),
            title: row.pb_title.toString(),
            description: row.pb_desc.toString(),
            date:
              row.pb_date instanceof Date
                ? row.pb_date.toISOString()
                : String(row.pb_date),
            updateDate:
              row.pb_update_date instanceof Date
                ? row.pb_update_date.toISOString()
                : row.pb_update_date
                ? String(row.pb_update_date)
                : null,
            tag: row.pb_tag_id ? row.pb_tag_id.toString() : null,
            pin: row.pb_is_pin ? Boolean(row.pb_is_pin) : false,
            path: `/posts/${row.pb_slug.toString()}`,
            socialImage: null,
            body: {
              code: '',
              raw: rawContent,
              mdxSource,
            },
          };
        }
      } catch (e) {
        console.error('Failed to fetch single DB post in getStaticProps:', e);
      }
    }
  }

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      post,
    },
    revalidate: 300,
  };
};

const PostPage: NextPage<Props> = ({ post }) => {
  const { allTags, tagLoading, tagError } = useTags();
  const { dbPostsList, postLoading, postError } = usePosts();
  const { t } = useTranslation(['common']);

  const [mounted, setMounted] = useState(false);
  const [prevPost, setPrevPost] = useState<RelatedPostForPostLayout>(null);
  const [nextPost, setNextPost] = useState<RelatedPostForPostLayout>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const commandPalettePosts = getCommandPalettePosts(dbPostsList);
  useCommandPalettePostActions({ posts: commandPalettePosts, tags: allTags });

  useEffect(() => {
    if (tagError || postError) {
      setShowErrorDialog(true);
    }
  }, [tagError, postError]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (dbPostsList && dbPostsList.length > 0 && post.slug) {
      const postIndex = dbPostsList.findIndex((p) => p.slug === post.slug);
      if (postIndex !== -1) {
        const prevFull = dbPostsList[postIndex + 1] || null;
        setPrevPost(
          prevFull ? { title: prevFull.title, path: prevFull.path } : null
        );

        const nextFull = dbPostsList[postIndex - 1] || null;
        setNextPost(
          nextFull ? { title: nextFull.title, path: nextFull.path } : null
        );
      }
    }
  }, [dbPostsList, post.slug]);

  const {
    description,
    title,
    date,
    updateDate,
    path,
    socialImage,
    body: { code, raw, mdxSource },
  } = post;

  const url = siteConfigs.fqdn + path;
  const ogImage = getPostOGImage(socialImage);

  const MDXContent = code ? useMDXComponent(code) : null;

  if (tagLoading || postLoading){
    return (
      <LoadingSpinner label={t('loading') || 'Loading...'} />
    );
  }

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
          images: [{ url: ogImage }],
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

      {mounted ? (
        <>
          <PostLayout
            post={post}
            prevPost={prevPost}
            nextPost={nextPost}
            tags={allTags}
          >
            {code && MDXContent ? (
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <MDXContent components={mdxComponents} />
              </div>
            ) : mdxSource ? (
              <div className="prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300">
                <MDXRemote {...mdxSource} components={mdxComponents} />
              </div>
            ) : (
              <article className="prose max-w-none whitespace-pre-wrap dark:prose-invert">
                {raw}
              </article>
            )}
          </PostLayout>
          <ErrorDialog
            isOpen={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
            errors={[
              { name: 'Tags', message: tagError },
              { name: 'Posts', message: postError },
            ]}
          />
        </>
      ) : (
        <LoadingSpinner label={t('loading') || 'Loading...'} />
      )}
    </LayoutPerPage>
  );
};

export default PostPage;
