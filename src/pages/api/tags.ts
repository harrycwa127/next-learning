import { neon } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const tags = await sql`
      SELECT 
        pb_tag_id,
        pb_tag_eng_name,
        pb_tag_chi_name
      FROM pb_tag
    `;

    return res.status(200).json(tags);
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Failed to fetch tags from database' });
  }
}