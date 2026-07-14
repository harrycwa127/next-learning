import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 定義回應資料的型別介面
interface ChatResponse {
  reply?: string;
  error?: string;
}

// 初始化 Gemini 實例
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  // 1. 限制僅允許 POST 方法
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 2. 核心修改：將模型指定為您要求的 gemini-3.5-flash
    // 註：若此名稱執行時拋出 NoSuchModel 錯誤，請自行核實並替換為您帳戶擁有的正確識別碼
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    
    // 3. 呼叫 API 產生內容
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}