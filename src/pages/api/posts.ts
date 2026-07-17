import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

// get all posts from db for post List
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured' }, { status: 500 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const posts = await sql`
      SELECT 
        p.pb_id,
        p.pb_title,
        p.pb_desc,
        p.pb_slug,
        p.pb_date,
        p.pb_update_date,
        p.pb_tag_id,
      FROM pb_blog_post p
      ORDER BY p.pb_date DESC;
    `;

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts from database' }, { status: 500 });
  }
}