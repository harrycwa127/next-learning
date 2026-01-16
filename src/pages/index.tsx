import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { ArticleJsonLd } from 'next-seo';

import PostList, { PostForPostList } from '@/components/PostList';
import { siteConfigs } from '@/configs/siteConfigs';
import { allPostsNewToOld } from '@/lib/contentLayerAdapter';
import generateRSS from '@/lib/generateRSS';

type PostForIndexPage = PostForPostList;

type Props = {
  posts: PostForIndexPage[];
};

export const getStaticProps: GetStaticProps<Props> = () => {
  const posts = allPostsNewToOld.map((post) => ({
    slug: post.slug,
    date: post.date,
    title: post.title,
    description: post.description,
    path: post.path,
  })) as PostForIndexPage[];

  generateRSS();
  
  return { props: { posts } };
};

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <ArticleJsonLd
        type="Blog"
        url={siteConfigs.fqdn}
        title={siteConfigs.title}
        images={[siteConfigs.bannerUrl]}
        datePublished={siteConfigs.datePublished}
        authorName={siteConfigs.author}
        description={siteConfigs.description}
      />

      <div className="prose my-12 space-y-2 transition-colors dark:prose-dark md:prose-lg md:space-y-5">
        <h1 className="text-center sm:text-left">Hello! This is Harry✌️</h1>
        <p>我係 Harry，一個成日想自閉但係熟左好多野講嘅人</p>
        <p>好鍾意運動同猫🐱</p>
        <p>攀石🧗 跆拳🥋 揼code👨‍💻</p>
      </div>

      <div className="my-4 divide-y divide-gray-200 transition-colors dark:divide-gray-700">
        <div className="prose prose-lg my-8 dark:prose-dark">
          <h2>最新文章</h2>
        </div>

        <PostList posts={posts} />
      </div>
    </>
  );
};

export default Home;
