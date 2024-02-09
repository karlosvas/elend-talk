import { type APIRoute } from "astro"
// import { readFile } from 'node:fs/promises'
// import OpenAI from 'openai'

// const openai = new OpenAI({
//    apiKey: import.meta.env.OPENAI_API_KEY
// })

export const POST: APIRoute = async ({ request }) => {
   return new Response(JSON.stringify({
      response: ''
   }));
};