<script>
   import { setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from '../store.ts';
   import Dropzone from "svelte-file-dropzone";

   // Archivos aceptados y rechazados
   let files = {
      accepted: [],
      rejected: []
   };

   // Escojemos archivos
   async function handleFilesSelect(e) {
      const { acceptedFiles, fileRejections } = e.detail;
      files.accepted = [...files.accepted, ...acceptedFiles];
      files.rejected = [...files.rejected, ...fileRejections];
      
      // Obtenemos el nuevo estado de los archivos si hay alguno
      if(acceptedFiles.length > 0) {
         // Pasamos a estado de carga
         setAppStatusLoading();

         // Creamos un objeto FormData para enviar el archivo
         const formData = new FormData();
         formData.append('file', acceptedFiles[0]);

         // Enviamos el archivo al servidor para alamcenarlo en cloudinary
         const res = await fetch('api/upload', {
            method: 'POST',
            body: formData,
            headers: {
               'Accept': 'application/json'
            }
         });

         // Si hay un error, pasamos a estado de error
         if(!res.ok) {
            setAppStatusError();
            return;
         }  

         // Obtenemos la respuesta del servidor
         const { id, url, pages } = await res.json();
         setAppStatusChatMode({ id, url, pages });
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