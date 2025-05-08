# 🧾 Paggo OCR + LLM Invoice Processor

Projeto desenvolvido como parte de um desafio técnico. A aplicação permite que usuários autenticados enviem imagens de faturas, realizem OCR, recebam explicações interativas baseadas em IA (LLM) e façam o download do conteúdo extraído com as interações.

---

## Funcionalidades:

- Upload de imagens de faturas
- Extração de texto via OCR
- Explicações interativas com IA (DeepSeek)
- Autenticação com JWT
- Histórico de documentos enviados
- Download de PDF com texto extraído + respostas da IA

---

## Tecnologias usadas:

- **Frontend:** Next.js (React)
- **Backend:** NestJS
- **ORM:** Prisma
- **Banco de dados:** MySQL (via Railway)
- **OCR:** Tesseract.js
- **LLM:** DeepSeek via OpenRouter API
- **Auth:** JWT
- **Hospedagem:** Vercel (frontend) e Railway (backend)

---

## Para rodar o projeto localmente precisa ter:

- Node.js 18+
- Yarn (ou npm)
- Docker (opcional, para banco local)
- Conta no [OpenRouter](https://openrouter.ai)

---

### 🔐 Configuração das variáveis de ambiente

- Copie os arquivos de exemplo para `.env`:
