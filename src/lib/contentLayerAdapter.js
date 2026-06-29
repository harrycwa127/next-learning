import { allPosts, Post } from 'contentlayer/generated';
import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files';
import { compareDesc } from 'date-fns';

export { allPosts, defineDocumentType, defineNestedType, makeSource, Post };

export const allPostsNewToOld =
  allPosts?.sort((a, b) => {
    if (a.pin && !b.pin) return -1;
    if (!a.pin && b.pin) return 1;

    return compareDesc(new Date(a.date), new Date(b.date));
  }) || [];
