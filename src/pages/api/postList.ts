import type { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';
import { compareDesc } from 'date-fns';
import { allPosts } from '@/lib/contentLayerAdapter';
import { PostForPostList } from '@/components/PostList';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostForPostList[] | { error: string }>
) {
  try {
    const staticPosts: PostForPostList[] = allPosts.map((post) => ({
      slug: post.slug,
      date: post.date,
      updateDate: post.updateDate || null,
      tag: post.tag || null,
      pin: post.pin || false,
      title: post.title,
      description: post.description,
      path: post.path,
    }));

    let dbPosts: PostForPostList[] = [];
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      const dbResult = await sql`
        SELECT pb_slug, pb_title, pb_desc, pb_is_pin, pb_tag_id,
               TO_CHAR(pb_date, 'YYYY-MM-DD') as pb_date, 
               TO_CHAR(pb_update_date, 'YYYY-MM-DD') as pb_update_date 
        FROM pb_blog_post
        ORDER BY pb_date DESC
      `;

      dbPosts = dbResult.map((row) => ({
        slug: String(row.pb_slug),
        title: String(row.pb_title),
        description: String(row.pb_desc),
        date: String(row.pb_date),
        updateDate: row.pb_update_date ? String(row.pb_update_date) : null,
        tag: row.pb_tag_id ? String(row.pb_tag_id) : null,
        pin: Boolean(row.pb_is_pin),
        path: `/posts/${row.pb_slug}`,
      }));
    }

    const combinedPosts = [...dbPosts, ...staticPosts].sort((a, b) => {
      if (a.pin && !b.pin) return -1;
      if (!a.pin && b.pin) return 1;
      return compareDesc(new Date(a.date), new Date(b.date));
    });

    return res.status(200).json(combinedPosts);
  } catch (error) {
    console.error('API postsList error:', error);
    return res.status(500).json({ error: '無法取得文章資料' });
  }
}