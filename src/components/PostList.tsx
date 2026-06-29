import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import CustomLink from '@/components/CustomLink';
import formatDate from '@/lib/formatDate';
import { CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Pin } from 'lucide-react';
import Tag from '@/components/Tag';

export interface PostForPostList {
  slug: string;
  date: string;
  updateDate: string | null;
  tag: string | null;
  pin: boolean | null;
  title: string;
  description: string;
  path: string;
}

type Props = {
  posts: PostForPostList[];
};

export default function PostList({ posts = [] }: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation(['common']);

  return (
    <ul className="divide-y divide-gray-200 transition-colors dark:divide-gray-700">
      {!posts.length && 'No posts found.'}
      {posts.map((post) => {
        const { slug, date, updateDate, tag, pin, title, description, path } = post;
        return (
          <li key={slug} className="group transition-colors">
            <CustomLink href={path}>
              <article className="space-y-2 rounded-xl p-4 -mx-4 transition-all group-hover:bg-gray-100/70 dark:group-hover:bg-gray-800/50 xl:grid xl:grid-cols-4 xl:items-center xl:space-y-0">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-sm font-medium leading-6 text-gray-500 transition-colors dark:text-gray-400 md:text-base flex flex-wrap gap-x-4 gap-y-1 md:block md:space-y-1">
                    <time dateTime={date} className="flex flex-row items-center text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-1.5 text-blue-500 shrink-0" />
                      {formatDate(date, locale)}
                    </time>
                    {updateDate && <time dateTime={updateDate} className='flex flex-row items-center'><ArrowPathIcon className='h-5 w-5 mr-1 ml-3 md:ml-0 text-red-500' /> {formatDate(updateDate, locale)}</time>}
                  </dd>
                </dl>

                <div className="space-y-2 xl:col-span-3 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {pin && (
                      <Pin 
                        size={15} 
                        strokeWidth={1.8} 
                        className="text-amber-500 dark:text-amber-400/90 shrink-0 rotate-45 transform" 
                      />
                    )}

                    {tag && <Tag small>{t(tag)}</Tag>}
                    
                    <h3 className="text-lg font-bold tracking-tight text-gray-900 transition-colors dark:text-gray-100 sm:text-xl md:text-2xl truncate group-hover:text-primary-500 dark:group-hover:text-primary-400">
                      {title}
                    </h3>
                  </div>
                
                  <div className="prose prose-sm max-w-none text-gray-500 transition-colors dark:text-gray-400 md:prose-base line-clamp-2 leading-relaxed">
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