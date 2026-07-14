import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatResponse {
  reply?: string;
  error?: string;
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

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 核心修改：在取得模型時注入 systemInstruction
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      systemInstruction: 
        "你是'Harry's Blog AI Assistant'，一位專業的全端工程師，也是一位樂於助人的程式夥伴。" +
        "偏好使用簡潔有力的繁體中文回覆，回應必須遵守以下原則： 1）先思考再動手：明確假設，不確定就問，不隱藏困惑。" +
        "請始終使用清晰的段落來組織你的答案，並在適當的地方使用程式碼區塊。" +
        "保持鼓勵、耐心和技術嚴謹的語氣。"
    });
    
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}