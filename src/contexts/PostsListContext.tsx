'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PostForPostList } from '@/components/PostList';

// 2. 定義 Context 共享狀態的介面
interface PostsListContextType {
  dbPostsList: PostForPostList[];
  postLoading: boolean;
  postError: string | null;
  refreshTags: () => Promise<void>; // 提供手動重新整理資料的函式
}

const PostsListContext = createContext<PostsListContextType | undefined>(undefined);

export function PostsListProvider({ children }: { children: ReactNode }) {
  const [dbPostsList, setDbPostsList] = useState<PostForPostList[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(true);
  const [postError, setPostError] = useState<string | null>(null);

  const fetchTags = async () => {
    setPostLoading(true);
    setPostError(null);
    try {
      const response = await fetch('/api/postsList');
      if (!response.ok) {
        throw new Error('無法取得文章資料');
      }
      const data = await response.json();

      setDbPostsList(data);
    } catch (err) {
      setPostError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <PostsListContext.Provider value={{ dbPostsList, postLoading, postError, refreshTags: fetchTags }}>
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