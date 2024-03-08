<script>
   import { Input,  Label, Spinner} from 'flowbite-svelte';
   import { appStatusInfo, setAppStatusError } from '../store.ts';
   const { url, pages, id } = $appStatusInfo;

   let loading = false;
   let answer = "";

   // Maximum images to display
   const maxImagesToShow = Math.min(pages, 4);
   const images = Array.from({ length: maxImagesToShow }, (_, i) => {
   const page = i + 1;
   console.log(url)
   return url
      .replace('/upload/', `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace('.pdf', '.jpg');
   });

   const handleSumit = async (event) => {
      event.preventDefault();

      loading = true;
      answer = "";
      
      const question = event.target.question.value;

      const searchParams = new URLSearchParams();
      searchParams.append('id', id);
      searchParams.append('question', question);

      try{
         // const evertSource = new EventSource(`api/ask?${searchParams.toString()}`);
         const evertSource = new EventSource(`api/ollama?${searchParams.toString()}`);
         console.log("Event Source: ", evertSource)

         evertSource.onemessage = (event) => {
            loading = false;
            const incomingData = JSON.stringify(event.data);
            
            if(incomingData === 'END'){
               evertSource.close();
               return
            }
            
            answer += incomingData;
         }

      } catch (error) {
         setAppStatusError();
         return
      } finally {
         loading = false;
      }

      
   }
</script>

<div clas="grid grid-cols-4 gap-2">
   {#each images as image }
      <img src={image} alt="PDF page" class="rounded w-1/2 h-auto aspect-[400/540]" />
   {/each}
</div>

<form class='mt-8' on:submit={handleSumit}>
  <Label for="question" class="block mb-2">Leave your question here</Label>
  <Input 
    id="question"
    required
    placeholder="What is this document about?"
  ></Input>
</form>

{#if loading}
   <div class="felx justify-center items-center flex-col gap-y-2">
      <Spinner />
      <p class="opacity-75">Thinking</p>
   </div>
{/if}

{#if answer}
   <div class="mt-8">
      <p class="font-medium">Response</p>
      <p>{answer}</p>
   </div>
{/if}