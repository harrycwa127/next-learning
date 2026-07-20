import { PostForPostList } from '@/components/PostList';

export type PostForCommandPalette = {
  slug: string;
  tag: string | null;
  title: string;
  path: string;
};

export const getCommandPalettePosts = (posts: PostForPostList[]): PostForCommandPalette[] => {
  const commandPalettePosts = posts.map((post) => ({
    slug: post.slug,
    tag: post.tag || null,
    title: post.title,
    path: post.path,
  }));
  return commandPalettePosts;
};
