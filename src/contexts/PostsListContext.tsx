'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PostForPostList } from '@/components/PostList';

// 1. 定義 Context 共享狀態的介面
interface PostsListContextType {
  dbPostsList: PostForPostList[];
  postLoading: boolean;
  postError: string | null;
  refreshPosts: () => Promise<void>;
}

const PostsListContext = createContext<PostsListContextType | undefined>(undefined);

export function PostsListProvider({ children }: { children: ReactNode }) {
  const [dbPostsList, setDbPostsList] = useState<PostForPostList[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(true);
  const [postError, setPostError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setPostLoading(true);
    setPostError(null);
    try {
      const response = await fetch('/api/postList');
      if (!response.ok) {
        throw new Error('無法取得文章資料');
      }
      const data: PostForPostList[] = await response.json();

      setDbPostsList(data);
    } catch (err) {
      setPostError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsListContext.Provider value={{ dbPostsList, postLoading, postError, refreshPosts: fetchPosts }}>
      {children}
    </PostsListContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsListContext);
  if (!context) {
    throw new Error('usePosts 必須在 PostsListProvider 內部使用');
  }
  return context;
}