import { setAppStatusError } from "../store";
import { type SubmitOllamaParams } from "../types/types";

// Función para enviar la pregunta con ollama
export const submitOllama = async ({ event, loading, answer }: SubmitOllamaParams): Promise<void> => {
  event.preventDefault();

  // EventSource para la conexión con el servidor
  let eventSource: EventSource | null = null;

  // Obtener pregunta y generar un identificador único
  const question = event.target.question.value;

  // Le pasamos la pregunta a la API de ollama por medio de la URL
  const searchParams = new URLSearchParams();
  searchParams.append("question", question);

  try {
    const eventSource = new EventSource(`api/ollama?${searchParams.toString()}`);

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data === "END") {
          eventSource.close();
          loading.value = false;
          return;
        }

        answer.value += data.message;
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
      loading.value = false;
    };
  } catch (error) {
    console.error("Stream error:", error);
    loading.value = false;
  }
};
