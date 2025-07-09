<script lang="ts">
   import { Input,  Label} from 'flowbite-svelte';
   import { writable, type Writable } from 'svelte/store';
   import { marked } from 'marked';
   import { appStatusInfo, setAppStatusError } from '@/utils/store';
   import { submitOllama } from '@/services/ollamaService';
   import { stringToOllamaModel, type OllamaModel } from '@/types/types';
   import { getCookie } from '@/utils/cookies';
   import StepLoading from './StepLoading.svelte';

   // Variables de estado, cargando y procesando respuesta respuesta
   export let loading:Writable<{ value: boolean }>  = writable({value: false});
   export let answer:Writable<{ value: string }> = writable({value: ""});

   // Enviar respuesta a ollama
   const handleSubmit =  async (event: any) => {
      event.preventDefault();
      try{
         
         // Obtenemos el modelo de la cookie "selectedModel", no del valor del select
         const model = getCookie("selectedModel") as string || undefined;
         if(!model) {
            setAppStatusError("You must select a model before asking a question");
            return;
         }
         
         const ollamaModel = stringToOllamaModel(model) as OllamaModel || null;
         if(!ollamaModel) {
            setAppStatusError("Invalid model selected");
            return;
         }
         
         loading.set({ value: true });
         await submitOllama({ event, loading, answer, model: ollamaModel });
      } catch (error) {
         setAppStatusError(error as string);
      }
  };

  $: htmlContent = $answer?.value ? marked($answer.value) : '';
</script>

<!-- Mostramos las imágenes de las páginas del PDF -->
<div class="flex flex-row gap-4 overflow-x-auto p-4">
   {#each $appStatusInfo.images as url }
      <img 
         src={url} 
         alt="PDF page" 
         class="rounded w-auto h-64 object-contain"
      />
   {/each}
</div>

<!-- Formulario para enviar la pregunta -->
<form class='mt-8' on:submit={handleSubmit}>
  <Label for="question" class="block mb-2 text-white">Leave your question here</Label>
  <Input 
    id="question"
    name="question"
    required
    placeholder="What is this document about?"
  ></Input>
</form>

<!-- Mostramos la respuesta de ollama -->
{#if $answer.value.length > 0}
   <div class="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-white">Response</h2>
      <div class="text-lg text-gray-300 whitespace-pre-wrap break-words hyphens-auto">
         {@html htmlContent}
      </div>
   </div>
{:else if $loading.value}
   <div class="mt-10">
      <StepLoading />
   </div>
{/if}