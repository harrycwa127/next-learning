import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import { defineDatabase, makeSource } from 'contentlayer-source-notion'

// import { defineDocumentType, makeSource } from './src/lib/contentLayerAdapter';
import imageMetadata from './src/plugins/imageMetadata';

// export const Post = defineDocumentType(() => ({
//   name: 'Post',
//   filePathPattern: `content/posts/**/*.mdx`,
//   contentType: 'mdx',
//   fields: {
//     title: {
//       type: 'string',
//       required: true,
//     },
//     description: {
//       type: 'string',
//       required: true,
//     },
//     slug: {
//       type: 'string',
//       required: true,
//     },
//     date: {
//       type: 'date',
//       required: true,
//     },
//     updateDate: {
//       type: 'date',
//     },
//     socialImage: {
//       type: 'string',
//     },
//     redirectFrom: {
//       type: 'list',
//       of: { type: 'string' },
//     },
//   },
//   computedFields: {
//     path: {
//       type: 'string',
//       resolve: (post) => `/posts/${post.slug}`,
//     },
//   },
// }));

const Post = defineDatabase(() => ({
  name: 'Post',
  databaseId: '2f5cf6e3-00b7-8073-a3fe-000b0ecbf9e4',
  query: {
    filter: {
      property: 'Status',
      status: {
        equals: 'Published',
      },
    },
    sort: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  },
}))

export default makeSource({
  // contentDirPath: 'content',
  // documentTypes: [Post],
  databaseTypes: [Post],
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      [rehypePrism, { ignoreMissing: true }],
      imageMetadata,
    ],
  },
});
