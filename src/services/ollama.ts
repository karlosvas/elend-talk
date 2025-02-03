import { setAppStatusError } from "../store";

// Función para enviar la pregunta
interface SubmitOllamaTarget extends EventTarget {
  question: {
    value: string;
  };
}

interface SubmitOllamaEvent extends Event {
  target: SubmitOllamaTarget;
}

interface SubmitOllamaParams {
  event: SubmitOllamaEvent;
  loading: boolean;
  answer: string;
}

export const submitOllama = async ({ event }: SubmitOllamaParams): Promise<void> => {
  event.preventDefault();

  let loading = true;
  let answer = "";

  const question = event.target.question.value;

  const searchParams = new URLSearchParams();
  searchParams.append("id", id);
  searchParams.append("question", question);

  try {
    const evertSource = new EventSource(`api/ollama?${searchParams.toString()}`);
    console.log("Event Source: ", evertSource);

    evertSource.onmessage = (event: MessageEvent) => {
      loading = false;
      const incomingData = JSON.stringify(event.data);

      if (incomingData === "END") {
        evertSource.close();
        return;
      }

      answer += incomingData;
    };
  } catch (error) {
    setAppStatusError();
    return;
  } finally {
    loading = false;
  }
};
