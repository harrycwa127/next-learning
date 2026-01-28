import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import { defineDatabase, makeSource } from 'contentlayer-source-notion';
import { NotionRenderer } from '@notion-render/client';
import { Client } from '@notionhq/client';

import imageMetadata from './src/plugins/imageMetadata';

const Post = defineDatabase(() => ({
  name: 'Post',
  databaseId: process.env.NOTION_BLOG_DATABASE_ID || '',
  properties: [
    { name: 'title', isRequired: true },
    { name: 'description', isRequired: true },
    { name: 'slug', isRequired: true },
    { name: 'date', isRequired: true },
    { name: 'updateDate' },
    { name: 'socialImage' },
    { name: 'redirectFrom' },
  ],
}));

const notionClient = new Client({ auth: process.env.NOTION_TOKEN });
const renderer = new NotionRenderer({ client: notionClient });

export default makeSource({
  databaseTypes: [Post],
  client: notionClient,
  renderer,
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      [rehypePrism, { ignoreMissing: true }],
      imageMetadata,
    ],
  },
});