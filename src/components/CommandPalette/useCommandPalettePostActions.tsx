import { useRegisterActions } from 'kbar';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { PostForCommandPalette } from './getCommandPalettePosts';

export const useCommandPalettePostActions = (
  posts: PostForCommandPalette[]
): void => {
  const router = useRouter();
  const { i18n, t } = useTranslation(['common']);

  useRegisterActions(
    posts.map((post) => ({
      id: post.slug,
      name: post.title,
      keywords: 'post posts' + (post.tag ? ' ' + post.tag + ' ' + i18n.languages.map(lng => i18n.t(post.tag!, { lng })).join(' ') : ''),
      perform: () => router.push(post.path),
      section: t('search-posts'),
      parent: 'search-posts',
      data: {
        tag: post.tag || null, 
      },
    })),
    []
  );
};
