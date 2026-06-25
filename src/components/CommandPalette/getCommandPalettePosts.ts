import { allPostsNewToOld } from '@/lib/contentLayerAdapter';

export type PostForCommandPalette = {
  slug: string;
  tag: string | null;
  title: string;
  path: string;
};

export const getCommandPalettePosts = (): PostForCommandPalette[] => {
  const commandPalettePosts = allPostsNewToOld.map((post) => ({
    slug: post.slug,
    tag: post.tag || null,
    title: post.title,
    path: post.path,
  }));
  return commandPalettePosts;
};
