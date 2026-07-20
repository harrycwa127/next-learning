import { useRegisterActions } from 'kbar';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { Tag } from '@/components/TagDisplay';

import { PostForCommandPalette } from './getCommandPalettePosts';

type Props = {
  posts: PostForCommandPalette[];
  tags: Tag[];
};

export const useCommandPalettePostActions = (
  { posts = [], tags = [] }: Props
): void => {
  const router = useRouter();
  const { t } = useTranslation(['common']);

  const actions = useMemo(() => {
    if (!posts || posts.length === 0) {
      return [];
    }
    
    return posts.map((post) => {
      const tag = tags.find((tag) => tag.value === post.tag);
      const tagKeywords = tag 
        ? ` ${tag.eng_name} ${tag.chi_name}` 
        : '';

      return {
        id: post.slug,
        name: post.title,
        keywords: 'post posts' + tagKeywords,
        perform: () => router.push(post.path),
        section: t('search-posts'),
        parent: 'search-posts',
        data: {
          tag: tag ? (router.locale === 'zh-TW' ? tag.chi_name : tag.eng_name) : null, 
        },
      };
    });
  }, [posts, tags, router.locale, router.push, t]);

  useRegisterActions(actions, [actions]);
};