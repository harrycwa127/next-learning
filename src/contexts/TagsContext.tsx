'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Tag } from '@/components/TagDisplay';

interface TagsContextType {
  allTags: Tag[];
  tagLoading: boolean;
  tagError: string | null;
  refreshTags: () => Promise<void>; // 提供手動重新整理資料的函式
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: ReactNode }) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagLoading, setLoading] = useState<boolean>(true);
  const [tagError, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error('無法取得標籤資料');
      }
      const data = await response.json();

      setAllTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <TagsContext.Provider
      value={{ allTags, tagLoading, tagError, refreshTags: fetchTags }}
    >
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error('useTags 必須在 TagsProvider 內部使用');
  }
  return context;
}
