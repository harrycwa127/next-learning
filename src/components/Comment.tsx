import Giscus from '@giscus/react';
import { useRouter } from 'next/dist/client/router';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import { giscusConfigs } from '@/configs/giscusConfigs';

const Comment = () => {
  const { resolvedTheme } = useTheme();
  const { locale } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const giscusTheme = resolvedTheme === 'dark' ? 'transparent_dark' : 'light';

  return (
    <div id="comment" className="mx-auto max-w-prose py-6">
      {mounted && (
        <Giscus
          repo={giscusConfigs.repo}
          repoId={giscusConfigs.repoId}
          category={giscusConfigs.category}
          categoryId={giscusConfigs.categoryId}
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={giscusTheme}
          loading="lazy"
          lang={locale}
        />
      )}
    </div>
  );
};

export default Comment;