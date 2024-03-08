import { type APIRoute } from "astro"
import { readFile } from 'node:fs/promises'
import { responseSSE } from '../utils/sse.ts'
import ollama from 'ollama'

// Create a model
const modelFile = `
FROM llama2

SYSTEM "Eres un investigador español experimentado, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context>, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar únicamente información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No intentes inventar una respuesta. Cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario."
`
await ollama.create({ model: 'llama2', modelfile: modelFile })

console.log('Model created')

// Create a chat response
export const GET: APIRoute = async ({ request }) => {
   const url = new URL(request.url);
   const id = url.searchParams.get('id');
   const question = url.searchParams.get('question');

   console.log("id: ", id, "question: ", question, "url: ", url)

   if (!id || !question) {
      return new Response("Missing parameters", { status: 400 })
   }

   const text = await readFile(`public/texts/${id}.txt`, 'utf-8')
   return responseSSE({ request }, async (sendEvent) => {
      const message = [{
         role: 'user',
         content: `<context>${text}</context><question>${question}</question>`
      }];

      const response = await ollama.chat({
         model: 'llama2',
         messages: [message[0]],
         stream: true
      })

      for await (const part of response) {
         console.log(part.message.content)
         sendEvent(process.stdout.write(part.message.content))
      }

      sendEvent('END')
   });
}