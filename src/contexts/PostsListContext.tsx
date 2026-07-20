'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PostForPostList } from '@/components/PostList';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

// 2. 定義 Context 共享狀態的介面
interface PostsListContextType {
  dbPostsList: PostForPostList[];
  postLoading: boolean;
  postError: string | null;
  refreshPosts: () => Promise<void>; // 提供手動重新整理資料的函式
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
      const response = await fetch('/api/postsList');
      if (!response.ok) {
        throw new Error('無法取得文章資料');
      }
      const data: PostForPostList[] = await response.json();

      const postMapToList = allPosts.map((post) => ({
        slug: post.slug,
        date: post.date,
        updateDate: post.updateDate || null,
        tag: post.tag || null,
        pin: post.pin || false,
        title: post.title,
        description: post.description,
        path: post.path,
      })) as PostForPostList[];

      const allPostsNewToOld = 
        [...data, ...postMapToList].sort((a, b) => {
          if (a.pin && !b.pin) return -1;
          if (!a.pin && b.pin) return 1;
      
          return compareDesc(new Date(a.date), new Date(b.date));
        }) || [];

      setDbPostsList(allPostsNewToOld);
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