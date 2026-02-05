import { useRouter } from 'next/router';

import CustomLink from '@/components/CustomLink';
import formatDate from '@/lib/formatDate';
import { CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export interface PostForPostList {
  slug: string;
  date: string;
  updateDate: string | null;
  title: string;
  description: string;
  path: string;
}

type Props = {
  posts: PostForPostList[];
};

export default function PostList({ posts = [] }: Props) {
  const { locale } = useRouter();

  return (
    <ul className="divide-y divide-gray-200 transition-colors dark:divide-gray-700">
      {!posts.length && 'No posts found.'}
      {posts.map((post) => {
        const { slug, date, updateDate, title, description, path } = post;
        return (
          <li key={slug} className="group transition-colors">
            <CustomLink href={path}>
              <article className="space-y-2 rounded-xl p-4 transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-800 xl:grid xl:grid-cols-4  xl:items-baseline xl:space-y-0">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-sm font-medium leading-6 text-gray-500 transition-colors dark:text-gray-400 md:text-base flex md:block">
                    <time dateTime={date} className='flex flex-row items-center'><CalendarIcon className='h-5 w-5 mr-1 text-blue-500' />{formatDate(date, locale)}</time>
                    {updateDate && <time dateTime={updateDate} className='flex flex-row items-center'><ArrowPathIcon className='h-5 w-5 mr-1 ml-3 md:ml-0 text-red-500' /> {formatDate(updateDate, locale)}</time>}
                  </dd>
                </dl>
                <div className="space-y-3 xl:col-span-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-gray-900 transition-colors dark:text-gray-100 sm:text-xl md:text-2xl">
                      {title}
                    </h3>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-500 transition-colors dark:text-gray-400 md:prose-base">
                    {description}
                  </div>
                </div>
              </article>
            </CustomLink>
          </li>
        );
      })}
    </ul>
  );
}
