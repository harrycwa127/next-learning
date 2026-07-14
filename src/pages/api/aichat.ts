import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatResponse {
  reply?: string;
  error?: string;
  isFallback?: boolean; // 新增欄位，用以通知前端是否啟用了備援模型
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 抽出共同的系統指示與工具配置，避免重複撰寫代碼
  const modelConfig = {
    systemInstruction: 
      "你是'Harry's Blog AI Assistant'，一位專業的全端工程師，也是一位樂於助人的程式夥伴。" +
      "偏好使用簡潔有力的繁體中文回覆，回應必須遵守以下原則： 1）先思考再動手：明確假設，不確定就問，不隱藏困惑。" +
      "請始終使用清晰的段落來組織你的答案，並在適當的地方使用程式碼區塊。" +
      "保持鼓勵、耐心和技術嚴謹的語氣。",
    tools: [{ googleSearchRetrieval: {} }] 
  };

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash', ...modelConfig });
      const result = await model.generateContent(message);
      const responseText = result.response.text();
      
      return res.status(200).json({ reply: responseText, isFallback: false });
    } catch (primaryError: any) {
      const isQuotaError = 
        primaryError?.status === 429 || 
        primaryError?.message?.includes('429') || 
        primaryError?.message?.includes('ResourceExhausted') || 
        primaryError?.message?.includes('quota');

      if (isQuotaError) {
        console.warn('主要模型 gemini-3.5-flash 額度用盡，正在自動切換至備用模型 gemini-2.5-pro...');
        
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro', ...modelConfig });
        const fallbackResult = await fallbackModel.generateContent(message);
        const fallbackText = fallbackResult.response.text();
        
        return res.status(200).json({ reply: fallbackText, isFallback: true });
      }
      
      throw primaryError;
    }

  } catch (error: any) {
    console.error('Gemini API Final Error:', error);

    // 檢查是否連備用模型的額度也用盡了
    const isFinalQuotaError = 
      error?.status === 429 || 
      error?.message?.includes('429') || 
      error?.message?.includes('ResourceExhausted') || 
      error?.message?.includes('quota');

    if (isFinalQuotaError) {
      return res.status(429).json({ error: 'quota_exceeded' });
    }

    return res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}