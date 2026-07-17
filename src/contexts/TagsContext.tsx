'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tag } from '@/components/TagDisplay';  

// 2. 定義 Context 共享狀態的介面
interface TagsContextType {
  allTags: Tag[];
  loading: boolean;
  error: string | null;
  refreshTags: () => Promise<void>; // 提供手動重新整理資料的函式
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: ReactNode }) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 3. 封裝 API 請求與資料結構轉換邏輯
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

  // 首次掛載時自動執行一次
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <TagsContext.Provider value={{ allTags, loading, error, refreshTags: fetchTags }}>
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