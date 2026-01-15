import { defineDocumentType } from "contentlayer/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/*.md",
  contentType: "mdx",
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    slug: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'date',
      required: true,
    }
  },
  computedFields: {
    path: {
      type: 'string',
      resolve: (post) => `/posts/${post.slug}`,
    },
  },
}));