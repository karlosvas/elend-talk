# Elend Talk

Welcome to our amazing Elend Talk web application!

Are you ready to interact with your PDF documents in a whole new way? Look no further! With our cutting-edge technology, you can upload any PDF and start asking questions about its content. using the power of Ollama our app will extract the text from your PDF and provide you with instant answers to your queries. It's like having a personal assistant for your documents!
![PreviewAPP](./public/preview.webp)

## Features 🚀

- **PDF to Text Conversion**: Seamlessly extract text from your PDF files.
- **Interactive Q&A**: Ask questions based on the extracted text and get instant responses.
- **Intuitive Interface**: Enjoy a user-friendly design that makes navigation a breeze.

## How to Use 📝

**Upload Your PDF**: Simply select the PDF file you want to analyze.  
**Ask Questions**: Type in any question related to the content of the PDF.  
**Get Answers**: Our application will process the text and provide relevant responses in no time.

## Example Usage 🤖

1. Upload a research paper, manual, or any document.
2. Ask specific questions about the content.
3. Receive instant and accurate answers.

## Technologies Used 💻

- **TypeScript**: Harness the power of statically typed JavaScript.
- **Svelte**: Embrace the future of web development with reactive components.
- **Astro**: Build faster websites with modern tools and best practices.
- **JavaScript**: The backbone of our frontend development, adding interactivity and dynamism.

## Installation 🛠️

## Ollama Installation 🤖

Before running the application, you need to install Ollama 3.2:

### Windows

Download and run the Windows installer from: https://ollama.ai/download/windows

### Linux and macOS

```bash
curl https://ollama.ai/install.sh | sh
```

### Setup Ollama

1. Obtain the Ollama model you want to use.

```bash
sudo ollama serve
ollama pull llama3.2:latest # for example
## To use a different model, update the model name in `src/config/constants.ts`.
export const MODEL_OLLAMA = "llama3.2";
```

2. Clone this repository:

```bash
git clone https://github.com/your-username/pdf-to-talk.git
```

3. Install dependencies, compile project and start the application:

```bash
pnpm install
pnpm run build
pnpm run dev
```

### Requirements

Node.js, Compatible web browser ✅

## Contributions 🙌

We welcome contributions! If you have ideas on how to improve this application, feel free to send us a pull request or open issues for bug fixes. We value your feedback and involvement in making this project even better!

## License 📄

This project is licensed under the GPL License.

## Contact Us 📧

Got questions or suggestions? Reach out to us at carlosvassan@gmail.com. We'd love to hear from you!
