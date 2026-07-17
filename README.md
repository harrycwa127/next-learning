# About This Project

This project is reference to the [Modern Next.js Blog 系列](https://ithelp.ithome.com.tw/users/20130695/ironman/5397) and incorporates my ideas for learning Next.js. Implementing modern frontend tech stack like Next.js, Tailwind CSS, Contentlayer, i18Next.

## Demo

[https://harry-blog-next.vercel.app](https://harry-blog-next.vercel.app)

## Features

- Writing with local Markdown / MDX files
- Blazing fast performance
- SEO friendly
- Dark Mode
- Command Palette
- Comment system
- Page transition progress bar
- RSS Feed
- Sitemap
- Code syntax highlighting
- Post Tag (Search & Filter by Tag, Tag Managed in NEON DB)
- Pin Post
- AI Chat (Gemini API 3.5 Flash / 2.5 Pro)

## Tech Stack

- [Next.js](https://nextjs.org/): React meta framework
- [Contentlayer](https://github.com/contentlayerdev/contentlayer): MDX processor
- [Tailwind CSS](https://tailwindcss.com/): CSS framework
- [next-i18next](https://github.com/i18next/next-i18next): localization
- [next-seo](https://github.com/garmeeh/next-seo#news-article): SEO meta tags
- [kbar](https://github.com/timc1/kbar): command palette
- [giscus](https://github.com/giscus/giscus): comment system
- [nprogress](https://github.com/rstacruz/nprogress): page transition progress bar
- TypeScript
- Eslint, Prettier

## SEO OG-image

![og-image](/public/og-image.png)

![seo og-image](/public/images/seo-display.png)

## Prepare

install denpancy:

```bash
pnpm install
```

## Getting Started

Start local server for development:

```bash
pnpm dev
```

## Enviroment Variable (.env.local)

- Gemini API Key:
GEMINI_API_KEY

- Info for connect db (can get in vercel):
DATABASE_URL

DATABASE_URL_UNPOOLED

PGHOST
PGHOST_UNPOOLED
PGUSER
PGDATABASE
PGPASSWORD

POSTGRES_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
POSTGRES_URL_NO_SSL
POSTGRES_PRISMA_URL
