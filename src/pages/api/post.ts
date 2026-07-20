import { neon } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PostForPostPage } from '@/pages/posts/[slug]';

interface ErrorResponse {
  error: string;
}

export default async function GET(req: NextApiRequest, res: NextApiResponse<PostForPostPage[] | ErrorResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured' });
  }

  const { slug } = req.query;

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const data = await sql`
      SELECT 
        p.pb_slug,
        p.pb_title,
        p.pb_desc,
        TO_CHAR(p.pb_date, 'YYYY-MM-DD') as pb_date,
        TO_CHAR(p.pb_update_date, 'YYYY-MM-DD') as pb_update_date,
        p.pb_is_pin,
        p.pb_tag_id,
        p.pb_content
      FROM pb_blog_post p
      WHERE p.pb_slug = ${slug}
    `;

    const posts: PostForPostPage[] = (data as any[]).map((row: any) => ({
      title: row.pb_title.toString(),
      date: row.pb_date.toString(),
      updateDate: row.pb_update_date? row.pb_update_date.toString() : null,
      tag: row.pb_tag_id ? row.pb_tag_id.toString() : null,
      pin: row.pb_is_pin ? Boolean(row.pb_is_pin) : false,
      description: row.pb_desc.toString(),
      path: `/post?slug=${row.pb_slug.toString()}`,
      socialImage: null,
      body: { code: '', raw: row.pb_content.toString() },
    }));

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Failed to fetch tags from database' });
  }
}