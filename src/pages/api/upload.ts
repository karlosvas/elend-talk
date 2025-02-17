import { chatHistory } from "@/config/ollamaConfig";
import { type APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  // Leer el cuerpo de la solicitud
  const { context } = await request.json();
  chatHistory.addMessage("system", `<context>${context}</context>`);

  // Return 204 no content
  return new Response(null, { status: 204 });
};
