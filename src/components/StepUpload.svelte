<script>
   import { setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from '../utils/store';
   import Dropzone from "svelte-file-dropzone";
   import { extractTextFromPDF } from '..//utils/pdfjs';

   // Archivos aceptados y rechazados
   let files = {
      accepted: [],
      rejected: []
   };

   async function handleFilesSelect(e) {
    try {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
        
        setAppStatusLoading();

        const text = await extractTextFromPDF(acceptedFiles[0]);
        console.log(text);

        setAppStatusChatMode({ id:"1", url: "1", page:0, text });
         // TODO: Creditos terminados
         // const formData = new FormData();
         // formData.append('file', acceptedFiles[0]);
         // Enviamos el archivo al servidor para alamcenarlo en cloudinary
         // const res = await fetch('api/upload', {
         //    method: 'POST',
         //    body: formData,
         //    headers: {
         //       'Accept': 'application/json'
         //    }
         // });
         // Si hay un error, pasamos a estado de error
         //if(!res.ok) {
         //    setAppStatusError();
         //    return;
         // }  

         // // Obtenemos la respuesta del servidor
         // const { id, url, pages } = await res.json();
         // setAppStatusChatMode({ id, url, pages });
   } catch (error) {
      console.error(error);
      setAppStatusError();
   }
}
</script>

<!-- Si aun no hay archivos subidos, mostramos el grag and drop -->
{#if files.accepted.length === 0}
   <Dropzone
      accept='application/pdf'
      multiple={false}
      on:drop={handleFilesSelect}>
   </Dropzone>
{/if}

<!-- Mostramos los archivos aceptados -->
<ol>
  {#each files.accepted as item}
    <li>{item.name}</li>
  {/each}
</ol>