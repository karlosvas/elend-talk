export interface SubmitOllamaParams {
  event: Event & {
    target: {
      question: {
        value: string;
      };
    };
  };
  loading: {
    value: boolean;
  };
  answer: {
    value: string;
  };
}
