import { setAppStatusError } from "@/utils/store";
import { type SubmitOllamaParams } from "@/types/types";

export const submitOllama = async ({ event, loading, answer }: SubmitOllamaParams): Promise<void> => {
  event.preventDefault();

  // Elimanar el mensaje writeable
  answer.set({ value: "" });

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
          loading.set({ value: false });
          return;
        }

        answer.update((current) => {
          return { value: current.value + data.message.content };
        });
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
      loading.set({ value: false });
    };
  } catch (error) {
    console.error("Stream error:", error);
    loading.set({ value: false });
    setAppStatusError("Error connecting to ollama");
  }
};
