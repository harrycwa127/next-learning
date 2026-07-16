'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export default function AIChatCompent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [quotaError, setQuotaError] = useState<boolean>(false);

  const { t } = useTranslation(['aichat']);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  const sendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || loading || quotaError) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      const response = await fetch('/api/aichat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.status === 429 || data.error === 'quota_exceeded') {
        setQuotaError(true);
        setMessages((prev) => [
          ...prev, 
          { 
            role: 'model', 
            text: t('chat_quota_error') || '額度已用完，請稍後再試。', 
            isError: true 
          }
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { 
            role: 'model', 
            text: t('chat_response_unknown') || '無法解析 AI 的回覆。' 
          }
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev, 
        { 
          role: 'model', 
          text: t('chat_error') || '連線失敗，請稍後再試。', 
          isError: true 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-xl dark:shadow-2xl dark:shadow-black/40 overflow-hidden flex flex-col h-[600px] transition-all duration-300">
      
      <div className="bg-zinc-50 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-4 transition-colors duration-300">
        <h2 className="text-lg font-bold tracking-wide text-zinc-900 dark:text-zinc-100">
          {t('chat_title') || 'Gemini AI 智能助手'}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {t('chat_description') || '隨時為您解答問題'}
        </p>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-950/60 transition-colors duration-300 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 space-y-2">
            <span className="text-4xl">💬</span>
            <p className="text-sm">{t('start_chat') || '開始與 Gemini AI 對話吧！輸入訊息並點擊發送。'}</p>
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
                  {isUser ? (t('chat_you') || '您') : (t('chat_ai') || 'AI 助手')}
                </span>
                
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed font-sans ${
                    isUser
                      ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-tr-none whitespace-pre-wrap'
                      : msg.isError
                        ? 'bg-red-50/50 dark:bg-red-950/10 text-red-800 dark:text-red-400 border border-red-200/60 dark:border-red-900/30 rounded-tl-none font-medium shadow-sm'
                        : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800/80 rounded-tl-none'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {isUser ? (
                    <p>{msg.text}</p>
                  ) : msg.isError ? (
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm leading-none mt-0.5">⚠️</span>
                      <p className="leading-snug">{msg.text}</p>
                    </div>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-zinc-950 dark:text-zinc-50">{children}</strong>,
                        h1: ({ children }) => <h1 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mt-4 mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mt-3 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mt-2 mb-1">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-zinc-700 dark:text-zinc-300">{children}</li>,
                        hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-800" />,
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match && !String(children).includes('\n');
                          return isInline ? (
                            <code className="bg-zinc-100 dark:bg-zinc-800 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 p-4 rounded-xl overflow-x-auto my-3 font-mono text-xs border border-zinc-200 dark:border-zinc-800/80 w-full">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        }
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {loading && (
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-1 px-1">
              {t('chat_ai') || 'AI 助手'}
            </span>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/85 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 shadow-sm flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {quotaError && (
        <div className="bg-amber-50/90 dark:bg-amber-950/20 border-t border-amber-200/80 dark:border-amber-900/40 px-6 py-3 text-xs text-amber-800 dark:text-amber-400 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span className="font-medium">{t('chat_quota_banner') || '偵測到額度已達上限，請稍後再試。'}</span>
          </div>
          <button 
            type="button"
            onClick={() => setQuotaError(false)}
            className="text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-300 font-bold px-1.5 py-0.5 rounded transition-colors duration-150"
          >
            ✕
          </button>
        </div>
      )}

      <form
        onSubmit={sendMessage}
        className={`border-t bg-white dark:bg-zinc-900/90 p-4 flex gap-3 items-center transition-all duration-300 ${
          quotaError 
            ? 'border-amber-200/80 dark:border-amber-900/40' 
            : 'border-zinc-200 dark:border-zinc-800/80'
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat_enter_question') || '輸入您的問題...'}
          className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 disabled:bg-zinc-50/80 dark:disabled:bg-zinc-950/80 disabled:text-zinc-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed"
          disabled={loading || quotaError}
        />
        <button
          type="submit"
          disabled={loading || quotaError}
          className="rounded-xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:bg-zinc-100 dark:disabled:bg-zinc-800/50 disabled:text-zinc-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed disabled:shadow-none shadow-md shadow-blue-100 dark:shadow-none"
        >
          {t('chat_send') || '發送'}
        </button>
      </form>
    </div>
  );
}