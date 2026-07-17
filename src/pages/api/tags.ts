import { neon } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Tag } from '@/components/TagDisplay';

interface ErrorResponse {
  error: string;
}

export default async function GET(req: NextApiRequest, res: NextApiResponse<Tag[] | ErrorResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const data = await sql`
      SELECT 
        pb_tag_id,
        pb_tag_eng_name,
        pb_tag_chi_name
      FROM pb_tag
    `;

    const tags: Tag[] = (data as any[]).map((row: any) => ({
      value: row.pb_tag_id.toString(),
      eng_name: row.pb_tag_eng_name.toString(),
      chi_name: row.pb_tag_chi_name.toString()
    }));

    return res.status(200).json(tags);
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Failed to fetch tags from database' });
  }
}