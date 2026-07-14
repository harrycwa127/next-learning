'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';

// 定義訊息物件的型別
interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatCompent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation(['aichat']);

  // 建立一個 Ref 用於監控聊天視窗底部
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 當訊息數量改變時，自動將視窗滾動到最下方
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.reply) {
        // 3. 將 AI 回覆加入狀態
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: '無法解析 AI 的回覆。' },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: '連線失敗，請稍後再試。' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 flex h-[600px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-900/50 dark:shadow-2xl dark:shadow-black/40">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/90">
        <h2 className="text-lg font-bold tracking-wide text-gray-900 dark:text-gray-100">
          {t('chat_title')}
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('chat_description')}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-6 transition-colors duration-300 dark:bg-gray-950/60">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-gray-400 dark:text-gray-600">
            <span className="text-4xl">💬</span>
            <p className="text-sm">
              {t('start_chat')}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex w-full ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'rounded-tr-none bg-blue-600 text-white dark:bg-blue-500'
                      : 'rounded-tl-none border border-gray-100 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}

        {/* 思考中動畫 */}
        {loading && (
          <div className="flex items-center justify-start space-x-2">
            <div className="flex items-center space-x-1.5 rounded-2xl rounded-tl-none border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm dark:border-gray-700/85 dark:bg-gray-900 dark:text-gray-400">
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-600"
                style={{ animationDelay: '0ms' }}
              ></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-600"
                style={{ animationDelay: '150ms' }}
              ></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-600"
                style={{ animationDelay: '300ms' }}
              ></span>
            </div>
          </div>
        )}

        {/* 用於錨定滾動的最底部隱形元素 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部輸入表單：維持與卡片同底色，確保底線邊框 dark:border-gray-700 完美咬合 */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 border-t border-gray-200 bg-white p-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/90"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat_enter_question')}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-950/50 dark:disabled:bg-gray-900"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:shadow-none dark:hover:bg-blue-600"
        >
          {t('chat_send')}
        </button>
      </form>
    </div>
  );
}
