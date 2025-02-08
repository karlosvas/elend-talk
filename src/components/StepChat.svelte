<script>
   import { Input,  Label, Spinner} from 'flowbite-svelte';
   import { appStatusInfo, setAppStatusError } from '../store.ts';
   const { url, pages, id } = $appStatusInfo;
   import { getCloudinaryImg } from '../services/cloudinaryService.ts';
   import { submitOllama } from '../services/ollamaService.ts';
   import { writable } from 'svelte/store';
   import { marked } from 'marked';

   // Variables de estado
   export let loading = writable({value: false});
   export let answer = writable({value: "hola que tal jdf  fihwfg ihg asknfkrn ngkhw ghks nhsnsig hks khs gkhskhsg hshgfs hhsgkhsgkhfs sg sf kgsh gkhsgkhsgkhgs ksghgsh aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa supercalifragilisticoespiralidosodelrevesyd hipopotamo ksghgsh aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa supercalifragilisticoespiralidosodelrevesyd hipopotamo ksghgsh aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa supercalifragilisticoespiralidosodelrevesyd hipopotamo ksghgsh aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa supercalifragilisticoespiralidosodelrevesyd hipopotamo ksghgsh aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa supercalifragilisticoespiralidosodelrevesyd hipopotamo ksghgsh aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa supercalifragilisticoespiralidosodelrevesyd hipopotamo "});

   // Función para obtener las imágenes de cloudinary, devuelbe string[]
   let images = getCloudinaryImg(url, pages);

   // Datos adicionales que se enviarán al servidor, clicando en el botón de enviar
   const handleSubmit =  async (event) => {
      try{
         await submitOllama({ event, loading, answer });
         console.log(answer.value);
      } catch (error) {
         setAppStatusError(error);
      }
  };

  $: htmlContent = $answer?.value ? marked($answer.value) : '';
</script>

<!-- Mostramos las imágenes de las páginas del PDF -->
<div class="flex flex-row gap-4 overflow-x-auto p-4">
   {#each images as image }
      <img 
         src={image} 
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

{#if $loading.value}
   <div class="felx justify-center items-center flex-col gap-y-2">
      <Spinner />
      <p class="opacity-75">Thinking</p>
   </div>
{/if}

{#if $answer.value.length > 0}
   <div class="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4 text-white">Response</h2>
      <div class="text-lg text-gray-300 whitespace-pre-wrap break-words hyphens-auto">
         {@html htmlContent}
      </div>
   </div>
{/if}