import Link from 'next/link';

import ExternalLinkIcon from './external-link.svg';

type Props = React.ComponentPropsWithoutRef<'a'>;

const CustomLink = ({ href, children, ...rest }: Props) => {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  if (isAnchorLink) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a 
      target="_blank" 
      rel="noopener noreferrer" 
      href={href} 
      {...rest} 
      /* 💡 將 inline-flex items-center 改為 inline */
      className='break-all inline text-blue-600 hover:underline'
    >
      {children}
      {typeof children === 'string' && (
        /* 💡 加上 align-middle 與 shrink-0，確保圖示與文字完美緊貼且置中 */
        <ExternalLinkIcon className="ml-1 inline-block h-4 w-4 align-middle shrink-0" />
      )}
    </a>
  );
};

export default CustomLink;
