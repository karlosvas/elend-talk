<script>
   import { Input,  Label, Spinner} from 'flowbite-svelte';
   import { appStatusInfo, setAppStatusError } from '../store.ts';
   const { url, pages, id } = $appStatusInfo;
   import { getCloudinaryImg } from '../services/cloudinaryService.ts';
   import { submitOllama } from '../services/ollamaService.ts';

   // Variables de estado
   let loading = {value: false};
   let answer = {value: ""};

   // Función para obtener las imágenes de cloudinary, devuelbe string[]
   let images = getCloudinaryImg(url, pages);

   // Datos adicionales que se enviarán al servidor, clicando en el botón de enviar
   const handleSubmit = (event) => {
    submitOllama({ event, loading, answer });
  };
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

{#if loading.value}
   <div class="felx justify-center items-center flex-col gap-y-2">
      <Spinner />
      <p class="opacity-75">Thinking</p>
   </div>
{/if}

{#if answer.value.length > 0}
   <div class="mt-8">
      <p class="font-medium">Response</p>
      <p>{answer}</p>
   </div>
{/if}