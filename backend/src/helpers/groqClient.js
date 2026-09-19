import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()


export const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export const groqChatModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'