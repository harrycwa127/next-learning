import { Feed } from 'feed';
import { writeFileSync } from 'fs';
import { neon } from '@neondatabase/serverless';
import { compareDesc } from 'date-fns';

import { siteConfigs } from '@/configs/siteConfigs';
import { allPostsNewToOld } from '@/lib/contentLayerAdapter';
import { getPostOGImage } from '@/lib/getPostOGImage';

interface UnifiedRssPost {
  title: string;
  description: string;
  path: string;
  date: Date;
  socialImage: string | null;
}

export default async function generateRSS() {
  const author = {
    name: siteConfigs.author,
    email: siteConfigs.email,
    link: siteConfigs.fqdn,
  };

  const feed = new Feed({
    title: siteConfigs.title,
    description: siteConfigs.description,
    id: siteConfigs.fqdn,
    link: siteConfigs.fqdn,
    image: siteConfigs.logoUrl,
    favicon: siteConfigs.logoUrl,
    copyright: `Copyright © 2015 - ${new Date().getFullYear()} ${
      siteConfigs.credit
    }`,
    feedLinks: {
      rss2: `${siteConfigs.fqdn}/feed.xml`,
      json: `${siteConfigs.fqdn}/feed.json`,
      atom: `${siteConfigs.fqdn}/atom.xml`,
    },
    author: author,
  });

  const staticPosts: UnifiedRssPost[] = allPostsNewToOld.map((post) => ({
    title: post.title,
    description: post.description,
    path: post.path,
    date: new Date(post.date),
    socialImage: post.socialImage || null,
  }));

  let dbPosts: UnifiedRssPost[] = [];
  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const dbResult = await sql`
        SELECT pb_slug, pb_title, pb_desc, 
               TO_CHAR(pb_date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as pb_date
        FROM pb_blog_post
        ORDER BY pb_date DESC
      `;

      if (dbResult && dbResult.length > 0) {
        dbPosts = dbResult.map((row) => ({
          title: String(row.pb_title || ''),
          description: String(row.pb_desc || ''),
          path: `/posts/${row.pb_slug}`,
          date: new Date(row.pb_date),
          socialImage: null,
        }));
      }
    } catch (e) {
      console.error('Failed to fetch DB posts for RSS generation:', e);
    }
  }

  const combinedPosts = [...staticPosts, ...dbPosts].sort((a, b) =>
    compareDesc(a.date, b.date)
  );

  combinedPosts.forEach((post) => {
    feed.addItem({
      id: siteConfigs.fqdn + post.path,
      title: post.title,
      link: siteConfigs.fqdn + post.path,
      description: post.description,
      image: getPostOGImage(post.socialImage),
      author: [author],
      contributor: [author],
      date: post.date,
    });
  });

  writeFileSync('./public/feed.xml', feed.rss2());
  writeFileSync('./public/atom.xml', feed.atom1());
  writeFileSync('./public/feed.json', feed.json1());
}