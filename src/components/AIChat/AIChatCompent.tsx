'use client';

import { useState, FormEvent } from 'react';

// 定義訊息物件的型別
interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatCompent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    // 1. 將使用者訊息加入狀態
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      // 2. 呼叫 TypeScript 後端 API
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
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Gemini AI TypeScript 聊天室</h2>
      
      {/* 歷史對話區 */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', height: '400px', overflowY: 'auto', padding: '15px', marginBottom: '20px', background: '#f9f9f9' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '10px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#0070f3' : '#e5e5ea',
              color: msg.role === 'user' ? '#fff' : '#000',
              maxWidth: '80%',
              wordBreak: 'break-word'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: '#888', fontStyle: 'italic' }}>AI 思考中...</div>}
      </div>

      {/* 輸入表單 */}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="請輸入訊息..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer' }}>
          發送
        </button>
      </form>
    </div>
  );
}