import { setAppStatusError } from "@/utils/store";
import { type SubmitOllamaParams } from "@/types/types";

/**
 * Envía datos a la API de Ollama y maneja la respuesta en streaming
 * @param event - El evento de envío del formulario
 * @param loading - Un store writable para rastrear el estado de carga
 * @param answer - Un store writable para acumular la respuesta de la IA
 */
export const submitOllama = async ({ event, loading, answer, model }: SubmitOllamaParams): Promise<void> => {
  // Obtener la pregunta del input del formulario y validar su existencia
  const question = event.target.question.value;
  if (!question || !model) return setAppStatusError("The question or model is missing");

  event.target.question.value = ""; // Limpiamos el formulario
  answer.set({ value: "" }); // Reiniciar el store de respuesta antes de obtener una nueva respuesta
  loading.set({ value: true });

  // Crear parámetros de URL para la solicitud a la API
  const searchParams = new URLSearchParams();
  searchParams.append("question", question);
  searchParams.append("model", model);

  try {
    // Inicializar la conexión de Server-Sent Events
    const eventSource = new EventSource(
      `api/ollama?question=${encodeURIComponent(question)}&model=${encodeURIComponent(model)}`
    );

    // Manejar los mensajes entrantes del stream
    eventSource.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      // Verificar si este es el final del stream
      if (data === "END") {
        eventSource.close();
        loading.set({ value: false });
        return;
      }

      // Añadir nuevo contenido a la respuesta existente
      answer.update((current) => {
        return { value: current.value + data.message.content };
      });
      // Cambiamos el scroll a la parte inferior de la página para que se vea la respuesta
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    };

    // Manejar cualquier error en la conexión de EventSource
    eventSource.onerror = (error) => {
      console.error("Error de EventSource:", error);
      eventSource.close();
    };
  } catch (error) {
    // Manejar cualquier error en el bloque try (errores de conexión)
    console.error("Error de stream:", error);
    setAppStatusError("Error al conectar con Ollama");
  }
};
