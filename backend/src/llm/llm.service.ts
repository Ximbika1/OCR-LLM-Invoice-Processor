import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LLMService {
  async explainText(text: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: 'Você é um assistente que explica documentos financeiros.' },
            { role: 'user', content: text },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000', // substitua pelo domínio real se necessário
            'X-Title': 'Paggo OCR',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao consultar DeepSeek:', error?.response?.data || error.message || error);
      console.log('ERRO LOGO EMBAIXO')
      return 'Não foi possível gerar a explicação.';
    }
  }
}
