<script lang="ts">
   import { Input,  Label, Spinner} from 'flowbite-svelte';
   import { writable, type Writable } from 'svelte/store';
   import { marked } from 'marked';
   import { appStatusInfo, setAppStatusError } from '@/utils/store';
   import { submitOllama } from '@/services/ollamaService';
   
   // Variables de estado, cargando y procesando respuesta respuesta
   export let loading:Writable<{ value: boolean }>  = writable({value: false});
   export let answer:Writable<{ value: string }> = writable({value: ""});

   // Enviar respuesta a ollama
   const handleSubmit =  async (event: any) => {
      event.preventDefault();
      try{
         await submitOllama({ event, loading, answer });
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
    required
    placeholder="What is this document about?"
  ></Input>
</form>

<!-- Spinner de carga -->
{#if $loading.value}
   <div class="felx justify-center items-center flex-col gap-y-2">
      <Spinner />
      <p class="opacity-75">Thinking</p>
   </div>
{/if}

<!-- Mostramos la respuesta de ollama -->
{#if $answer.value.length > 0}
   <div class="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-white">Response</h2>
      <div class="text-lg text-gray-300 whitespace-pre-wrap break-words hyphens-auto">
         {@html htmlContent}
      </div>
   </div>
{/if}