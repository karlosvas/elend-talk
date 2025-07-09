<script lang="ts">
   import { setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from '@/utils/store';
   import Dropzone from "svelte-file-dropzone";
   import { extractTextFromPDF } from '@/utils/pdfjs';
   import { appStatusInfo } from '@/utils/store';
  import  { type PDFInfo } from '@/types/types';

   // Archivos aceptados y rechazados
   let files: Record<string, any[]> = {
      accepted: [],
      rejected: []
   };

   // Manejador de archivos seleccionados
   async function handleFilesSelect(e: CustomEvent) {
    try {
      const modelSelect = document.getElementById("model-select") as HTMLSelectElement | null;

      if(modelSelect && modelSelect.value === "") 
            throw new Error("You must select a model before uploading a file");

         // Vlaidamos que solo se haya subido un archivo y que sea un pdf
         const { acceptedFiles, fileRejections } = e.detail;
         files = { 
            accepted: [...files.accepted, ...acceptedFiles],
            rejected: [...files.rejected, ...fileRejections]
         };
         if(files.rejected.length > 0) 
            throw new Error("Only PDF files are allowed");

         // Cambiamos el estado de la aplicacion a loading para activar el spinner
         setAppStatusLoading();

         // Extreamos información del pfd, se lo damos al estado de la aplicacion y lo subimos al servidor
         const newInfo: PDFInfo = await extractTextFromPDF(acceptedFiles[0]);
         // Añadimos el contexto al historial de chat de ollama el contexto
         appStatusInfo.set(newInfo);

         // Subimos el contexto al chat de ollama
         try {
            if(!newInfo.text) 
               throw new Error("The text could not be extracted from the PDF");

            const response = await fetch('/api/upload', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ context: newInfo.text })
            });

            if(!response.ok) 
               throw new Error("Error uploading file");
         } catch (error) {
            console.error(error);
         }
         
         // Si todo ha salido bien pasamos al modo chat
         setAppStatusChatMode();
   } catch (error: unknown) {
      console.error(error);
      if(error instanceof Error)
         setAppStatusError(error.message);
      else
         setAppStatusError("Error uploading file");
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