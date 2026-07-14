'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatCompent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation(['aichat']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: '無法解析 AI 的回覆。' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', text: '連線失敗，請稍後再試。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-xl dark:shadow-2xl dark:shadow-black/40 overflow-hidden flex flex-col h-[600px] transition-all duration-300">
      
      <div className="bg-zinc-50 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-4 transition-colors duration-300">
        <h2 className="text-lg font-bold tracking-wide text-zinc-900 dark:text-zinc-100">{t('chat_title')}</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{t('chat_description')}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-950/60 transition-colors duration-300">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 space-y-2">
            <span className="text-4xl">💬</span>
            <p className="text-sm">{t('start_chat')}</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-1 px-1">
                  {isUser ? t('chat_you') : t('chat_ai')}
                </span>
                
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap font-sans ${
                    isUser
                      ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-tr-none'
                      : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800/80 rounded-tl-none'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        
        {loading && (
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-1 px-1">{t('chat_ai')}</span>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/85 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 shadow-sm flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 p-4 flex gap-3 items-center transition-colors duration-300"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat_enter_question')}
          className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 disabled:bg-zinc-50 dark:disabled:bg-zinc-900"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-blue-100 dark:shadow-none"
        >
          {t('chat_send')}
        </button>
      </form>
    </div>
  );
}