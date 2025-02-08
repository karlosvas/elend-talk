import { setAppStatusError } from "../store";
import { type SubmitOllamaParams } from "../types/types";

// Función para enviar la pregunta con ollama
export const submitOllama = async ({ event, loading, answer }: SubmitOllamaParams): Promise<void> => {
  event.preventDefault();

  const updateAnswer = (newText: string) => {
    answer.update((current) => {
      return { value: current.value + newText };
    });
  };

  const updateLoading = (newLoading: boolean) => {
    loading.update(() => {
      return { value: newLoading };
    });
  };

  // Elimanar el mensaje writeable
  answer.update(() => {
    return { value: "" };
  });

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
          // Añadir un salto de linea al terminar el mensaje
          eventSource.close();
          updateLoading(false);
          return;
        }

        updateAnswer(data.message.content);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
      updateLoading(false);
    };
  } catch (error) {
    console.error("Stream error:", error);
    updateLoading(false);
    setAppStatusError("Error connecting to ollama");
  }
};
