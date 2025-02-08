import { type Writable } from "svelte/store";

export interface SubmitOllamaParams {
  event: Event & {
    target: {
      question: {
        value: string;
      };
    };
  };
  loading: Writable<{ value: boolean }>;
  answer: Writable<{ value: string }>;
}
