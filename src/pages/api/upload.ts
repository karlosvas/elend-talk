import { chatHistory } from "@/config/ollamaConfig";
import { type APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Leer el cuerpo de la solicitud
    const { context } = await request.json();
    console.log("Context received:", context);
    chatHistory.addMessage("system", `<context>${context}</context>`);

    // Return 204 no content
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error processing request to add context:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
