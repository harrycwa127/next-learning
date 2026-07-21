import { allPosts as originalAllPosts, Post } from 'contentlayer/generated';
import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files';
import { compareDesc } from 'date-fns';

const allPosts = originalAllPosts?.filter((post) => post.isShown == true);

export { allPosts, defineDocumentType, defineNestedType, makeSource, Post };

export const allPostsNewToOld =
  allPosts?.filter((post) => post.isShown == true)?.sort((a, b) => {
    if (a.pin && !b.pin) return -1;
    if (!a.pin && b.pin) return 1;

    return compareDesc(new Date(a.date), new Date(b.date));
  }) || [];
